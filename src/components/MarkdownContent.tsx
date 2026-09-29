import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function slugifyHeading(children: React.ReactNode) {
  return String(children)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function MarkdownContent({ content }: { content: string }) {
  return (
    <div className="prose-blog">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h2: ({ children }) => (
            <h2 id={slugifyHeading(children)}>{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 id={slugifyHeading(children)}>{children}</h3>
          ),
          a: ({ href = "", children }) =>
            href.startsWith("http") ? (
              <a href={href} target="_blank" rel="noreferrer">
                {children}
              </a>
            ) : (
              <a href={href}>{children}</a>
            ),
          img: ({ src, alt }) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={String(src ?? "")} alt={alt ?? ""} loading="lazy" decoding="async" />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
