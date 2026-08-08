---
name: dual-model-protocol
version: 1.0.0
priority: P1
trigger: always
description: Protocol for dual-model workflow. Gemini executes code, Claude reviews. Both models must check for handoff artifacts (PENDING_REVIEW.md, task plans) on session start.
---

# Dual-Model Protocol

> This project uses a **dual-model workflow**: one model writes code (Gemini), another reviews it (Claude).
> Both models MUST follow these handoff rules.

---

## 🔄 Workflow Overview

```
User prompt → Claude (plan/review) ↔ Gemini (execute)
```

| Role | Model | Responsibilities |
|------|-------|-----------------|
| **Planner / Reviewer** | Claude | Read ROADMAP, create `{task-slug}.md`, review code, generate `REVIEW_REPORT.md` |
| **Executor** | Gemini | Implement code following plans, commit changes, follow `.agents` rules |

---

## 📋 Session Start Checklist (BOTH models)

When starting a new session, ALWAYS check:

1. **`PENDING_REVIEW.md`** exists in project root?
   - → If YES and you are **Claude**: Start reviewing (use `/review` workflow)
   - → If YES and you are **Gemini**: Ignore — this is for the reviewer model
   
2. **`{task-slug}.md`** plan files exist?
   - → If YES and you are **Gemini**: Follow the plan to implement
   - → If YES and you are **Claude**: Check if implementation is done, then review

3. **`REVIEW_REPORT.md`** exists with recent findings?
   - → If YES and you are **Gemini**: Check for Critical/Warning items to fix
   - → If YES and you are **Claude**: Verify previous fixes were applied

---

## 📝 Handoff Artifacts

| File | Created By | Read By | Purpose |
|------|-----------|---------|---------|
| `PENDING_REVIEW.md` | Auto (hook) | Claude | Lists changed files + lint status for review |
| `{task-slug}.md` | Claude | Gemini | Implementation plan with detailed steps |
| `REVIEW_REPORT.md` | Claude | Gemini + User | Review findings with severity levels |
| `ROADMAP.md` | Both | Both | Source of truth for project progress |

---

## ⚠️ Rules

1. **Never ignore handoff files** — always check them at session start
2. **Plans are binding** — Gemini should follow `{task-slug}.md` plans, not improvise differently
3. **Reviews are actionable** — 🔴 Critical items must be fixed before next feature
4. **Clean up after review** — Claude deletes `PENDING_REVIEW.md` after generating report
5. **Commit messages matter** — Gemini should write clear commit messages for Claude to review

---
