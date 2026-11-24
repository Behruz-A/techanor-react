import { Fragment } from "react";
import { getBlogMediaUrl, parseArticleContent } from "./blogUtils";

function renderParagraph(paragraph: string, key: number) {
  if (paragraph.startsWith(">")) {
    return <blockquote key={key}><span aria-hidden="true">&ldquo;</span><p>{paragraph.replace(/^>\s?/gm, "")}</p></blockquote>;
  }
  const image = paragraph.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
  if (image) {
    const src = getBlogMediaUrl(image[2]);
    return src ? <figure key={key}><img src={src} alt={image[1]} loading="lazy" /></figure> : null;
  }
  return <p key={key}>{paragraph}</p>;
}

export default function ArticleContent({ content }: { content: string }) {
  const article = parseArticleContent(content);
  return (
    <div className="journal-prose">
      {renderParagraph(article.lead, 0)}
      {article.sections.map((section, index) => <Fragment key={index}>
        {section.heading && <h2>{section.heading}</h2>}
        {section.paragraphs.map(renderParagraph)}
      </Fragment>)}
    </div>
  );
}
