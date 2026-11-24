import { createSelector } from "reselect";
import { AppRootState } from "../../../lib/types/screen";

const selectBlogPage = (state: AppRootState) => state.blogPage;

export const retrieveBlogs = createSelector(selectBlogPage, (blogPage) => blogPage.blogs);
export const retrieveChosenBlog = createSelector(selectBlogPage, (blogPage) => blogPage.chosenBlog);
