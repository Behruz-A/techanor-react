# Techanor backend integration

## Shop catalog

The Shop catalog continues to load active products through the existing
`GET /product/all` contract (batches of 50, newest first). The optional
category, brand, memory, condition and search parameters remain unchanged.
Availability (`productLeftCount > 0`) and price filtering run on the loaded
catalog before sorting and pagination. `In stock only`, removable filter
chips, and card specifications use existing typed fields; no new endpoint
or invented stock/specification data is introduced. Removing filters and
changing availability/price resets pagination to page one. Blank maximum
price means unlimited; a maximum of zero is treated as zero.

## Homepage featured products

`ProductService.getProducts({ page: 1, limit: 8, order: "productViews" })`
calls `GET /product/all?order=productViews&page=1&limit=8` without cookies.
The existing route returns `200 Product[]` with active (`PROCESS`) products,
sorted by views descending. Fields are defined in frontend `lib/types/product.ts`
and backend `libs/types/product.ts`.

`FeaturedProducts.tsx` loads the response into the homepage `featuredProducts`
Redux field using `setFeaturedProducts` and `retrieveFeaturedProducts`.
Loading, empty, error, and retry states are rendered. Product media uses the
shared media resolver. Wishlist behavior remains in the existing Context.
Featured product cards reveal the add-to-cart action on hover or keyboard
focus; touch devices keep it visible. The existing basket Context handles
stock-limited quantities and persistence. The card gallery uses the product's
existing image array; previous/next controls appear only for multiple images.
The New badge reflects `ProductCondition.NEW`. No fabricated discount prices
or comparison feature are introduced. No new backend endpoint is required.

## Homepage trending products

`ProductService.getProducts({ page: 1, limit: 12, order: "productViews" })`
calls `GET /product/all?order=productViews&page=1&limit=12` without cookies.
It uses the existing `Product[]` contract, active-product filter, and descending
view ordering verified in `product.controlle.ts` and `product.service.ts`.
Here, trending means cumulative product views, without a time-window metric.

`TrendingProducts.tsx` follows service -> component effect ->
`setTrendingProducts` -> `retrieveTrendingProducts` in the registered homepage
Redux slice. It handles loading, empty, error and retry states. The Swiper
carousel displays four cards on desktop and fewer on smaller screens, with
previous/next controls and keyboard navigation. Titles, images, and prices
come from the API. Sale/old prices are not invented: the current `Product`
contract contains only `productPrice`. This replaces Today's Best Deals and
its static countdown. No backend contract change is required.

## Homepage collection showcase

`ProductShowcase.tsx` now uses the exact three reference banner images
requested by the user, stored in `public/img/showcase`. Source URLs are
recorded in that directory's `SOURCES.md`. Runtime image requests are local.
Typed editorial slide data lives in `lib/data/showcase.ts`; these banners
are independent of backend catalog records and carry no invented product
prices, stock, or product IDs. Their links open existing category/search
routes. Featured and trending product collections still use the API/Redux
contracts documented above.

The previous latest-three-products request and its unused showcase Redux
field/action/selector have been removed. Swiper provides previous/next,
clickable pagination, swipe and keyboard controls. Slides loop automatically
every five seconds, continuing after manual navigation and on mouse hover.
Inactive links are removed
from keyboard focus. Images preserve their original aspect ratio. No backend
contract change is required.

## Blog integration

Base URL: `serverApi` (`REACT_APP_API_URL`, locally `http://localhost:3001`).
The frontend uses `src/app/services/BlogService.ts`. Shared data lives in the
registered `blogPage` Redux slice with typed hooks and selectors. No cookie
credentials are sent for these public endpoints.

## Published articles (existing)

- `GET /blog/all?page=1&limit=50`: `200 BlogPost[]`, newest first. Optional
  `blogPostCategory` and `search` query parameters; limit capped at 50.
- `GET /blog/:id`: `200 BlogPost`, increments views; only published articles
  are returned. Invalid ID: `400`; missing/unpublished: `404`.
- Article content is plain text with blank-line separated paragraphs,
  Markdown headings (`##`, `###`), blockquotes (`>`), and optional standalone
  Markdown images (`![alt](media-path)`). Text is rendered without raw HTML.
- Images/video use the shared media resolver for backend-relative or absolute URLs.

## Comments and replies

Backend: `router.ts` -> `blogComment.controller.ts` ->
`models/blogComment.service.ts` -> `controllers/schema/BlogComment.model.ts`.
Types: backend `libs/types/blogComment.ts`, frontend `lib/types/blog.ts`.
Collection: `blogComments`, indexed by `blogPostId`, `createdAt`, `_id`.

### GET /blog/:id/comments?page=1&limit=20

`200 { list: BlogComment[], total: number }`. Oldest first, stable ordering by
`createdAt`, `_id`. Positive integer page/limit; default 1/20; maximum limit 50.
`total` includes replies. Empty collection: `{ "list": [], "total": 0 }`.
Only comments on published articles are accessible.

Public comment fields:

```ts
interface BlogComment {
  _id: string;
  blogPostId: string;
  parentId: string | null;
  name: string;
  content: string;
  createdAt: string; // ISO timestamp
}
```

### POST /blog/:id/comments

Public guest submission, no session required. JSON body:

```ts
interface BlogCommentInput {
  name: string;       // trimmed, 2-80 characters
  email: string;      // valid email, maximum 254 characters
  content: string;    // trimmed, 2-3000 characters
  website?: string;   // optional HTTP(S) URL, maximum 500 characters
  parentId?: string;  // root comment on the same published article
}
```

Returns `201 BlogComment`. Email and website are private storage fields and
are omitted from both GET and POST responses. The client supplies no avatar,
status, timestamp, or author ID. Replies have one level; replying to a reply
uses its root comment. Cross-article parents and parents that are replies are
rejected. Invalid input/IDs: `400`; missing/unpublished article: `404`.
Application errors: `{ code: number, message: string }`; unexpected errors:
`500` with the standard backend error shape.

The UI handles loading, empty and error states, paginated loading, submission
feedback, and duplicate-safe Redux appends. Name/email/website are stored in
browser storage only when the visitor opts in; unchecking removes the saved
identity. A failed submission keeps the form draft.

## Related navigation

`/blog?search=...` and `/blog?category=...` initialize the existing index
filters. Category values come from the canonical frontend enum. Sidebar
product and help links use existing routes. Newsletter signup is not offered:
Techanor currently has no newsletter endpoint; the sidebar links to contact.

## Verification (2026-11-24)

- Backend `npm.cmd run check` passed.
- Live requests on port 3001 verified empty results, persisted comments and
  replies, private email/website fields, pagination, invalid IDs and email,
  cross-article/nested reply rejection, and unpublished article protection.
- The verification created temporary articles/comments and removed only those
  fixtures after the checks. Existing articles and comments were preserved.
- Frontend production build passed. Browser visual QA was blocked by the
  computer-use tool because it could not determine the current browser URL.
