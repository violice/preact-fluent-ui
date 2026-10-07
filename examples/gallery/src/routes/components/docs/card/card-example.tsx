import {
  Table,
  TableContainer,
  TableHeader,
  TableBody,
  TableRow,
  TableHeaderCell,
  TableCell,
  Card,
  Text,
} from '../../../../../../../dist/components.js';
import { galleryStyles } from '../../../../styles/gallery.styles.ts';

export function DocCardExample() {
  return (
    <div class={galleryStyles.stack}>
      <Card aria-labelledby="card-example-title" data-padding="regular">
        <Text preset="subtitle2" render={<h2 />} id="card-example-title">
          Connection details
        </Text>
        <p>Office network configuration.</p>
      </Card>
      <Card padding="none" aria-label="Saved routes" data-padding="none">
        <TableContainer>
          <Table dividers="between" aria-label="Routes without outer padding">
            <TableHeader>
              <TableRow>
                <TableHeaderCell>Prefix</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>203.0.113.10/32</TableCell>
                <TableCell>Through VPN</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>192.168.50.0/24</TableCell>
                <TableCell>Through VPN</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </div>
  );
}
