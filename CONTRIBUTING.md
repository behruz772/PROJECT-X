# Contributing to PROJECT X

Thank you for contributing to PROJECT X.

PROJECT X is a collaborative platform built by multiple developers working on one shared architecture.

Our goal is simple:

> One team. One architecture. One source of truth.

---

## 1. Before You Start

Before writing code:

1. Read the GitHub Issue assigned to you.
2. Understand the acceptance criteria.
3. Inspect the existing architecture.
4. Search for existing services, models, APIs, and utilities.
5. Reuse existing systems whenever possible.
6. Ask before changing shared architecture.

Do not start coding immediately without understanding the existing system.

---

## 2. GitHub Issues

Every development task must be connected to a GitHub Issue.

Example:

`TASK-021 — Creator Projects & Collaboration`

The Issue is the source of truth for the task requirements.

Developers must not silently expand the scope of an Issue.

If additional work is discovered:

- Explain the reason.
- Create a new Issue if necessary.
- Discuss the change before implementing unrelated functionality.

---

## 3. Branches

Never develop directly on `main`.

Create a separate branch for every task.

Recommended format:

```text
feature/task-021-projects
feature/task-022-live
feature/task-023-events