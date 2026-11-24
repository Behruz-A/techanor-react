import { ProductCategory } from "../../constants/enums";

export const footerContact = {
  email: "support@techanor.com",
  phone: "+82 010-0101-010",
  phoneLink: "tel:+820100101010",
  location: "Seoul, South Korea",
};

export const footerSections = [
  {
    title: "Customer Service",
    links: [
      { label: "Returns & Exchanges", to: "/help" },
      { label: "Orders & Shipping", to: "/orders" },
      { label: "Delivery Information", to: "/help" },
      { label: "Terms of Use", to: "/help" },
      { label: "FAQs", to: "/help?tab=faq" },
      { label: "Contact Us", to: "/help?tab=contact" },
    ],
  },
  {
    title: "Get Involved",
    links: [
      { label: "About Us", to: "/about" },
      { label: "Techanor Blog", to: "/blog" },
      { label: "Explore Products", to: "/products" },
      { label: "My Account", to: "/member-page" },
      { label: "My Orders", to: "/orders" },
      { label: "Customer Support", to: "/help" },
    ],
  },
  {
    title: "Quick Links",
    links: [
      { label: "Smartphones", to: `/products?${new URLSearchParams({ category: ProductCategory.SMARTPHONE }).toString()}` },
      { label: "Headphones", to: `/products?${new URLSearchParams({ category: ProductCategory.AUDIO }).toString()}` },
      { label: "Computers & Laptops", to: `/products?${new URLSearchParams({ category: ProductCategory.LAPTOP }).toString()}` },
      { label: "TV & Home", to: `/products?${new URLSearchParams({ category: ProductCategory.TV }).toString()}` },
      { label: "Gaming", to: `/products?${new URLSearchParams({ category: ProductCategory.GAMING }).toString()}` },
      { label: "Watches", to: `/products?${new URLSearchParams({ category: ProductCategory.WEARABLES }).toString()}` },
    ],
  },
];
