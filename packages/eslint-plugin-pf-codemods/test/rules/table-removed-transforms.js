const ruleTester = require('./ruletester');
const rule = require('../../lib/rules/table-removed-transforms');

ruleTester.run("table-removed-transforms", rule, {
  valid: [
    {
      code: `
        import { Table, TableHeader, TableBody, cellWidth } from '@patternfly/react-table';
        <Table rows={['Row 1']} cells={[{
          title: 'Last Commit',
          transforms: [cellWidth(100)]
        }]}>
          <TableHeader />
          <TableBody />
        </Table>
      `,
    }
  ],
  invalid: [
    {
      code: `import { Table, TableHeader, TableBody, cellWidth } from '@patternfly/react-table';
        <Table rows={['Row 2']} cells={[{
          title: 'Last Commit',
          transforms: [cellWidth('max')]
        }]}>
          <TableHeader />
          <TableBody />
        </Table>`,
      output: `import { Table, TableHeader, TableBody, cellWidth } from '@patternfly/react-table';
        <Table rows={['Row 2']} cells={[{
          title: 'Last Commit',
          transforms: [cellWidth(100)]
        }]}>
          <TableHeader />
          <TableBody />
        </Table>`,
      errors: [{
        message: `cellWidth('max') has been replaced with cellWidth(100)`,
        type: "Property",
      }]
    },
    {
      code: `import { Table, TableHeader, TableBody, cellWidth, cellHeightAuto } from '@patternfly/react-table';
        <Table rows={['Row 3']} cells={[{
          title: 'Last Commit',
          transforms: [cellWidth('max'), cellHeightAuto()]
        }]}>
          <TableHeader />
          <TableBody />
        </Table>`,
      output: `import { Table, TableHeader, TableBody, cellWidth } from '@patternfly/react-table';
        <Table rows={['Row 3']} cells={[{
          title: 'Last Commit',
          transforms: [cellWidth(100)]
        }]}>
          <TableHeader />
          <TableBody />
        </Table>`,
      errors: [
        {
          message: `cellHeightAuto transformer has been deprecated, import removed`,
          type: "Property"
        },
        {
          message: `cellHeightAuto transformer has been deprecated, removed usage`,
          type: "Property"
        },
        {
          message: `cellWidth('max') has been replaced with cellWidth(100)`,
          type: "Property",
        }
      ]
    },
  ]
});
