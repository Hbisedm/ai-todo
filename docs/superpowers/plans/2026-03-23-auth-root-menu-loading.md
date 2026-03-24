# Auth Root Redirect, User Menu, and Loading States Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `/` redirect signed-in users to their localized dashboard, replace the dashboard account panel with a compact dropdown menu, and add button-level loading states for auth and todo actions.

**Architecture:** Reuse existing Auth.js session checks and locale routing, add a small redirect helper for the root route, add a client-side account menu component for logout, and introduce reusable loading button primitives for client and server form submissions. Keep the locale-prefixed routing model intact.

**Tech Stack:** Next.js App Router, Auth.js/NextAuth, next-intl, React client components, Prisma-backed server actions, Vitest, Playwright.

---
