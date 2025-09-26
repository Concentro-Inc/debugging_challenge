# Debugging Exercise (Intentionally Broken)


Run:


```bash
npm i
npm run dev
```


Look for:
- Security leaks (exposed secrets, XSS, unsafe eval, http URLs, tokens in query strings/localStorage).
- Vulnerable deps (`npm audit`). Suggest upgrades or removals.
- Anti-patterns (DOM manipulation via jQuery inside React, duplicated logic, derived state bugs, unbounded effects, memory leaks, mutation).
- Performance issues (heavy computations on render, useless re-renders, keys, list rendering, inline handlers in big lists, no memoization, N+1 fetching).
- Accessibility and UX issues (poor labels, bad focus, confusing CTAs, low contrast, misleading affordances).
- TypeScript smells (anys, ts-ignore, incorrect types, non-null assertions, union abuses, dead code).