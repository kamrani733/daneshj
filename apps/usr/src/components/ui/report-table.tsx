import type { ReactNode } from 'react';

export type ReportTableColumn = {
  key: string;
  header: string;
  /** Minimum column width: `sm` 7rem · `md` 9rem (default) · `lg` 13rem for long text. */
  size?: 'sm' | 'md' | 'lg';
};

const SIZE_CLASS = {
  sm: 'min-w-28',
  md: 'min-w-36',
  lg: 'min-w-52',
} as const;

type ReportTableProps<Row> = {
  columns: ReportTableColumn[];
  rows: Row[];
  getRowKey: (row: Row) => string;
  renderCell: (row: Row, columnKey: string) => ReactNode;
  /** Screen-reader caption, usually the report title. */
  caption: string;
};

const EDGE_CELL =
  'border-y border-outline-variant first:rounded-s-medium first:border-s last:rounded-e-medium last:border-e';

/**
 * Report table — Figma rows as separate rounded cards (8 px apart) under a tinted header row.
 * RTL-native: the first column sits at the start (right). Wider than its container → wrap it in
 * `HorizontalScroller`.
 */
export function ReportTable<Row>({ columns, rows, getRowKey, renderCell, caption }: ReportTableProps<Row>) {
  return (
    <table className="-my-2 w-full border-separate border-spacing-y-2 text-center">
      <caption className="sr-only">{caption}</caption>
      <thead>
        <tr>
          {columns.map((column) => (
            <th
              key={column.key}
              scope="col"
              // Plain join, not `cn()`: tailwind-merge would drop the type token next to the colour.
              className={`h-16 bg-surface-container px-2 py-2 text-body-medium font-normal text-outline ${EDGE_CELL} ${SIZE_CLASS[column.size ?? 'md']}`}
            >
              {column.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={getRowKey(row)}>
            {columns.map((column) => (
              <td
                key={column.key}
                className={`h-16 bg-surface-container-lowest px-2 py-3 text-body-medium text-on-surface-variant ${EDGE_CELL}`}
              >
                {renderCell(row, column.key)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
