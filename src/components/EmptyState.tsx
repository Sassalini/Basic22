type EmptyStateProps = {
  title: string;
  body: string;
};

export function EmptyState({ title, body }: EmptyStateProps) {
  return (
    <div className="rounded-xl border border-brg-border bg-brg-panel/70 p-8 text-center shadow-calm">
      <h2 className="text-lg font-semibold text-brg-text">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-brg-muted">{body}</p>
    </div>
  );
}
