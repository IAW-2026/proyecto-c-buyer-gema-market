import Link from "next/link";
import { Icon } from "./Icon";

interface PaginationProps {
  basePath: string;
  page: number;
  pageSize: number;
  total: number;
}

export function Pagination({ basePath, page, pageSize, total }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if (totalPages <= 1) return null;

  const prevHref = `${basePath}?page=${page - 1}`;
  const nextHref = `${basePath}?page=${page + 1}`;
  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  const btnBase =
    "inline-flex items-center gap-1.5 px-3.5 h-[34px] rounded-full text-[13px] font-medium border transition-colors";
  const enabled = "bg-paper border-line-2 text-ink hover:border-olive";
  const disabled =
    "bg-transparent border-line text-ink-3 cursor-not-allowed pointer-events-none opacity-60";

  return (
    <nav
      aria-label="Paginación"
      className="mt-4 flex items-center justify-between gap-3"
    >
      <span className="text-[13px] text-ink-3">
        Página {page} de {totalPages}
      </span>

      <div className="flex gap-2">
        {hasPrev ? (
          <Link href={prevHref} className={`${btnBase} ${enabled}`}>
            <Icon name="arrowLeft" size={16} />
            Anterior
          </Link>
        ) : (
          <span className={`${btnBase} ${disabled}`}>
            <Icon name="arrowLeft" size={16} />
            Anterior
          </span>
        )}

        {hasNext ? (
          <Link href={nextHref} className={`${btnBase} ${enabled}`}>
            Siguiente
            <Icon name="arrowRight" size={16} />
          </Link>
        ) : (
          <span className={`${btnBase} ${disabled}`}>
            Siguiente
            <Icon name="arrowRight" size={16} />
          </span>
        )}
      </div>
    </nav>
  );
}
