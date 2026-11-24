import axios from "axios";
import { serverApi } from "../../lib/config";
import { BlogPost, BlogPostInquiry, BlogComment, BlogCommentInput, BlogCommentList } from "../../lib/types/blog";

class BlogService {
  private readonly path = `${serverApi}/blog`;

  public async getBlogs(input: BlogPostInquiry): Promise<BlogPost[]> {
    const params = new URLSearchParams({
      page: String(input.page),
      limit: String(input.limit),
    });
    if (input.blogPostCategory) params.set("blogPostCategory", input.blogPostCategory);
    if (input.search) params.set("search", input.search);

    const result = await axios.get<BlogPost[]>(`${this.path}/all?${params.toString()}`, { timeout: 10000 });
    return result.data;
  }

  public async getBlog(blogId: string): Promise<BlogPost> {
    const result = await axios.get<BlogPost>(`${this.path}/${blogId}`, { timeout: 10000 });
    return result.data;
  }

  public async getComments(blogId: string, page = 1): Promise<BlogCommentList> {
    const params = new URLSearchParams({ page: String(page), limit: "20" });
    const result = await axios.get<BlogCommentList>(`${this.path}/${blogId}/comments?${params.toString()}`, { timeout: 10000 });
    return result.data;
  }

  public async createComment(blogId: string, input: BlogCommentInput): Promise<BlogComment> {
    const result = await axios.post<BlogComment>(`${this.path}/${blogId}/comments`, input, { timeout: 10000 });
    return result.data;
  }
}

export default BlogService;
