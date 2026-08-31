import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BlogPageState } from "../../../lib/types/screen";
import { BlogPost } from "../../../lib/types/blog";

const initialState: BlogPageState = {
  blogs: [],
  chosenBlog: null,
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
  },
});

export const { setBlogs, setChosenBlog } = blogPageSlice.actions;
export default blogPageSlice.reducer;
