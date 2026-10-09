import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useJobs } from "../context/JobsContext.jsx";
import Loader from "../components/Loader.jsx";
import EmptyState from "../components/EmptyState.jsx";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[0-9\s\-()]{7,18}$/;
const URL_RE = /^https?:\/\/[^\s.]+\.[^\s]{2,}$/i;
const MAX_FILE = 2 * 1024 * 1024; // 2 MB

const INITIAL = { name: "", email: "", phone: "", portfolio: "", experience: "", coverLetter: "" };

function validate(values, file) {
  const e = {};
  if (!values.name.trim()) e.name = "Full name is required.";
  else if (values.name.trim().length < 3) e.name = "Name must be at least 3 characters.";

  if (!values.email.trim()) e.email = "Email is required.";
  else if (!EMAIL_RE.test(values.email.trim())) e.email = "Enter a valid email address.";

  if (!values.phone.trim()) e.phone = "Phone number is required.";
  else if (!PHONE_RE.test(values.phone.trim())) e.phone = "Enter a valid phone number (7–15 digits).";

  if (values.portfolio.trim() && !URL_RE.test(values.portfolio.trim()))
    e.portfolio = "Enter a valid URL starting with http:// or https://";

  if (values.experience === "") e.experience = "Years of experience is required.";
  else if (Number(values.experience) < 0 || Number(values.experience) > 50)
    e.experience = "Enter a number between 0 and 50.";

  if (!values.coverLetter.trim()) e.coverLetter = "Cover letter is required.";
  else if (values.coverLetter.trim().length < 50)
    e.coverLetter = `Cover letter must be at least 50 characters (${values.coverLetter.trim().length}/50).`;

  if (!file) e.resume = "Please upload your resume (PDF).";
  else if (file.type !== "application/pdf") e.resume = "Resume must be a PDF file.";
  else if (file.size > MAX_FILE) e.resume = "Resume must be smaller than 2 MB.";

  return e;
}

export default function ApplyForm() {
  const { id } = useParams();
  const { jobs, loading, addApplication, hasApplied } = useJobs();
  const job = jobs.find((j) => String(j.id) === id);

  const [values, setValues] = useState(INITIAL);
  const [file, setFile] = useState(null);
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const errors = validate(values, file);

  if (loading) return <div className="container py-4"><Loader text="Loading…" /></div>;
  if (!job) {
    return (
      <div className="container py-4">
        <EmptyState title="Job not found">
          <Link to="/jobs" className="btn btn-primary">Browse jobs</Link>
        </EmptyState>
      </div>
    );
  }

  if (submitted || hasApplied(job.id)) {
    return (
      <div className="container py-5" style={{ maxWidth: 640 }}>
        <div className="alert alert-success text-center py-4">
          <h1 className="h4">🎉 Application submitted!</h1>
          <p className="mb-3">
            Your application for <strong>{job.title}</strong> at <strong>{job.company_name}</strong> has been recorded.
          </p>
          <Link to="/jobs" className="btn btn-primary me-2">Browse more jobs</Link>
          <Link to={`/jobs/${job.id}`} className="btn btn-outline-secondary">Back to job</Link>
        </div>
      </div>
    );
  }

  const handleChange = (e) => setValues((v) => ({ ...v, [e.target.name]: e.target.value }));
  const handleBlur = (e) => setTouched((t) => ({ ...t, [e.target.name]: true }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({ name: true, email: true, phone: true, portfolio: true, experience: true, coverLetter: true, resume: true });
    if (Object.keys(errors).length) return;
    addApplication({
      jobId: job.id,
      jobTitle: job.title,
      company: job.company_name,
      appliedAt: new Date().toISOString(),
      ...values,
      resumeName: file.name,
    });
    setSubmitted(true);
  };

  const cls = (name) =>
    "form-control" + (touched[name] ? (errors[name] ? " is-invalid" : " is-valid") : "");

  return (
    <div className="container py-4" style={{ maxWidth: 720 }}>
      <Link to={`/jobs/${job.id}`} className="text-decoration-none">← Back to job</Link>
      <h1 className="h3 mt-2">Apply for {job.title}</h1>
      <p className="text-muted">{job.company_name}</p>

      <form className="card card-body shadow-sm" onSubmit={handleSubmit} noValidate>
        <div className="row g-3">
          <div className="col-12 col-md-6">
            <label htmlFor="name" className="form-label">Full name *</label>
            <input id="name" name="name" className={cls("name")} value={values.name} onChange={handleChange} onBlur={handleBlur} autoComplete="name" />
            <div className="invalid-feedback">{errors.name}</div>
          </div>
          <div className="col-12 col-md-6">
            <label htmlFor="email" className="form-label">Email *</label>
            <input id="email" name="email" type="email" className={cls("email")} value={values.email} onChange={handleChange} onBlur={handleBlur} autoComplete="email" />
            <div className="invalid-feedback">{errors.email}</div>
          </div>
          <div className="col-12 col-md-6">
            <label htmlFor="phone" className="form-label">Phone *</label>
            <input id="phone" name="phone" type="tel" className={cls("phone")} value={values.phone} onChange={handleChange} onBlur={handleBlur} autoComplete="tel" />
            <div className="invalid-feedback">{errors.phone}</div>
          </div>
          <div className="col-12 col-md-6">
            <label htmlFor="experience" className="form-label">Years of experience *</label>
            <input id="experience" name="experience" type="number" min="0" max="50" className={cls("experience")} value={values.experience} onChange={handleChange} onBlur={handleBlur} />
            <div className="invalid-feedback">{errors.experience}</div>
          </div>
          <div className="col-12">
            <label htmlFor="portfolio" className="form-label">Portfolio / LinkedIn URL <span className="text-muted">(optional)</span></label>
            <input id="portfolio" name="portfolio" className={cls("portfolio")} placeholder="https://" value={values.portfolio} onChange={handleChange} onBlur={handleBlur} />
            <div className="invalid-feedback">{errors.portfolio}</div>
          </div>
          <div className="col-12">
            <label htmlFor="resume" className="form-label">Resume (PDF, max 2 MB) *</label>
            <input
              id="resume"
              type="file"
              accept="application/pdf"
              className={"form-control" + (touched.resume ? (errors.resume ? " is-invalid" : " is-valid") : "")}
              onChange={(e) => {
                setFile(e.target.files[0] || null);
                setTouched((t) => ({ ...t, resume: true }));
              }}
            />
            <div className="invalid-feedback">{errors.resume}</div>
          </div>
          <div className="col-12">
            <label htmlFor="coverLetter" className="form-label">Cover letter *</label>
            <textarea id="coverLetter" name="coverLetter" rows="5" className={cls("coverLetter")} value={values.coverLetter} onChange={handleChange} onBlur={handleBlur} />
            <div className="invalid-feedback">{errors.coverLetter}</div>
          </div>
        </div>
        <button type="submit" className="btn btn-primary mt-4 align-self-start px-4">Submit application</button>
      </form>
    </div>
  );
}
