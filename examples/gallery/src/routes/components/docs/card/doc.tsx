import type { ComponentDoc } from '../../types';
import { DocCardExample } from './card-example';

export const cardDoc: ComponentDoc = {
  title: 'Card',
  slug: 'card',
  purpose: 'Group related content in a section, with optional padding for edge-to-edge data.',
  example: DocCardExample,
  code: '<Card aria-labelledby="details"><Text preset="subtitle2" render={<h2 />} id="details">Connection details</Text><Text render={<p />}>Office network configuration.</Text></Card>\n\n<Card padding="none">\n  <TableContainer>\n    <Table dividers="between">{/* header and rows */}</Table>\n  </TableContainer>\n</Card>',
  props: [
    [
      'padding',
      'regular | none',
      'Default regular. none removes outer padding and passes corner radii to the first and last child.',
    ],
  ],
  note: 'Use padding="none" with TableContainer for data that meets the card edge. Cell padding remains inside the table; the scroll container follows the card corners.',
  accessibility:
    'Give meaningful sections a heading and aria-labelledby. Card does not add a heading or interactive behavior.',
};
