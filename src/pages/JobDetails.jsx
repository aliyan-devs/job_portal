import { useMemo } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";
import { useJobs } from "../context/JobsContext.jsx";
import Loader from "../components/Loader.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { jobTypeLabel, formatDate } from "../utils/format.js";

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { jobs, loading, error, retry, isSaved, toggleSave, hasApplied } = useJobs();

  const job = useMemo(() => jobs.find((j) => String(j.id) === id), [jobs, id]);

  const cleanHtml = useMemo(
    () => (job ? DOMPurify.sanitize(job.description || "") : ""),
    [job]
  );

  if (loading) return <div className="container py-4"><Loader text="Loading job…" /></div>;
  if (error) return <div className="container py-4"><ErrorMessage message={error} onRetry={retry} /></div>;
  if (!job) {
    return (
      <div className="container py-4">
        <EmptyState title="Job not found" text="This listing may have been removed.">
          <Link to="/jobs" className="btn btn-primary">Back to jobs</Link>
        </EmptyState>
      </div>
    );
  }

  const saved = isSaved(job.id);
  const applied = hasApplied(job.id);

  return (
    <div className="container py-4">
      <button className="btn btn-link px-0 mb-2 text-decoration-none" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="row g-4">
        <div className="col-12 col-lg-8">
          <article className="card shadow-sm">
            <div className="card-body p-4">
              <div className="d-flex align-items-start gap-3 mb-3">
                {job.company_logo && (
                  <img
                    src={job.company_logo}
                    alt={`${job.company_name} logo`}
                    className="company-logo"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                )}
                <div>
                  <h1 className="h3 mb-1">{job.title}</h1>
                  <div className="text-muted">{job.company_name}</div>
                </div>
              </div>

              <div className="d-flex flex-wrap gap-2 mb-4">
                <span className="badge text-bg-primary">{jobTypeLabel(job.job_type)}</span>
                <span className="badge text-bg-light border">{job.category}</span>
                <span className="badge text-bg-light border">📍 {job.candidate_required_location || "Anywhere"}</span>
                {job.salary && <span className="badge text-bg-success">{job.salary}</span>}
              </div>

              <h2 className="h5">Job description</h2>
              <div className="job-description" dangerouslySetInnerHTML={{ __html: cleanHtml }} />
            </div>
          </article>
        </div>

        <aside className="col-12 col-lg-4">
          <div className="card shadow-sm sticky-lg-top" style={{ top: "5rem" }}>
            <div className="card-body">
              <h2 className="h6 text-uppercase text-muted">Overview</h2>
              <dl className="mb-3 small">
                <dt>Posted</dt><dd>{formatDate(job.publication_date)}</dd>
                <dt>Type</dt><dd>{jobTypeLabel(job.job_type)}</dd>
                <dt>Location</dt><dd>{job.candidate_required_location || "Anywhere"}</dd>
                <dt>Category</dt><dd>{job.category}</dd>
              </dl>
              {job.tags?.length > 0 && (
                <div className="d-flex flex-wrap gap-1 mb-3">
                  {job.tags.slice(0, 10).map((t) => (
                    <span key={t} className="badge text-bg-secondary fw-normal">{t}</span>
                  ))}
                </div>
              )}

              {applied ? (
                <div className="alert alert-success py-2 small mb-2">✓ You have applied to this job.</div>
              ) : (
                <Link to={`/jobs/${job.id}/apply`} className="btn btn-primary w-100 mb-2">
                  Apply now
                </Link>
              )}
              <button
                className={"btn w-100 mb-2 " + (saved ? "btn-warning" : "btn-outline-secondary")}
                onClick={() => toggleSave(job.id)}
              >
                {saved ? "★ Saved" : "☆ Save job"}
              </button>
              {job.url && (
                <a href={job.url} target="_blank" rel="noreferrer" className="btn btn-link w-100 btn-sm">
                  View original posting ↗
                </a>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
