export function Element({ attributes, children, element }) {
  return (
    <p className="nsw-small" {...attributes}>
      {children}
    </p>
  );
}
