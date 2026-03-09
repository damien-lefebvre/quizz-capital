// Import all flags using Vite's glob import
// This bundles all images and makes them available instantly
const flagModules = import.meta.glob<{ default: string }>(
  "../assets/h240/*.png",
  { eager: true },
);

// Build a map of ISO code -> image URL
const flagMap: Record<string, string> = {};

for (const path in flagModules) {
  // Extract ISO code from path: "../assets/h240/fr.png" -> "fr"
  const iso = path.split("/").pop()?.replace(".png", "") ?? "";
  flagMap[iso] = flagModules[path].default;
}

/**
 * Get the flag image URL for a country ISO code
 * @param iso - 2-letter ISO country code (lowercase)
 * @returns The bundled image URL or undefined if not found
 */
export function getFlagUrl(iso: string): string | undefined {
  return flagMap[iso.toLowerCase()];
}

/**
 * Get all available flag ISO codes
 */
export function getAvailableFlags(): string[] {
  return Object.keys(flagMap);
}

/**
 * Preload all flag images into browser cache
 * Call this on app startup for instant flag display
 */
export function preloadAllFlags(): Promise<void[]> {
  const promises = Object.values(flagMap).map((src) => {
    return new Promise<void>((resolve) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => resolve(); // Don't fail on missing images
      img.src = src;
    });
  });
  return Promise.all(promises);
}

/**
 * Preload a specific set of flags
 * @param isoCodes - Array of ISO codes to preload
 */
export function preloadFlags(isoCodes: string[]): Promise<void[]> {
  const promises = isoCodes.map((iso) => {
    const src = getFlagUrl(iso);
    if (!src) return Promise.resolve();

    return new Promise<void>((resolve) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => resolve();
      img.src = src;
    });
  });
  return Promise.all(promises);
}

export { flagMap };
