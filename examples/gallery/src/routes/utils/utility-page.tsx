import {
  Text,
  InfoBar,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHeaderCell,
  TableCell,
} from '../../../../../dist/components.js';
import { CodeExample } from '../../components/code-block';
import { galleryStyles } from '../../styles/gallery.styles.ts';
import { utilityParameters, utilityReturns } from './utility-docs';
import type { utilityDocs } from './utility-docs';

export function UtilityPage({ doc }: { doc: (typeof utilityDocs)[number] }) {
  const Demo = doc.demo;
  return (
    <div class={galleryStyles.sections}>
      <p>{doc.purpose}</p>
      <section class={galleryStyles.docSection}>
        <Text preset="subtitle1" render={<h2 />}>
          Example
        </Text>
        <div data-gallery-preview class={galleryStyles.preview}>
          <Demo />
        </div>
        <InfoBar>{doc.note}</InfoBar>
        <CodeExample code={doc.code} />
      </section>
      <section class={galleryStyles.docSection}>
        <Text preset="subtitle1" render={<h2 />} id={`${doc.slug}-api`}>
          API reference
        </Text>
        <pre class={galleryStyles.longText}>
          <code>{doc.signature}</code>
        </pre>
        <Table class={galleryStyles.propsTable} aria-labelledby={`${doc.slug}-api`}>
          <TableHeader>
            <TableRow>
              <TableHeaderCell scope="col">Parameter</TableHeaderCell>
              <TableHeaderCell scope="col">Type</TableHeaderCell>
              <TableHeaderCell scope="col">Description</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {utilityParameters[doc.title]!.map(([parameter, type, description]) => (
              <TableRow key={parameter}>
                <TableHeaderCell scope="row">{parameter}</TableHeaderCell>
                <TableCell>
                  <code>{type}</code>
                </TableCell>
                <TableCell>{description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div class={galleryStyles.docSection}>
          <Text preset="subtitle2" render={<h3 />}>
            Return value
          </Text>
          <p>
            <code>{utilityReturns[doc.title]![0]}</code>
          </p>
          <p>{utilityReturns[doc.title]![1]}</p>
        </div>
      </section>
      <section class={galleryStyles.docSection}>
        <Text preset="subtitle1" render={<h2 />}>
          Limitations
        </Text>
        <p>{doc.limits}</p>
      </section>
    </div>
  );
}

export function createUtilityRoute(doc: (typeof utilityDocs)[number]) {
  return () => <UtilityPage doc={doc} />;
}
