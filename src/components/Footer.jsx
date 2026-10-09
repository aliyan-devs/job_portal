export default function Footer() {
  return (
    <footer className="border-top bg-white py-3 mt-5">
      <div className="container small text-muted d-flex flex-column flex-sm-row justify-content-between gap-1">
        <span>© {new Date().getFullYear()} JobHunt</span>
        <span>
          Job data from{" "}
          <a href="https://remotive.com" target="_blank" rel="noreferrer">Remotive</a>
        </span>
      </div>
    </footer>
  );
}
