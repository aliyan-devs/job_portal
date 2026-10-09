import { Link } from "react-router-dom";
import { useJobs } from "../context/JobsContext.jsx";
import JobCard from "../components/JobCard.jsx";
import Loader from "../components/Loader.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import EmptyState from "../components/EmptyState.jsx";

export default function SavedJobs() {
  const { jobs, loading, error, retry, savedIds } = useJobs();
  const saved = jobs.filter((j) => savedIds.includes(j.id));

  return (
    <div className="container py-4">
      <h1 className="h3 mb-3">Saved Jobs</h1>
      {loading && <Loader />}
      {!loading && error && <ErrorMessage message={error} onRetry={retry} />}
      {!loading && !error && saved.length === 0 && (
        <EmptyState title="No saved jobs yet" text="Tap the ☆ on any job to save it here.">
          <Link to="/jobs" className="btn btn-primary">Browse jobs</Link>
        </EmptyState>
      )}
      {!loading && !error && saved.length > 0 && (
        <div className="row g-3">
          {saved.map((job) => (
            <div key={job.id} className="col-12 col-md-6 col-xl-4">
              <JobCard job={job} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
