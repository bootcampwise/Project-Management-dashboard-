// ============================================
// IMAGE CONSTANTS
// ============================================
// Centralized image paths for the application
// All images are stored in the public folder

export const IMAGES = {
  // === LOGOS ===
  logo: "/logo.png",
  logo2: "/logo2.png",
  sidebarLogo: "/sidebarlogo.png",

  // === UI ELEMENTS ===
  collapse: "/collapse.png",

  // === SOCIAL / AUTH PROVIDERS ===
  google: "/google.png",
  microsoft: "/microsoft.png",
  github: "/github.png",
  figma: "/figma.png",
} as const;

// Type for image keys (useful for type-safe access)
export type ImageKey = keyof typeof IMAGES;
