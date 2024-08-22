import LayoutWorkSpace from "@/layouts/LayoutWorkSpace";
import MainPage from "@/pages";

export const routes = [
  {
    path: "/",
    element: <LayoutWorkSpace />,
    children: [{ path: "/", element: <MainPage />, index: true }],
  },
];

export const pages = [{ route: "/", label: "HOME" }];
