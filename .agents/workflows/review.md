---
name: review
description: Review code changes from another model/session. Reads PENDING_REVIEW.md, inspects all changed files, and generates a detailed REVIEW_REPORT.md.
version: 1.0.0
requires_agents: code-archaeologist
requires_skills: code-review-checklist, clean-code, verify-changes
artifact_outputs: REVIEW_REPORT.md
---

# /review — Cross-Model Code Review

$ARGUMENTS

---

## 🔴 CRITICAL RULES

1. **Read `PENDING_REVIEW.md` first** — it contains the file list and context
2. **Read every changed file** — do not skip any file listed
3. **Execute verification** — run `npm run build` and `npm run lint` to confirm
4. **Generate `REVIEW_REPORT.md`** — structured report with findings
5. **Clean up** — delete `PENDING_REVIEW.md` after review is complete

---

## Task

Review all code changes made by the previous model session.

```
WORKFLOW:

1. CHECK if PENDING_REVIEW.md exists in project root
   → If YES: read it for context (branch, changed files, lint status)
   → If NO: use `git diff HEAD~1 --name-only` to find recent changes

2. READ each changed file completely
   → Focus on: logic errors, security issues, code quality, conventions

3. RUN verification commands:
   → `npm run build` — must pass
   → `npm run lint` — must pass
   → Check for TypeScript errors

4. REVIEW against checklist:
   □ Logic correctness — no bugs, edge cases handled
   □ Security — no XSS, no exposed secrets, sanitization intact
   □ TypeScript — proper types, no `any` abuse
   □ Prisma — schema consistency, proper relations
   □ NextAuth — session handling, middleware protection
   □ Performance — no N+1 queries, no unnecessary re-renders
   □ Convention — follows project patterns in .agents/rules/

5. GENERATE REVIEW_REPORT.md with findings

6. DELETE PENDING_REVIEW.md (cleanup)
```

---

## Review Checklist (Mandatory)

### Security
- [ ] HTML sanitization intact (sanitize-html config)
- [ ] No `dangerouslySetInnerHTML` without sanitization
- [ ] Auth middleware protecting `/dashboard` routes
- [ ] No exposed API keys or secrets
- [ ] Prisma queries use parameterized inputs

### Logic
- [ ] Server actions validate input
- [ ] Error handling present (try/catch, error boundaries)
- [ ] Edge cases: empty data, missing user, invalid username
- [ ] View count throttling still works

### Code Quality
- [ ] No dead code or commented-out blocks
- [ ] TypeScript strict compliance
- [ ] Consistent naming conventions
- [ ] No unnecessary dependencies added

### Data Integrity
- [ ] Prisma schema matches migrations
- [ ] Foreign key relationships correct
- [ ] `data-slot` markers preserved in profile HTML

---

## Output Format

```markdown
# Code Review Report

**Reviewer:** Claude (cross-model review)
**Date:** [auto]
**Branch:** [from PENDING_REVIEW]
**Files Reviewed:** [count]

## Build & Lint

| Check | Status |
|-------|--------|
| `npm run build` | ✅/❌ |
| `npm run lint` | ✅/❌ |
| TypeScript | ✅/❌ |

## Findings

### 🔴 Critical (Must Fix)
- [issue with file link and line number]

### 🟡 Warning (Should Fix)
- [issue with file link and line number]

### 🟢 Info (Nice to Have)
- [suggestion with file link]

## Summary

[One paragraph: overall quality assessment and action items]
```

---

## Usage Examples

```
/review
/review focus on security
/review check the dashboard changes only
```
