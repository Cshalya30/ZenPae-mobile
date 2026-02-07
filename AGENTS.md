# AGENTS.md

Project: ZenPae (React Native + Expo + TypeScript)

Purpose: Guidance for coding agents working in this repo.

## Core Principles
- Preserve existing screen layouts unless explicitly instructed.
- Do not break logic, navigation, or data flow.
- Avoid visual noise, gimmicks, or heavy effects.
- Aim for calm, premium, fintech-grade polish.
- If unsure, reduce intensity/opacity by ~30%.

## Design System (Round 2)
- Typography: Use Google Inter globally. Weights: Regular, Medium, Semibold.
- Colors: Dark mode default `#272B2F`. Use muted accents sparingly and purposefully.
- Borders: 0.5–0.75px; dark mode `rgba(255,255,255,0.06–0.10)`, light mode `rgba(0,0,0,0.06–0.10)`.
- Shadows: Soft, subtle; avoid strong border + strong shadow together.
- Bottom bar: thin border + soft shadow; no gradients.

## Engineering Rules
- Use `StyleSheet.create` and keep components reusable.
- Prefer `Animated`/Reanimated for motion; no bounce/spring unless specified.
- Keep performance stable on mid-range Android.
- Do not add features outside requested scope.

## If In Doubt
Default to restraint. Improve clarity, trust, and premium feel only.
