# Fix Plan: "Unknown at rule @tailwind"

The user is experiencing an error because they have **Tailwind CSS v4** installed, but the project is configured with **Tailwind CSS v3** syntax and plugins.

## Steps:
1. **Update CSS Syntax**: Change `@tailwind` directives to `@import "tailwindcss";` in `src/app/globals.css`. (Already partially done)
2. **Install Plugin**: Install `@tailwindcss/postcss` which is required for Tailwind v4 integration with PostCSS.
3. **Update PostCSS Config**:
    - Update `postcss.config.mjs` to use `@tailwindcss/postcss`.
    - Remove the redundant `postcss.config.js`.
4. **Clean up**: Ensure only one PostCSS config exists.

## Rationale:
Tailwind v4 is a major update that shifts towards a more CSS-native approach. It no longer uses the `@tailwind` directive by default and requires a specific PostCSS plugin if used in a PostCSS environment (like Next.js).
