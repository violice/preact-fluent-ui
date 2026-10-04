import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import {
  cp,
  lstat,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  realpath,
  rm,
  writeFile,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { basename, isAbsolute, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

const root = fileURLToPath(new URL('../', import.meta.url));
const artifactDirectory = join(root, '.artifacts/package');
const lock = JSON.parse(await readFile(join(root, 'package-lock.json'), 'utf8'));
const options = { preact: lock.packages['node_modules/preact'].version, tarball: undefined };
for (let index = 2; index < process.argv.length; index += 2) {
  const option = process.argv[index];
  assert(['--preact', '--tarball'].includes(option), `Unknown argument: ${option}`);
  assert(process.argv[index + 1], `Missing value for ${option}`);
  options[option.slice(2)] = process.argv[index + 1];
}
assert(/^\d+\.\d+\.\d+(?:-[\w.-]+)?$/.test(options.preact), 'Use an exact Preact version');
assert(!options.tarball || isAbsolute(options.tarball), '--tarball must be an absolute path');

function run(command, args, cwd, quiet = false) {
  return new Promise((resolveRun, reject) => {
    // npm's JavaScript entry point avoids spawning npm.cmd with shell:false on Windows.
    if (command === 'npm' && process.env.npm_execpath) {
      args = [process.env.npm_execpath, ...args];
      command = process.execPath;
    }
    const child = spawn(command, args, {
      cwd,
      shell: false,
      env: { ...process.env, NODE_PATH: '' },
    });
    let output = '';
    child.stdout.on('data', (data) => {
      output += data;
      if (!quiet) process.stdout.write(data);
    });
    child.stderr.on('data', (data) => {
      output += data;
      if (!quiet) process.stderr.write(data);
    });
    child.on('error', reject);
    child.on('close', (code) =>
      code === 0
        ? resolveRun(output)
        : reject(new Error(`${command} ${args.join(' ')} exited ${code}\n${output}`)),
    );
  });
}

async function filesIn(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    assert(!entry.isSymbolicLink(), `Installed package must not contain symlinks: ${path}`);
    if (entry.isDirectory())
      files.push(...(await filesIn(path)).map((file) => `${entry.name}/${file}`));
    else files.push(entry.name);
  }
  return files.sort();
}

function checkFileList(files) {
  for (const required of [
    'package.json',
    'README.md',
    'LICENSE',
    'THIRD_PARTY_NOTICES.txt',
    'licenses/fluent-system-icons.txt',
    'dist/index.js',
    'dist/index.d.ts',
    'dist/index.js.map',
    ...['theme', 'styles', 'reset', 'native-controls'].map((name) => `dist/${name}.css`),
  ]) {
    assert(files.includes(required), `Archive is missing ${required}`);
  }
  for (const file of files) {
    assert(
      /^(?:dist\/|licenses\/|package\.json$|README\.md$|LICENSE$|THIRD_PARTY_NOTICES\.txt$)/.test(
        file,
      ),
      `Unexpected archived file: ${file}`,
    );
    assert(
      !/(?:^|\/)(?:node_modules|src|tests|scripts|examples|gallery)(?:\/|$)/.test(file),
      `Private files must not be published: ${file}`,
    );
  }
}

// A source listed in sourcesContent may have no generated code. Decode only mapped
// segments and count which original sources the generated JavaScript really uses.
function mappedSources(map) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let sourceIndex = 0;
  const counts = new Map();
  for (const line of map.mappings.split(';')) {
    for (const segment of line.split(',')) {
      if (!segment) continue;
      const values = [];
      let value = 0;
      let shift = 0;
      for (const character of segment) {
        const digit = alphabet.indexOf(character);
        assert(digit >= 0, 'Invalid sourcemap VLQ digit');
        value += (digit & 31) * 2 ** shift;
        if (digit & 32) shift += 5;
        else {
          values.push(value & 1 ? -Math.floor(value / 2) : Math.floor(value / 2));
          value = 0;
          shift = 0;
        }
      }
      assert.equal(shift, 0, 'Incomplete sourcemap VLQ');
      if (values.length < 4) continue;
      sourceIndex += values[1];
      const source = map.sources[sourceIndex];
      assert.equal(typeof source, 'string', 'Mapped source index must exist');
      counts.set(source, (counts.get(source) ?? 0) + 1);
    }
  }
  return Object.fromEntries([...counts].sort());
}

function runtimeImports(js) {
  return [...js.matchAll(/\bfrom\s*['"]([^'"]+)['"]|\bimport\s*(?:\(\s*)?['"]([^'"]+)['"]/g)].map(
    (match) => match[1] ?? match[2],
  );
}

async function inspectLibrary(directory, files) {
  const manifest = JSON.parse(await readFile(join(directory, 'package.json'), 'utf8'));
  assert.equal(manifest.name, '@violice/preact-fluent-ui');
  assert.equal(manifest.type, 'module');
  assert.deepEqual(
    manifest.sideEffects,
    ['**/*.css'],
    'CSS imports must be retained as side effects',
  );
  assert.deepEqual(Object.keys(manifest.exports).sort(), [
    '.',
    './native-controls.css',
    './reset.css',
    './styles.css',
    './theme.css',
  ]);
  for (const css of ['theme', 'styles', 'reset', 'native-controls']) {
    assert.equal(
      manifest.exports[`./${css}.css`],
      `./dist/${css}.css`,
      `Missing CSS export: ${css}`,
    );
    assert((await readFile(join(directory, `dist/${css}.css`))).length > 0, `Empty CSS: ${css}`);
  }
  assert.equal(manifest.exports['.'].types, './dist/index.d.ts');
  assert.equal(manifest.exports['.'].import, './dist/index.js');
  const imports = new Set();
  const maps = [];
  for (const file of files.filter((file) => file.endsWith('.js'))) {
    const js = await readFile(join(directory, file), 'utf8');
    for (const id of runtimeImports(js)) imports.add(id);
    assert(
      !runtimeImports(js).some((id) => id.endsWith('.css')),
      'Library JavaScript must not import CSS',
    );
  }
  for (const id of imports) {
    assert(id === 'preact' || id.startsWith('preact/'), `Unexpected library runtime import: ${id}`);
  }
  assert(imports.size > 0, 'Library must retain its external Preact imports');
  for (const file of files.filter((file) => file.endsWith('.map'))) {
    const map = JSON.parse(await readFile(join(directory, file), 'utf8'));
    assert.equal(map.version, 3);
    assert(
      !map.sourceRoot || (!isAbsolute(map.sourceRoot) && !/^[a-z]+:/i.test(map.sourceRoot)),
      'Sourcemap sourceRoot must be relative',
    );
    assert(
      map.sources.length > 0 && map.sources.length === map.sourcesContent.length,
      'Published map must include source content',
    );
    for (const [index, source] of map.sources.entries()) {
      const normalized = source.replaceAll('\\', '/');
      assert(
        !isAbsolute(source) && !/^[a-z]+:/i.test(normalized),
        `Absolute sourcemap source: ${source}`,
      );
      assert(
        !/(?:^|\/)preact(?:\/|$)/.test(normalized),
        `Library must not embed Preact: ${source}`,
      );
      assert(
        /^\.\.\/(?:src\/(?:classes\.ts|components\/[^/]+\.(?:tsx|module\.css)|icons\/[^/]+\.(?:ts|tsx|module\.css))|node_modules\/(?:clsx|class-variance-authority)\/dist\/[^/]+\.mjs)$/.test(
          normalized,
        ) && !/\.test\./.test(normalized),
        `Unrelated source content in published map: ${source}`,
      );
      assert.equal(typeof map.sourcesContent[index], 'string');
      assert(map.sourcesContent[index].length > 0, `Missing published source content: ${source}`);
    }
    maps.push({ file, sources: map.sources, mappedSources: mappedSources(map) });
  }
  assert(maps.some((map) => map.file === 'dist/index.js.map'));
  const librarySources = maps.flatMap((map) => map.sources);
  for (const helper of ['clsx', 'class-variance-authority']) {
    assert(
      librarySources.some((source) => source.includes(`/node_modules/${helper}/`)),
      `${helper} must be bundled`,
    );
    assert(
      ![...imports].some((id) => id === helper || id.startsWith(`${helper}/`)),
      `${helper} must not remain external`,
    );
  }
  return { imports: [...imports].sort(), maps };
}

async function inspectConsumer(directory, mode) {
  const graph = JSON.parse(
    await readFile(join(directory, `.artifacts/${mode}-modules.json`), 'utf8'),
  );
  await rm(join(artifactDirectory, `consumer-${options.preact}-${mode}`), {
    recursive: true,
    force: true,
  });
  await cp(
    join(directory, `dist-${mode}`),
    join(artifactDirectory, `consumer-${options.preact}-${mode}`),
    { recursive: true },
  );
  assert(
    graph.chunks.some((chunk) => chunk.isEntry),
    `${mode} must have an entry chunk`,
  );
  const ids = graph.chunks.flatMap((chunk) => chunk.modules.map((module) => module.id));
  const preactRoots = new Set();
  for (const id of ids) {
    const normalized = id.replaceAll('\\', '/');
    const match = normalized.match(/^(.*\/node_modules\/preact)(?:\/|$)/);
    if (match) preactRoots.add(await realpath(match[1]));
    if (isAbsolute(id)) {
      const actual = await realpath(id.split('?')[0]);
      assert(
        !relative(directory, actual).startsWith('..'),
        `Consumer module escaped isolated installation: ${id}`,
      );
    }
  }
  assert.equal(
    preactRoots.size,
    1,
    `${mode} must resolve every Preact subpath from one installed copy`,
  );
  assert.equal([...preactRoots][0], await realpath(join(directory, 'node_modules/preact')));
  assert(
    ids.some((id) => id.includes('/node_modules/@violice/preact-fluent-ui/dist/index.js')),
    'Build must use installed package JavaScript',
  );
  assert(
    !ids.some((id) => /\/node_modules\/(?:clsx|class-variance-authority)\//.test(id)),
    'Consumers must not resolve bundled helpers separately',
  );
  const mapped = {};
  for (const chunk of graph.chunks) {
    const map = JSON.parse(
      await readFile(join(directory, `dist-${mode}`, chunk.sourcemap), 'utf8'),
    );
    assert(map.mappings.length > 0, 'Consumer sourcemap must contain generated mappings');
    for (const [source, count] of Object.entries(mappedSources(map)))
      mapped[source] = (mapped[source] ?? 0) + count;
  }
  assert(
    Object.keys(mapped).some((source) => source.endsWith('/src/components/button.tsx')),
    'Button must have live generated mappings',
  );
  const unusedSources = Object.keys(mapped).filter((source) =>
    /\/src\/(?:components\/(?:modal|confirm-dialog|dialog-content|card|info-bar|status-badge|select|field|input|textarea|checkbox|switch|page-header|empty-state)\.tsx|icons\/(?:fluent-icon-paths\.ts|icon\.tsx))$/.test(
      source,
    ),
  );
  const outputFiles = await filesIn(join(directory, `dist-${mode}`));
  const sizes = {};
  for (const extension of ['js', 'css']) {
    const outputs = await Promise.all(
      outputFiles
        .filter((file) => file.endsWith(`.${extension}`))
        .map(async (file) => {
          const content = await readFile(join(directory, `dist-${mode}`, file));
          return { file, raw: content.length, gzip: gzipSync(content).length };
        }),
    );
    sizes[extension] = {
      raw: outputs.reduce((sum, file) => sum + file.raw, 0),
      gzip: outputs.reduce((sum, file) => sum + file.gzip, 0),
      files: outputs,
    };
  }
  const evidence = {
    graph,
    preactRoots: [...preactRoots],
    mappedSources: mapped,
    unusedSources,
    sizes,
  };
  // Save evidence before asserting so an actual retention failure remains inspectable.
  await writeFile(
    join(artifactDirectory, `consumer-${options.preact}-${mode}.json`),
    JSON.stringify(evidence, null, 2) + '\n',
  );
  if (mode === 'minimal') {
    const forbiddenSources = unusedSources.filter((source) =>
      /\/(?:components\/(?:modal|confirm-dialog|field|input|textarea|checkbox|switch)\.tsx|icons\/(?:fluent-icon-paths\.ts|icon\.tsx))$/.test(
        source,
      ),
    );
    assert.deepEqual(
      forbiddenSources,
      [],
      'Button-only consumer retains unused form controls, Modal or SVG catalog in generated mappings',
    );
    const renderedExports = graph.chunks
      .flatMap((chunk) => chunk.modules)
      .filter((module) =>
        module.id.endsWith('/node_modules/@violice/preact-fluent-ui/dist/index.js'),
      )
      .flatMap((module) => module.renderedExports);
    assert.deepEqual(
      renderedExports,
      ['Button'],
      'Only Button may remain a rendered library export',
    );
  } else {
    for (const control of ['field', 'input', 'textarea', 'checkbox', 'switch']) {
      assert(
        unusedSources.some((source) => source.endsWith(`/components/${control}.tsx`)),
        `Full consumer must retain a live ${control} control`,
      );
    }
    assert(
      unusedSources.some((source) => source.endsWith('/components/modal.tsx')),
      'Full consumer must provide a live Modal control for the tree-shaking comparison',
    );
    assert(
      unusedSources.some((source) => source.endsWith('/icons/fluent-icon-paths.ts')),
      'Full consumer must provide a live SVG catalog control',
    );
  }
  return evidence;
}

const temporary = await mkdtemp(join(tmpdir(), 'preact-fluent-ui-consumer-'));
try {
  assert(relative(root, temporary).startsWith('..'), 'Consumer must be outside the repository');
  await mkdir(artifactDirectory, { recursive: true });
  let archive = options.tarball;
  let pack;
  if (!archive) {
    const output = JSON.parse(
      await run(
        'npm',
        ['pack', '--json', '--ignore-scripts', '--pack-destination', temporary],
        root,
        true,
      ),
    );
    const archives = Array.isArray(output) ? output : Object.values(output);
    assert.equal(archives.length, 1);
    [pack] = archives;
    checkFileList(pack.files.map((file) => file.path));
    archive = join(temporary, pack.filename);
  }
  const entries = (await run('tar', ['-tzf', archive], temporary, true)).trim().split('\n');
  assert(
    entries.every((file) => file.startsWith('package/') && !file.split('/').includes('..')),
    'Archive entries must stay inside package/',
  );
  const packageFiles = entries
    .filter((file) => !file.endsWith('/'))
    .map((file) => file.slice('package/'.length))
    .sort();
  checkFileList(packageFiles);
  const consumer = join(temporary, 'consumer');
  await cp(join(root, 'tests/package-consumer'), consumer, { recursive: true });
  const consumerManifest = JSON.parse(await readFile(join(consumer, 'package.json'), 'utf8'));
  consumerManifest.dependencies = {
    '@violice/preact-fluent-ui': `file:${archive}`,
    preact: options.preact,
  };
  consumerManifest.devDependencies = Object.fromEntries(
    ['vite', 'typescript', '@types/node'].map((name) => [
      name,
      lock.packages[`node_modules/${name}`].version,
    ]),
  );
  await writeFile(join(consumer, 'package.json'), JSON.stringify(consumerManifest, null, 2) + '\n');
  console.log(`Isolated consumer ${consumer}, Preact ${options.preact}, archive ${archive}`);
  await run('npm', ['install', '--ignore-scripts', '--no-audit', '--no-fund'], consumer);
  const installed = join(consumer, 'node_modules/@violice/preact-fluent-ui');
  assert(
    !(await lstat(installed)).isSymbolicLink(),
    'Library must be installed from archive without a symlink',
  );
  assert.deepEqual(
    await filesIn(installed),
    packageFiles,
    'Installed package contents must match archive',
  );
  assert.equal(
    JSON.parse(await readFile(join(consumer, 'node_modules/preact/package.json'), 'utf8')).version,
    options.preact,
  );
  // Run the public API fixture before metadata checks, so declaration/export failures
  // report the real installed TypeScript error rather than a manifest proxy.
  await run(process.execPath, ['node_modules/typescript/bin/tsc', '-p', 'tsconfig.json'], consumer);
  await run(
    process.execPath,
    [
      '--input-type=module',
      '--eval',
      `
    for (const path of ['src/components/button', 'dist/components/button', 'dist/index.js']) {
      try { import.meta.resolve('@violice/preact-fluent-ui/' + path); }
      catch (error) {
        if (error.code === 'ERR_PACKAGE_PATH_NOT_EXPORTED') continue;
        throw error;
      }
      throw new Error('Private import was exported: ' + path);
    }
  `,
    ],
    consumer,
  );
  const library = await inspectLibrary(installed, packageFiles);
  if (!options.tarball) {
    const graph = JSON.parse(await readFile(join(root, '.artifacts/library-modules.json'), 'utf8'));
    assert(
      !graph.modules.some((id) => /\/node_modules\/preact\//.test(id.replaceAll('\\', '/'))),
      'Build metadata must not contain embedded Preact',
    );
    assert.deepEqual(
      [...graph.externalImports].sort(),
      library.imports,
      'Archive imports must match this build metadata',
    );
    library.buildGraph = graph;
  }
  const consumers = {};
  for (const mode of ['full', 'minimal']) {
    await run(
      process.execPath,
      ['node_modules/vite/bin/vite.js', 'build', '--mode', mode],
      consumer,
    );
    consumers[mode] = await inspectConsumer(consumer, mode);
  }
  const content = await readFile(archive);
  const sha256 = createHash('sha256').update(content).digest('hex');
  const savedArchive = join(artifactDirectory, basename(archive));
  if (resolve(archive) !== savedArchive) await cp(archive, savedArchive);
  await writeFile(`${savedArchive}.sha256`, `${sha256}  ${basename(savedArchive)}\n`);
  const report = {
    preact: options.preact,
    archive: savedArchive,
    sha256,
    packageFiles,
    pack,
    library,
    consumers,
  };
  await writeFile(
    join(artifactDirectory, `verified-${options.preact}.json`),
    JSON.stringify(report, null, 2) + '\n',
  );
  console.log(
    JSON.stringify(
      {
        preact: options.preact,
        sha256,
        packageFiles: packageFiles.length,
        preactRoots: consumers.minimal.preactRoots,
        externalImports: library.imports,
        fullSizes: consumers.full.sizes,
        minimalSizes: consumers.minimal.sizes,
        treeShakenSources: consumers.full.unusedSources.filter(
          (source) => !consumers.minimal.unusedSources.includes(source),
        ),
        residualMappedSources: consumers.minimal.unusedSources,
        archive: savedArchive,
      },
      null,
      2,
    ),
  );
} finally {
  await rm(temporary, { recursive: true, force: true });
}
