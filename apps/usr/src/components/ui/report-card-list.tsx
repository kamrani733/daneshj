import type { ReactNode } from 'react';

export type ReportCardField = {
  key: string;
  label: string;
  value: ReactNode;
};

export type ReportCardItem = {
  key: string;
  fields: ReportCardField[];
};

/** Phone / tablet report rows — Figma labelled field cards («برچسب: مقدار» per line). */
export function ReportCardList({ items }: { items: ReportCardItem[] }) {
  return (
    <ul className="flex w-full flex-col gap-2">
      {items.map((item) => (
        <li key={item.key}>
          <dl className="flex flex-col gap-3 rounded-medium border border-outline-variant bg-surface-container-lowest p-4">
            {item.fields.map((field) => (
              <div key={field.key} className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <dt className="text-body-medium text-outline after:content-[':']">{field.label}</dt>
                <dd className="min-w-0 text-body-medium font-medium text-on-surface">{field.value}</dd>
              </div>
            ))}
          </dl>
        </li>
      ))}
    </ul>
  );
}
