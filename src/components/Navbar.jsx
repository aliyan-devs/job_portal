import { NavLink, Link } from "react-router-dom";
import { useJobs } from "../context/JobsContext.jsx";

export default function Navbar() {
  const { savedIds } = useJobs();
  const link = ({ isActive }) => "nav-link" + (isActive ? " active fw-semibold" : "");

  return (
    <nav className="navbar navbar-expand-md bg-white border-bottom sticky-top">
      <div className="container">
        <Link className="navbar-brand fw-bold text-primary" to="/">
          <span aria-hidden="true">💼</span> JobHunt
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#nav"
          aria-controls="nav"
          aria-expanded="false"
          aria-label="Toggle navigation"
          onClick={(e) => {
            const el = document.getElementById("nav");
            el.classList.toggle("show");
            e.currentTarget.setAttribute("aria-expanded", el.classList.contains("show"));
          }}
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="nav">
          <ul className="navbar-nav ms-auto align-items-md-center">
            <li className="nav-item">
              <NavLink end to="/" className={link}>Home</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/jobs" className={link}>Browse Jobs</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/saved" className={link}>
                Saved Jobs{" "}
                {savedIds.length > 0 && (
                  <span className="badge text-bg-primary rounded-pill">{savedIds.length}</span>
                )}
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
