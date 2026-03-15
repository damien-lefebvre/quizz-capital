// =============================================================================
// Storage Migration System
// =============================================================================

const VERSION_KEY = "quizz-capital-version";
const HISTORY_KEY = "quizz-capital-history";

/**
 * Current storage version.
 * Increment this when making breaking changes to localStorage schema.
 */
const CURRENT_VERSION = 1;

// =============================================================================
// Legacy Types (for migration purposes)
// =============================================================================

interface LegacyFailedCountryRecord {
  iso: string;
  name: string;
  capital: string;
}

interface LegacyGameRecord {
  id: string;
  date: string;
  score: number;
  capitalsFound: number;
  capitalsAttempted: number;
  flagsFound: number;
  flagsAttempted: number;
  failedCountries: LegacyFailedCountryRecord[];
  maxCombo: number;
  capitalsSuccessful?: string[];
  flagsFailed?: string[];
}

// =============================================================================
// Migration Functions
// =============================================================================

/**
 * Migration from version 0 (no version key) to version 1:
 * - Convert failedCountries from FailedCountryRecord[] to failedCountriesIso (string[])
 */
function migrateV0ToV1(): void {
  try {
    const historyRaw = localStorage.getItem(HISTORY_KEY);
    if (!historyRaw) return;

    const history = JSON.parse(historyRaw) as LegacyGameRecord[];

    // Check if migration is needed (if any record has the old format)
    const needsMigration = history.some(
      (game) =>
        Array.isArray(game.failedCountries) &&
        game.failedCountries.length > 0 &&
        typeof game.failedCountries[0] === "object" &&
        "name" in game.failedCountries[0],
    );

    if (!needsMigration) return;

    // Migrate each game record
    const migratedHistory = history.map((game) => {
      // Extract ISO codes from the old format
      const failedCountriesIso = Array.isArray(game.failedCountries)
        ? game.failedCountries.map((c) =>
            typeof c === "object" && "iso" in c ? c.iso : c,
          )
        : [];

      // Return new format without the old failedCountries field
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { failedCountries: _removed, ...rest } = game;
      return {
        ...rest,
        failedCountriesIso,
      };
    });

    localStorage.setItem(HISTORY_KEY, JSON.stringify(migratedHistory));
    console.log(
      `[Migration] Migrated ${history.length} game records from v0 to v1`,
    );
  } catch (error) {
    console.error("[Migration] Error migrating from v0 to v1:", error);
  }
}

// =============================================================================
// Main Migration Entry Point
// =============================================================================

/**
 * Run all necessary migrations based on stored version.
 * Should be called once at app startup, before any localStorage access.
 */
export function runStorageMigrations(): void {
  try {
    const storedVersionStr = localStorage.getItem(VERSION_KEY);
    const storedVersion = storedVersionStr ? parseInt(storedVersionStr, 10) : 0;

    if (storedVersion >= CURRENT_VERSION) {
      return; // Already up to date
    }

    console.log(
      `[Migration] Upgrading storage from v${storedVersion} to v${CURRENT_VERSION}`,
    );

    // Apply migrations in order
    if (storedVersion < 1) {
      migrateV0ToV1();
    }

    // Add future migrations here:
    // if (storedVersion < 2) { migrateV1ToV2(); }

    // Update version
    localStorage.setItem(VERSION_KEY, CURRENT_VERSION.toString());
    console.log(`[Migration] Storage upgraded to v${CURRENT_VERSION}`);
  } catch (error) {
    console.error("[Migration] Error running storage migrations:", error);
  }
}

/**
 * Get the current storage version constant.
 */
export function getCurrentStorageVersion(): number {
  return CURRENT_VERSION;
}
