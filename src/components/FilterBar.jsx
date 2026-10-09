import { JOB_TYPE_LABELS } from "../utils/format.js";

export default function FilterBar({
  filters,
  onChange,
  onReset,
  categories,
  locations,
  types,
}) {
  const set = (key) => (e) => onChange({ [key]: e.target.value });

  return (
    <form className="card card-body shadow-sm mb-4" onSubmit={(e) => e.preventDefault()} role="search">
      <div className="row g-3">
        <div className="col-12 col-lg-4">
          <label htmlFor="search" className="form-label small fw-semibold mb-1">Search</label>
          <input
            id="search"
            type="search"
            className="form-control"
            placeholder="Title, company or keyword"
            value={filters.search}
            onChange={set("search")}
          />
        </div>
        <div className="col-12 col-sm-6 col-lg-2">
          <label htmlFor="type" className="form-label small fw-semibold mb-1">Job type</label>
          <select id="type" className="form-select" value={filters.type} onChange={set("type")}>
            <option value="">All types</option>
            {types.map((t) => (
              <option key={t} value={t}>{JOB_TYPE_LABELS[t] || t}</option>
            ))}
          </select>
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <label htmlFor="location" className="form-label small fw-semibold mb-1">Location</label>
          <select id="location" className="form-select" value={filters.location} onChange={set("location")}>
            <option value="">All locations</option>
            {locations.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <label htmlFor="category" className="form-label small fw-semibold mb-1">Category</label>
          <select id="category" className="form-select" value={filters.category} onChange={set("category")}>
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="d-flex justify-content-end mt-3">
        <button type="button" className="btn btn-link btn-sm text-decoration-none" onClick={onReset}>
          Clear all filters
        </button>
      </div>
    </form>
  );
}
