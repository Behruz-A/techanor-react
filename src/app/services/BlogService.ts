import axios from "axios";
import { serverApi } from "../../lib/config";
import { BlogPost, BlogPostInquiry } from "../../lib/types/blog";

class BlogService {
  private readonly path = `${serverApi}/blog`;

  public async getBlogs(input: BlogPostInquiry): Promise<BlogPost[]> {
    const params = new URLSearchParams({
      page: String(input.page),
      limit: String(input.limit),
    });
    if (input.blogPostCategory) params.set("blogPostCategory", input.blogPostCategory);
    if (input.search) params.set("search", input.search);

    const result = await axios.get(`${this.path}/all?${params.toString()}`);
    return result.data;
  }

  public async getBlog(blogId: string): Promise<BlogPost> {
    const result = await axios.get(`${this.path}/${blogId}`);
    return result.data;
  }
}

export default BlogService;
