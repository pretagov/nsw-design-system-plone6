export function Element({ attributes, children, element }) {
  return (
    <p className="nsw-intro" {...attributes}>
      {children}
    </p>
  );
}
