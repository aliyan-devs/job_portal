import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useJobs } from "../context/JobsContext.jsx";
import useDebounce from "../hooks/useDebounce.js";
import FilterBar from "../components/FilterBar.jsx";
import JobCard from "../components/JobCard.jsx";
import Pagination from "../components/Pagination.jsx";
import Loader from "../components/Loader.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import EmptyState from "../components/EmptyState.jsx";

const PAGE_SIZE = 9;

export default function Jobs() {
  const { jobs, loading, error, retry } = useJobs();
  const [params, setParams] = useSearchParams();

  const filters = {
    search: params.get("q") || "",
    type: params.get("type") || "",
    location: params.get("location") || "",
    category: params.get("category") || "",
  };
  const page = Math.max(1, parseInt(params.get("page"), 10) || 1);

  // Local state keeps typing smooth; debounced value drives URL + filtering.
  const [searchInput, setSearchInput] = useState(filters.search);
  const debouncedSearch = useDebounce(searchInput, 300);

  const updateParams = (patch, resetPage = true) => {
    const next = new URLSearchParams(params);
    Object.entries(patch).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)));
    if (resetPage) next.delete("page");
    setParams(next, { replace: true });
  };

  useEffect(() => {
    if (debouncedSearch !== filters.search) updateParams({ q: debouncedSearch });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const handleFilterChange = (patch) => {
    if ("search" in patch) {
      setSearchInput(patch.search);
      return;
    }
    const map = { type: "type", location: "location", category: "category" };
    const urlPatch = {};
    Object.entries(patch).forEach(([k, v]) => (urlPatch[map[k]] = v));
    updateParams(urlPatch);
  };

  const resetFilters = () => {
    setSearchInput("");
    setParams({}, { replace: true });
  };

  const options = useMemo(() => {
    const uniq = (arr) => [...new Set(arr.filter(Boolean))].sort((a, b) => a.localeCompare(b));
    return {
      categories: uniq(jobs.map((j) => j.category)),
      locations: uniq(jobs.map((j) => j.candidate_required_location)),
      types: uniq(jobs.map((j) => j.job_type)),
    };
  }, [jobs]);

  const filtered = useMemo(() => {
    const q = filters.search.trim().toLowerCase();
    return jobs.filter((j) => {
      if (filters.type && j.job_type !== filters.type) return false;
      if (filters.location && j.candidate_required_location !== filters.location) return false;
      if (filters.category && j.category !== filters.category) return false;
      if (q) {
        const hay = `${j.title} ${j.company_name} ${(j.tags || []).join(" ")}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [jobs, filters.search, filters.type, filters.location, filters.category]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageJobs = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const goToPage = (p) => {
    updateParams({ page: p > 1 ? String(p) : "" }, false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const hasFilters = Object.values(filters).some(Boolean);

  return (
    <div className="container py-4">
      <h1 className="h3 mb-3">Browse Jobs</h1>

      <FilterBar
        filters={{ ...filters, search: searchInput }}
        onChange={handleFilterChange}
        onReset={resetFilters}
        {...options}
      />

      {loading && <Loader />}
      {!loading && error && <ErrorMessage message={error} onRetry={retry} />}

      {!loading && !error && (
        <>
          <p className="text-muted small" aria-live="polite">
            {filtered.length} {filtered.length === 1 ? "job" : "jobs"} found
            {filtered.length > 0 && ` · page ${currentPage} of ${totalPages}`}
          </p>

          {filtered.length === 0 ? (
            <EmptyState
              title="No jobs match your search"
              text="Try different keywords or remove some filters."
            >
              {hasFilters && (
                <button className="btn btn-primary" onClick={resetFilters}>
                  Clear filters
                </button>
              )}
            </EmptyState>
          ) : (
            <>
              <div className="row g-3">
                {pageJobs.map((job) => (
                  <div key={job.id} className="col-12 col-md-6 col-xl-4">
                    <JobCard job={job} />
                  </div>
                ))}
              </div>
              <Pagination page={currentPage} totalPages={totalPages} onChange={goToPage} />
            </>
          )}
        </>
      )}
    </div>
  );
}
