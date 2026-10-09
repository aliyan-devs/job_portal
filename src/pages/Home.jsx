import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useJobs } from "../context/JobsContext.jsx";
import JobCard from "../components/JobCard.jsx";
import Loader from "../components/Loader.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";

export default function Home() {
  const { jobs, loading, error, retry } = useJobs();
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  const submit = (e) => {
    e.preventDefault();
    navigate(q.trim() ? `/jobs?q=${encodeURIComponent(q.trim())}` : "/jobs");
  };

  return (
    <>
      <section className="hero text-white py-5">
        <div className="container py-4 text-center">
          <h1 className="display-5 fw-bold">Find your next remote job</h1>
          <p className="lead mb-4">Search thousands of remote opportunities, save favourites and apply in minutes.</p>
          <form className="row g-2 justify-content-center" onSubmit={submit} role="search">
            <div className="col-12 col-md-6">
              <label htmlFor="hero-search" className="visually-hidden">Search jobs</label>
              <input
                id="hero-search"
                className="form-control form-control-lg"
                placeholder="Job title, company or keyword"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
            <div className="col-12 col-md-auto">
              <button className="btn btn-warning btn-lg w-100" type="submit">Search</button>
            </div>
          </form>
        </div>
      </section>

      <section className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="h4 mb-0">Latest jobs</h2>
          <Link to="/jobs">View all</Link>
        </div>
        {loading && <Loader />}
        {!loading && error && <ErrorMessage message={error} onRetry={retry} />}
        {!loading && !error && (
          <div className="row g-3">
            {jobs.slice(0, 6).map((job) => (
              <div key={job.id} className="col-12 col-md-6 col-xl-4">
                <JobCard job={job} />
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
