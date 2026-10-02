import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * @param {string} tag
 * @param {string} version
 * @returns {void}
 */
export function assertReleaseVersion(tag, version) {
  if (typeof version !== 'string' || !version || tag !== `v${version}`) {
    throw new Error(
      `Release tag ${JSON.stringify(tag)} does not match package version; expected v${version}`,
    );
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const [tag, manifestPath, ...extra] = process.argv.slice(2);
    if (tag === undefined || !manifestPath || extra.length) {
      throw new Error('Usage: check-release.mjs <tag> <package-json-path>');
    }
    const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
    assertReleaseVersion(tag, manifest.version);
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
