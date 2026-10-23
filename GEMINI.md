# Antigravity Rules & Guidelines for AVITO

## 1. Strict Engineering Protocol (No Blind "Vibe Coding")
- **Never make undocumented or unapproved changes**: Always provide a detailed, step-by-step implementation plan before modifying any code.
- **Explain all modifications**: Clearly describe every file and every line being changed, why it is being changed, and what the before/after behavior will be.
- **Thorough Risk & Regression Assessment**: Evaluate edge cases (mobile responsiveness, browser policies, database backward compatibility, fallback scenarios) before modifying code.
- **Explicit Approval Required**: Wait for the user's explicit confirmation before applying changes and deploying.

## 2. Git Safety & Revertability
- **Granular Commits**: Keep Git commits small, logical, and thoroughly described.
- **Trackable History**: Never force-push or obliterate history; ensure every change can be reverted smoothly with `git revert` or `git checkout` if ever needed.

## 3. Code Quality & Standards
- Write clean, type-safe, maintainable TypeScript code.
- Avoid deprecated packages or unsafe assumptions.
- Run `npm run build` verification before any deployment to guarantee zero TypeScript or compiler errors.
