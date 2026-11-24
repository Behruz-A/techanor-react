import { BlogPostCategory, BlogPostStatus } from "../../constants/enums";

export interface BlogPost {
  _id: string;
  blogPostStatus: BlogPostStatus;
  blogPostCategory: BlogPostCategory;
  blogPostTitle: string;
  blogPostContent: string;
  blogPostImage?: string;
  blogPostVideo?: string;
  blogPostVideoUrl?: string;
  blogPostViews: number;
  blogPostLikes: number;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPostInquiry {
  page: number;
  limit: number;
  blogPostCategory?: BlogPostCategory;
  search?: string;
}
