import { CodeBlock as PlainCodeBlock } from '../../../../../../../dist/components.js';
import { CodeExample } from '../../../../components/code-block';
import { galleryStyles } from '../../../../styles/gallery.styles.ts';

export function DocCodeBlockExample() {
  return (
    <div class={galleryStyles.form}>
      <PlainCodeBlock
        code={'{\n  "gateway": "192.168.10.1",\n  "retry": 3\n}'}
        language="json"
        copy
        codeLabel="Plain configuration"
        preStyle={{ maxHeight: '140px' }}
      />
      <PlainCodeBlock
        code={
          '# Long diagnostic command\nnetwork inspect --gateway 192.168.10.1 --profile office --include-routes --include-diagnostics'
        }
        wrap
        copy
        codeLabel="Wrapped command"
        preStyle={{ maxHeight: '100px' }}
      />
      <CodeExample code={'const ready = true;\nconsole.log("Connection ready");'} />
    </div>
  );
}
