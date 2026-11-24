import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { cleanup, render } from "@testing-library/react";
import { act, Simulate } from "react-dom/test-utils";
import BlogService from "../../services/BlogService";
import { BlogComment } from "../../../lib/types/blog";
import { sweetErrorHandling } from "../../../lib/sweetAlert";
import blogPageReducer from "./slice";
import BlogComments from "./BlogComments";

jest.mock("../../services/BlogService");
jest.mock("../../../lib/sweetAlert", () => ({
  sweetErrorHandling: jest.fn(),
  sweetTopSmallSuccessAlert: jest.fn(),
}));

const getComments = BlogService.prototype.getComments as jest.MockedFunction<BlogService["getComments"]>;
const createComment = BlogService.prototype.createComment as jest.MockedFunction<BlogService["createComment"]>;
const comment: BlogComment = {
  _id: "comment-1", blogPostId: "article-1", parentId: null,
  name: "Reader", content: "A useful article.", createdAt: "2026-11-24T09:00:00.000Z",
};

async function setup() {
  const store = configureStore({ reducer: { blogPage: blogPageReducer } });
  let view!: ReturnType<typeof render>;
  await act(async () => {
    view = render(<Provider store={store}><BlogComments postId="article-1" /></Provider>);
  });
  return { ...view, store };
}

beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
  getComments.mockResolvedValue({ list: [], total: 0 });
  createComment.mockResolvedValue(comment);
  window.matchMedia = jest.fn().mockReturnValue({ matches: true });
  Element.prototype.scrollIntoView = jest.fn();
});
afterEach(cleanup);

type TestView = ReturnType<typeof setup> extends Promise<infer T> ? T : never;

function fillForm(view: TestView) {
  for (const [label, value] of [["Your comment", "A useful article."], ["Your name", "Reader"], ["Your email", "reader@example.com"]]) {
    const input = view.getByLabelText(label) as HTMLInputElement;
    act(() => {
      input.value = value;
      Simulate.change(input);
    });
  }
}

async function submit(view: TestView) {
  await act(async () => {
    Simulate.submit(view.container.querySelector("form")!);
  });
}

test("posts a comment into Redux and leaves identity unsaved without opt-in", async () => {
  const view = await setup();
  expect(view.getByText("Post comment")).not.toBeDisabled();
  fillForm(view);
  await submit(view);
  expect(view.store.getState().blogPage.comments.total).toBe(1);
  expect(createComment).toHaveBeenCalledWith("article-1", {
    name: "Reader", email: "reader@example.com", content: "A useful article.",
  });
  expect(view.getByText("A useful article.")).toBeInTheDocument();
  expect(view.getByLabelText("Your comment")).toHaveValue("");
  expect(localStorage.getItem("techanor-comment-identity")).toBeNull();
});

test("replying to a paginated reply uses its root comment ID", async () => {
  getComments.mockResolvedValue({ list: [{ ...comment, _id: "reply-1", parentId: "root-1" }], total: 1 });
  const view = await setup();
  expect(view.getByText("Post comment")).not.toBeDisabled();
  act(() => Simulate.click(view.getByText("Reply to")));
  fillForm(view);
  await submit(view);
  expect(createComment).toHaveBeenCalledWith("article-1", {
    name: "Reader", email: "reader@example.com", content: "A useful article.", parentId: "root-1",
  });
});

test("a failed submission retains the draft and reports the error", async () => {
  const error = new Error("Connection unavailable");
  createComment.mockRejectedValue(error);
  const view = await setup();
  expect(view.getByText("Post comment")).not.toBeDisabled();
  fillForm(view);
  await submit(view);
  expect(sweetErrorHandling).toHaveBeenCalledWith(error);
  expect(view.getByLabelText("Your comment")).toHaveValue("A useful article.");
  expect(view.store.getState().blogPage.comments.total).toBe(0);
});
