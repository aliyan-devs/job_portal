export default function Loader({ text = "Loading jobs…" }) {
  return (
    <div className="text-center py-5" role="status" aria-live="polite">
      <div className="spinner-border text-primary" aria-hidden="true" />
      <p className="mt-3 text-muted mb-0">{text}</p>
    </div>
  );
}
