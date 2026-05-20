/**
 * Breadcrumb Component
 * RTL-compatible breadcrumb navigation.
 *
 * Props:
 *   items - Array of { label: string, href?: string }
 *           Last item is the current page (no link).
 */

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="المسارات التنقلية" className="w-full">
      <ol className="flex flex-wrap items-center gap-2 text-sm" dir="rtl">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center gap-2">
              {/* Separator */}
              {index > 0 && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="rtl-flip"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              )}

              {isLast ? (
                /* Last item — current page (no link) */
                <span
                  className="font-semibold"
                  style={{ color: "var(--foreground)" }}
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : item.href ? (
                /* Linked item */
                <a
                  href={item.href}
                  className="transition-colors hover:underline"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  {item.label}
                </a>
              ) : (
                /* Unlinked item */
                <span style={{ color: "var(--muted-foreground)" }}>
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
