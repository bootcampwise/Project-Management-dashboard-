export const IMAGES = {
  logo: "/logo.png",
  logo2: "/logo2.png",
  sidebarLogo: "/sidebarlogo.png",
  collapse: "/collapse.png",
  google: "/google.png",
  microsoft: "/microsoft.png",
  github: "/github.png",
  figma: "/figma.png",
} as const;

export type ImageKey = keyof typeof IMAGES;
