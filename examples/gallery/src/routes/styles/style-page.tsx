import {
  Text,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHeaderCell,
  TableCell,
} from '../../../../../dist/components.js';
import { DocSection } from '../../components/documentation/doc-section';
import { CodeExample } from '../../components/code-block';
import { galleryStyles } from '../../styles/gallery.styles';
import type { StyleDoc } from './style-docs';

export function StylePage({ doc }: { doc: StyleDoc }) {
  const Demo = doc.demo;
  return (
    <div class={galleryStyles.sections}>
      <p class={galleryStyles.lead}>{doc.description}</p>
      <DocSection title="Import">
        <CodeExample code={`import { ${doc.name.split('.')[0]} } from './styled-system/css';`} />
      </DocSection>
      <DocSection title="Example">
        <section aria-label="Live example" data-gallery-preview class={galleryStyles.preview}>
          <Demo />
        </section>
        <CodeExample code={doc.code} />
      </DocSection>
      {doc.details?.map((detail) => (
        <DocSection key={detail.title} title={detail.title}>
          <p>{detail.description}</p>
          {detail.code && <CodeExample code={detail.code} />}
        </DocSection>
      ))}
      <DocSection title="API reference">
        <CodeExample code={doc.signature} />
        <Table class={galleryStyles.propsTable} aria-label="API reference">
          <TableHeader>
            <TableRow>
              <TableHeaderCell scope="col">Parameter</TableHeaderCell>
              <TableHeaderCell scope="col">Type</TableHeaderCell>
              <TableHeaderCell scope="col">Description</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {doc.parameters.map(([name, type, description]) => (
              <TableRow key={name}>
                <TableHeaderCell scope="row">{name}</TableHeaderCell>
                <TableCell>
                  <code>{type}</code>
                </TableCell>
                <TableCell>{description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div>
          <Text preset="subtitle2" render={<h3 />}>
            Return value
          </Text>
          <p>
            <code>{doc.returns}</code>
          </p>
        </div>
      </DocSection>
      <DocSection title="Limitations">
        <p>{doc.limits}</p>
      </DocSection>
    </div>
  );
}
