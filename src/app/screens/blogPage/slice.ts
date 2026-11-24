import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BlogPageState } from "../../../lib/types/screen";
import { BlogPost, BlogComment, BlogCommentList } from "../../../lib/types/blog";

const initialState: BlogPageState = {
  blogs: [],
  chosenBlog: null,
  comments: { list: [], total: 0 },
};

const blogPageSlice = createSlice({
  name: "blogPage",
  initialState,
  reducers: {
    setBlogs: (state, action: PayloadAction<BlogPost[]>) => {
      state.blogs = action.payload;
    },
    setChosenBlog: (state, action: PayloadAction<BlogPost | null>) => {
      state.chosenBlog = action.payload;
    },
    setComments: (state, action: PayloadAction<BlogCommentList>) => {
      state.comments = action.payload;
    },
    appendComments: (state, action: PayloadAction<BlogCommentList>) => {
      const ids = new Set(state.comments.list.map((comment) => comment._id));
      state.comments.list.push(...action.payload.list.filter((comment) => !ids.has(comment._id)));
      state.comments.total = action.payload.total;
    },
    addComment: (state, action: PayloadAction<BlogComment>) => {
      if (state.comments.list.some((comment) => comment._id === action.payload._id)) return;
      state.comments.list.push(action.payload);
      state.comments.total += 1;
    },
  },
});

export const { setBlogs, setChosenBlog, setComments, appendComments, addComment } = blogPageSlice.actions;
export default blogPageSlice.reducer;
