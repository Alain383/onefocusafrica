/**
 * Converts a title string into a URL-safe slug.
 *
 * Steps:
 *   1. Lowercase the input
 *   2. Replace spaces with hyphens
 *   3. Strip any character that is not [a-z0-9-]
 *   4. Collapse consecutive hyphens into one
 *   5. Trim leading and trailing hyphens
 *
 * Returns an empty string when no valid characters remain.
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '')
}