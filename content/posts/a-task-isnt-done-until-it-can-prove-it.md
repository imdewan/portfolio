---
title: "A Task Isn't Done Until It Can Prove It"
excerpt: "I built a small launch tracker with one stubborn rule: you can't tick a box unless the work behind it is actually there."
date: 2026-06-14
updated: 2026-06-14
tags: ["Product", "React", "Firebase", "Build log"]
seoDescription: "Why I built a launch tracker that blocks marking tasks done without an owner, a due date, proof links, and finished subtasks. Notes on the rules, the data model, and what changed."
---

Every task tracker I have used has the same quiet lie in it.

A checkbox.

You click it, the row turns grey, and everyone moves on. Nobody asks where the proof is. Nobody asks who owned it. Two weeks later someone finds out the "done" thing was about 70% done and the other 30% was living in someone's head.

During a launch that gap gets expensive. So I built a small tool around one rule: **a task can't be marked done unless it can prove it.**

## The guardrails

The app is called TaskFlow, and it is not trying to be Linear. It is a launch tracker with opinions.

Before a task can move to done, it needs:

- an owner
- a due date
- at least one proof link (a PR, a build, a doc, a screenshot)
- every acceptance criterion checked
- all subtasks finished

If any of those are missing, the done button just tells you what is missing. It does not scold you. It just refuses.

Parent tasks don't have their own done toggle at all. Their state comes from their children. If one subtask is still open, the parent is still open. That removed a whole category of arguments.

## Views that answer real questions

I stopped thinking in terms of "boards" and started thinking in terms of the questions I kept asking during a launch.

**What needs me today?** There is a Today queue that pulls in anything overdue, blocked, due today, or marked P0.

**What is quietly broken?** There is a Missing Details view that lists every task without an owner, date, or proof. This one turned out to be the most useful screen in the app. It is basically a list of future surprises.

**What changed?** An activity feed, because when a few people are editing the same plan, "who moved this" matters more than you think.

## The boring architecture

The whole workspace lives in a single Firestore document, synced live with `onSnapshot`. That sounds wrong until you remember the size of the thing. A launch plan is a few hundred tasks, not a few million. One document means one listener, no joins, and every client sees the same state within a second.

Auth is Firebase email and Google sign-in, and the security rules just check that you are signed in. If Firebase isn't configured it falls back to localStorage, which made local development very calm.

Is it elegant? Not really. Most of the UI is in one big `App.tsx`. But it shipped in days, it did its job, and changing a rule takes five minutes.

## What actually changed

The interesting part wasn't the code. It was behaviour.

When "done" requires proof, people start attaching proof while they work instead of after. Links show up in tasks early. Owners get assigned at creation because otherwise the task is stuck forever.

The tool didn't make anyone more disciplined. It just made the lazy path and the correct path the same path.

That is my favourite kind of product decision.
