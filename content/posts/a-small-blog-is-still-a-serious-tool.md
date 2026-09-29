---
title: "A Small Blog Is Still a Serious Tool"
excerpt: "I wanted a place that feels like a lab notebook: small enough to maintain, personal enough to be honest, and structured enough to be useful later."
date: 2026-04-29
updated: 2026-05-04
tags: ["Writing", "Firebase"]
---

# A Small Blog Is Still a Serious Tool

![A clean laptop desk with coffee](https://cdn.pixabay.com/photo/2021/01/12/19/59/laptop-5912463_1280.jpg)

I used to think a personal site had to be either a portfolio or a blog.

A portfolio is polished. A blog is alive.

The problem is that polished things can become stale very quickly. They show what you want people to think you are. Writing shows how you actually think.

That is why I wanted this site to have both.

## A blog is a memory system

I forget the emotional texture of technical decisions.

I remember the final choice, but not always the feeling around it: the weird bug, the tradeoff, the moment a simple approach won, the part where I almost overbuilt something because I wanted it to look more serious.

Writing catches that.

It also makes the work easier to explain later. A GitHub repo shows code. A blog post can show the pressure around the code.

## The boring parts matter

For this site, the blog is intentionally simple:

- Markdown in, readable HTML out
- drafts and published posts
- a private admin page
- SEO metadata per post
- structured data for search engines
- an [llms.txt](https://llmstxt.org/) style entry point for AI tools

The Firebase side is not glamorous, but it matters. The public can read published posts, but only my Google account should write. Firebase's own docs are clear that [Security Rules](https://firebase.google.com/docs/rules) are the real boundary. UI checks are nice for experience; rules are what protect the database.

That distinction feels small until it is not.

## I want the site to feel like me

Not loud. Not over-designed. Not pretending every post is a grand essay.

Just a place to write down what I am learning while building things: React Native notes, on-device AI experiments, product decisions, mistakes, tiny wins, and the occasional emotional post about why a small technical choice bothered me all day.

That feels useful.

And for now, useful is enough.
