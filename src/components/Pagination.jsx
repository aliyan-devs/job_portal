function getPages(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  if (start > 2) pages.push("…l");
  for (let p = start; p <= end; p++) pages.push(p);
  if (end < total - 1) pages.push("…r");
  pages.push(total);
  return pages;
}

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  return (
    <nav aria-label="Job pages" className="mt-4">
      <ul className="pagination justify-content-center flex-wrap mb-0">
        <li className={"page-item" + (page === 1 ? " disabled" : "")}>
          <button className="page-link" onClick={() => onChange(page - 1)} disabled={page === 1}>
            Previous
          </button>
        </li>
        {getPages(page, totalPages).map((p) =>
          typeof p === "string" ? (
            <li key={p} className="page-item disabled"><span className="page-link">…</span></li>
          ) : (
            <li key={p} className={"page-item" + (p === page ? " active" : "")}>
              <button className="page-link" onClick={() => onChange(p)} aria-current={p === page ? "page" : undefined}>
                {p}
              </button>
            </li>
          )
        )}
        <li className={"page-item" + (page === totalPages ? " disabled" : "")}>
          <button className="page-link" onClick={() => onChange(page + 1)} disabled={page === totalPages}>
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
}
