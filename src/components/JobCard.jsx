import { Link } from "react-router-dom";
import { useJobs } from "../context/JobsContext.jsx";
import { jobTypeLabel, formatDate, stripHtml } from "../utils/format.js";

export default function JobCard({ job }) {
  const { isSaved, toggleSave } = useJobs();
  const saved = isSaved(job.id);

  return (
    <div className="card h-100 shadow-sm job-card">
      <div className="card-body d-flex flex-column">
        <div className="d-flex align-items-start gap-3 mb-2">
          {job.company_logo ? (
            <img
              src={job.company_logo}
              alt=""
              className="company-logo"
              loading="lazy"
              onError={(e) => (e.currentTarget.style.visibility = "hidden")}
            />
          ) : (
            <div className="company-logo placeholder-logo" aria-hidden="true">
              {(job.company_name || "?").charAt(0)}
            </div>
          )}
          <div className="flex-grow-1 min-w-0">
            <h2 className="h6 mb-1">
              <Link to={`/jobs/${job.id}`} className="stretched-link-title text-decoration-none text-dark">
                {job.title}
              </Link>
            </h2>
            <div className="text-muted small">{job.company_name}</div>
          </div>
          <button
            className={"btn btn-sm " + (saved ? "btn-warning" : "btn-outline-secondary")}
            onClick={() => toggleSave(job.id)}
            aria-pressed={saved}
            aria-label={saved ? "Remove from saved jobs" : "Save job"}
            title={saved ? "Remove from saved" : "Save job"}
          >
            {saved ? "★" : "☆"}
          </button>
        </div>

        <div className="mb-2 d-flex flex-wrap gap-1">
          <span className="badge text-bg-primary">{jobTypeLabel(job.job_type)}</span>
          <span className="badge text-bg-light border">{job.category}</span>
          <span className="badge text-bg-light border">📍 {job.candidate_required_location || "Anywhere"}</span>
        </div>

        <p className="small text-muted flex-grow-1">{stripHtml(job.description)}</p>

        <div className="d-flex justify-content-between align-items-center mt-auto">
          <small className="text-muted">{formatDate(job.publication_date)}</small>
          {job.salary && <small className="fw-semibold text-success text-truncate ms-2">{job.salary}</small>}
        </div>
      </div>
      <div className="card-footer bg-white border-top-0 pt-0">
        <Link to={`/jobs/${job.id}`} className="btn btn-outline-primary btn-sm w-100">
          View details
        </Link>
      </div>
    </div>
  );
}
