import LayoutWorkSpace from "@/layouts/LayoutWorkSpace";
import MainPage from "@/pages";
import Page1 from "@/pages/page1";

export const routes = [
  {
    path: "/",
    element: <LayoutWorkSpace />,
    children: [
      { path: "/", element: <MainPage />, index: true },
      { path: "/page1", element: <Page1 /> },
    ],
  },
];

export const pages = [
  { route: "/", label: "HOME" },
  { route: "/page1", label: "PAGE1" },
];
