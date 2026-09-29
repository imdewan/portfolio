export function SectionHeading({
  eyebrow,
  title,
  as: Tag = "h2",
}: {
  eyebrow: string;
  title: string;
  as?: "h1" | "h2";
}) {
  return (
    <div className="mb-8">
      <p className="mb-2 font-mono text-xs uppercase tracking-[0.2em] text-emerald-400">
        {eyebrow}
      </p>
      <Tag className="text-2xl font-semibold tracking-tight text-zinc-50">
        {title}
      </Tag>
    </div>
  );
}
