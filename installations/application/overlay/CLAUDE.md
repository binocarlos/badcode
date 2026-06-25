# Project workspace

This file is baked into the image at `/workspace/CLAUDE.md` from
`installations/application/overlay/`. It's the project's standing memory — the
agent reads it on every session in this installation.

Replace this with the real project brief when you copy `application` into a new
per-project installation: what the project is, where things live, how to run and
test it, and any conventions the agent must follow.

This example installation adds nothing beyond `core`; it exists to show the
layering (sandbox → core → application) and the `overlay/` workspace-seeding
mechanism.
