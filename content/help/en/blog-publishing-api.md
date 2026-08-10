## What Is the Blog Publishing API

The Blog Publishing API lets you manage blog submissions through **personal access tokens** directly from local AI coding tools like Codex and Claude Code. You can create drafts, upload images, preview formatting, edit Markdown, and submit for review — all via the command line or AI assistant, without opening a browser.

The advantage of API-based publishing: AI tools can help with formatting, typo fixes, and style consistency, resulting in higher-quality posts with less effort.

## Prerequisites

1. **Registered and verified email**: API tokens are tied to your account. Unverified emails cannot create tokens.
2. **Create a personal access token**: After logging in, go to "Account Settings → Blog API Tokens". Tokens use the `msb_...` format. The full token is shown only once upon creation — copy it immediately.

## Token Scopes

Tokens have four independent scopes. Select what you need:

| Scope | Capability |
|---|---|
| `blog:read` | Read section lists, your own posts, and previews |
| `blog:write` | Create posts, edit your own drafts or rejected posts |
| `blog:submit` | Submit posts for review, withdraw pending posts |
| `blog:image` | Upload blog images (max 5MB each, 200MB per user quota) |

Publishing a full post typically requires all four scopes. If you only want AI tools to read posts for reference, `blog:read` alone is sufficient.

## Publishing Workflow Overview

The complete workflow has five steps:

1. **List sections** — Confirm which section your post belongs to
2. **Create a draft** — Title, excerpt, content, section, tags
3. **Read and edit** — Use `updatedAt` for optimistic locking to avoid conflicts
4. **Upload images and preview** — Images go through a dedicated upload endpoint; preview uses the production rendering pipeline
5. **Submit or withdraw** — After submission, the post enters the manual review queue

## Full API Guide

For detailed commands, request formats, and error recovery for each step, see:

[View the Complete API Guide →](/blog/api-guide)

The full guide includes `curl` examples for various environments, token security best practices, a step-by-step error code reference table, and practical demonstrations for Codex and Claude Code.

## Security Notes

- **Never commit tokens to repositories**, and never write them into `.md` posts, `AGENTS.md`, screenshots, or logs.
- Use `read -s` for silent input, set a temporary environment variable, and `unset` it when done.
- Each token can be set to expire in 30, 90, or 365 days. Expired tokens are automatically invalidated.
- You can hold up to 10 tokens at a time. Revoke unused tokens from the account page.

## FAQ

### Can I publish file-based posts (`content/blog/*.md`) via the API?

No. The API only manages **database submissions**, sharing the same data as the web `/blog/submit` page. File-based posts belong to the site owner and are managed through the Git repository.

### Can admins publish directly via the API?

When an admin submits a post using their own token, it transitions directly to `published`, skipping manual review. However, admin tokens cannot edit other users' posts or access the admin review interface.

### What if image upload fails?

Check the image format (WebP/JPEG/PNG/GIF supported), size (under 5MB), and pixel count (under 40 megapixels). If quota is full, contact the admin to clean up unreferenced objects. Identical repeated uploads reuse the original URL without consuming quota.
