---
title: "I Built a Queue for My AI Coding Agent"
excerpt: "I kept losing good ideas while Claude was busy. So I built claude-message-queue, a small plugin that saves the next thing to do and runs it only after the current work is finished."
date: 2026-09-04
updated: 2026-09-04
tags: ["Claude Code", "Developer tools", "Open source", "Bash"]
seoDescription: "Building claude-message-queue, an open-source Claude Code plugin and CLI: a durable FIFO queue per git repo, a Stop hook that auto-runs queued prompts, mkdir locks, and stale lock recovery."
---

![A notepad with colorful sticky note tabs](https://cdn.pixabay.com/photo/2014/03/31/23/06/notepad-302288_1280.jpg)

When I work with Claude Code, there's a moment that keeps happening.

It's halfway through a task. I notice something else that needs doing. A test that should be added, a rename, a follow-up bug. I don't want to interrupt the current work, because interrupting usually makes things messier. So I tell myself I'll remember.

I don't remember.

Claude already lets you type a message while a turn is running, and it will pick it up after. That's great for one thing. But I wanted a real backlog. Something I can see, reorder in my head, retry, and that survives closing the terminal.

So I built [claude-message-queue](https://github.com/imdewan/claude-message-queue).

## The rule: never interrupt

The one thing this project promises is that it never interrupts, cancels, or injects anything into the turn that's running. Queued work starts only after the current work is finished.

That rule shaped everything else. It's a queue, not a steering wheel.

## How it works

You add things with a slash command:

```text
/queue:add Run the full test suite and fix any failures
/queue:add Update the README with the new flags
```

Messages are stored on disk, first in first out. Each item moves through `pending`, then `active`, then gets removed. It's only removed after it succeeds. If something fails, it goes back to `pending` so nothing silently disappears.

There's also a standalone `claude-queue` CLI, so I can add things from a normal terminal while Claude is working in another one.

## The Stop hook trick

The first version needed me to run `/queue:run` manually. It worked, but it was one more thing to remember, which is exactly the problem I was trying to solve.

Version 0.2.0 added a `Stop` hook. When Claude finishes a turn, the hook checks the queue. If there's pending work, it returns a block decision once, with a reason that tells Claude to claim the next message, show it, do it, and mark it done. It goes up to 25 messages, and if something gets blocked it retries later and stops instead of spinning.

The effect is really nice. You add a few things, walk away, and they happen one after another, in order, with nothing interrupted.

## One queue per repo, not per folder

I use git worktrees a lot, so I didn't want the queue tied to the current directory. The queue key comes from:

```bash
git rev-parse --git-common-dir
```

A main checkout and its worktrees share the same common git dir, so they share a backlog. Two separate clones of the same repo stay separate. That turned out to match how I think about "this project" much better than paths did.

Later I also scoped queues per session, so two Claude sessions in the same repo don't steal each other's work. Messages added from a plain terminal go to a shared project queue that sessions fall back to.

## Locks in Bash

The whole thing is Bash, around 400 lines, with a test suite running in GitHub Actions.

For locking I used `mkdir`, because creating a directory is atomic on basically every filesystem you'll meet. The lock directory holds a PID file. If the process holding the lock gets killed, the next writer checks whether that PID is still alive and cleans up the stale lock.

Without that check, one killed process would leave the queue refusing to do anything, forever. That fix went out in 0.1.1, a few hours after 0.1.0. There were three releases that day in total. Shipping small tools is like that.

## Why I like it

It's a tiny tool. But it changed how I work with an agent. I no longer hold a mental list while waiting. I write the next thing down the moment I think of it, and it happens when it's supposed to.

If you use Claude Code and this sounds useful, the install is two commands in the README. Issues and ideas are very welcome.
