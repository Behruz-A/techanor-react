import { resolveMediaUrl } from "../../../lib/utils/media";

export interface ArticleSection {
  heading?: string;
  paragraphs: string[];
}

const cleanContent = (content: string) => content.replace(/^#{1,3}\s+/gm, "").replace(/\s+/g, " ").trim();

export const getBlogExcerpt = (content: string, limit = 170) => {
  const text = cleanContent(content);
  return text.length > limit ? `${text.slice(0, limit).trimEnd()}…` : text;
};

export const getBlogReadTime = (content: string) => {
  const words = cleanContent(content).split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 200))} min read`;
};

export const formatBlogDate = (date: string) => new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
}).format(new Date(date));

export const getBlogMediaUrl = (path?: string) => resolveMediaUrl(path);

export const parseArticleContent = (content: string) => {
  const blocks = content.split(/\n\s*\n/).map((block) => block.trim()).filter(Boolean);
  const lead = (blocks.shift() || content).replace(/^#{1,3}\s+/, "");
  const sections: ArticleSection[] = [];

  blocks.forEach((block) => {
    const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
    const headingLine = lines[0]?.match(/^#{2,3}\s+(.+)$/);
    const wordCount = block.split(/\s+/).length;
    const plainHeading = lines.length === 1 && (
      /^(introduction|conclusion)$/i.test(block) ||
      (wordCount >= 2 && wordCount <= 14 && block.length <= 90 && /^[A-Z0-9“"']/.test(block) && !/[.!:]$/.test(block))
    );
    if (headingLine || plainHeading) {
      sections.push({ heading: headingLine?.[1] || block, paragraphs: headingLine ? lines.slice(1) : [] });
      return;
    }
    const current = sections[sections.length - 1];
    if (current && current.heading) current.paragraphs.push(block);
    else sections.push({ paragraphs: [block] });
  });

  return { lead, sections };
};
