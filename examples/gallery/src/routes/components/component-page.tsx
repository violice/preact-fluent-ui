import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHeaderCell,
  TableCell,
  InfoBar,
  Text,
} from '../../../../../dist/components.js';
import { CodeExample } from '../../components/code-block';
import { galleryStyles } from '../../styles/gallery.styles.ts';
import { native } from './component-docs';
import type { Prop, ComponentDoc } from './component-docs';

export function ComponentPage({ doc }: { doc: ComponentDoc }) {
  const Example = doc.example;
  return (
    <div class={galleryStyles.sections}>
      {doc.title === 'PageHeader' && (
        <section aria-label="PageHeader example" data-gallery-preview class={galleryStyles.preview}>
          <Example />
        </section>
      )}
      <p>{doc.purpose}</p>
      {doc.title !== 'PageHeader' && (
        <section aria-label={`${doc.title} example`} class={galleryStyles.docSection}>
          <Text preset="subtitle1" render={<h2 />}>
            Example
          </Text>
          {['Button', 'Dialog'].includes(doc.title) ? (
            <Example />
          ) : (
            <div data-gallery-preview class={galleryStyles.preview}>
              <Example />
            </div>
          )}
          <InfoBar>
            {doc.note ??
              (doc.title.startsWith('Sidebar')
                ? 'Demo selection is local. Rail links retain accessible names; focus or hover reveals their labels. Layout and breakpoints belong to the application.'
                : 'This example runs inside the gallery.')}
          </InfoBar>
        </section>
      )}
      <section class={galleryStyles.docSection}>
        <Text preset="subtitle1" render={<h2 />}>
          Usage
        </Text>
        <CodeExample code={doc.code} />
      </section>
      <section class={galleryStyles.apiReference}>
        <Text preset="subtitle1" render={<h2 />} id={`${doc.slug}-api-reference`}>
          API reference
        </Text>
        {(doc.members ?? [doc]).map((member) => (
          <section key={member.title} id={member.slug} class={galleryStyles.docSection}>
            {doc.members && (
              <Text preset="subtitle2" render={<h3 />} id={`${member.slug}-api`}>
                {member.title}
              </Text>
            )}
            <p>Import {member.title}Props for the complete TypeScript contract.</p>
            {doc.members && <p>{member.purpose}</p>}
            <Table
              class={galleryStyles.propsTable}
              aria-labelledby={doc.members ? `${member.slug}-api` : `${doc.slug}-api-reference`}
            >
              <TableHeader>
                <TableRow>
                  <TableHeaderCell scope="col">Prop</TableHeaderCell>
                  <TableHeaderCell scope="col">Type</TableHeaderCell>
                  <TableHeaderCell scope="col">Description</TableHeaderCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  ...member.props,
                  member.title === 'Tooltip'
                    ? ([
                        'class / className',
                        'Signalish<string | undefined>',
                        'Add a portal root class. Caller native trigger props and refs belong in triggerProps.',
                      ] as Prop)
                    : member.title === 'ConfirmDialog'
                      ? ([
                          'class / className',
                          'Signalish<string | undefined>',
                          'Add a root class. className is the fallback. Other native HTML props are not accepted.',
                        ] as Prop)
                      : native,
                ].map(([name, type, description]) => (
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

            {doc.members && <p>{member.accessibility}</p>}
            {doc.members && member.title !== doc.title && !member.title.startsWith('AppShell') && (
              <CodeExample code={member.code} />
            )}
          </section>
        ))}
      </section>
      <section class={galleryStyles.docSection}>
        <Text preset="subtitle1" render={<h2 />}>
          Accessibility
        </Text>
        <p>{doc.accessibility}</p>
      </section>
    </div>
  );
}
