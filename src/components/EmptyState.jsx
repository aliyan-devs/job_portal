export default function EmptyState({ title, text, children }) {
  return (
    <div className="text-center py-5 border rounded-3 bg-white">
      <div style={{ fontSize: "2.5rem" }} aria-hidden="true">🔍</div>
      <h2 className="h5 mt-2">{title}</h2>
      {text && <p className="text-muted mb-3">{text}</p>}
      {children}
    </div>
  );
}
