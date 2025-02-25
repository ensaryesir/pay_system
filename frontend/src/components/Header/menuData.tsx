import { Menu } from "@/types/menu";

const menuData: Menu[] = [
  {
    id: 1,
    title: "Ana Sayfa",
    path: "/",
    newTab: false,
  },
  {
    id: 2,
    title: "Hakkımızda",
    path: "/about",
    newTab: false,
  },
  {
    id: 33,
    title: "Haberler",
    path: "/blog",
    newTab: false,
  },
  {
    id: 3,
    title: "İletişim",
    path: "/contact",
    newTab: false,
  },
  {
    id: 4,
    title: "Sayfalar",
    newTab: false,
    submenu: [
      {
        id: 44,
        title: "Blog Detay Sayfası",
        path: "/blog-details",
        newTab: false,
      },
      {
        id: 47,
        title: "Hata Sayfası",
        path: "/error",
        newTab: false,
      },
    ],
  },
];
export default menuData;
