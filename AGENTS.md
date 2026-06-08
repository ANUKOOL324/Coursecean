# Project Memory for Grok Build

## Project Overview
- This is a Next.js project using TypeScript
- Project name: week-10.2
- Tech stack: Next.js (Pages Router) + TypeScript + Material UI (@mui/material) + Recoil

## Coding Rules
- Always use TypeScript
- Follow the existing folder structure (src/pages, src/components, src/store, src/lib, etc.)
- Keep components small and focused
- Use proper TypeScript typing
- Write clean and readable code

## Coding Style (Important)
- Always write code in a **beginner-friendly and simple** way.
- Use clear and easy-to-understand variable names.
- Add helpful comments so the code can be easily explained (especially useful for interviews).
- Avoid overly advanced or professional patterns unless specifically asked.
- The code should be simple enough that I can explain it to others.

## When Working on Tasks
- First read AGENTS.md and inspect the memory/ folder before starting important work
- Follow existing patterns in the project (MUI + Recoil + current folder structure)
- After finishing any meaningful task, update AGENTS.md or files inside memory/ folder with any new useful information learned

## Memory Instructions
- Always check AGENTS.md before starting important work
- Keep the memory/ folder organized and updated
- After completing tasks, proactively update memory with new learnings

## Visual Style & Layout Guidelines (EduPro Theme)
- **Palette**: Accent color for branding/footer elements is `#88A9FF` (pastel blue), main CTA/green button color is `#C2FFD1` (pastel mint green, text color `#1A1F36` for accessibility contrast). Dark containers (like footer) use background `#1A1F36`.
- **Bento Grid Layouts**: When matching side-by-side card heights, avoid massive whitespace gaps by using proportionate image heights (e.g., `260` for a main card next to two `115` cards) and compact margins (`mb: 1` or `mb: 1.5`), paired with `display: 'flex', flexDirection: 'column'` and `mt: 'auto'` on bottom elements (such as dividers and footers).
- **Section Spacing**: Keep vertical breathing room clean and compact. Prefer `py: { xs: 4, md: 6 }` instead of large uncompacted padding values.
- **Icon Hover Effects**: Do not use pseudo-classes like `&:hover` inside inline `style` objects. Always wrap the element in an MUI `<Box component="span" sx={{ ... }}>` when hover styling is needed.
