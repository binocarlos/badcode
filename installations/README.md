# Installations — curated base images for Agent Orange

These are the **installation images** that Agent Orange sessions launch from. They're curated
here, in the badcode repo, on purpose: all the projects that consume them are mine, so the image
definitions live in one place I control rather than scattered per project.

## The layering

The build is layered — each image is `FROM` the one below it:

```
badcode-agent-orange-sandbox:dev   ← the harness (engine), built from the agent-orange repo
        ▲                            node:20-slim + bash, git, ripgrep, ca-certificates,
        │                            the in-image control server, /workspace, port 3010
   core                            ← this repo: minimal, product-neutral root. Shell + fs
        ▲                            essentials and nothing else. Everything extends this.
        │
   application                     ← this repo: EXAMPLE per-project image extending core.
                                     Copy it to start a new project's base image.
```

The point: curate **multiple base images across projects** by adding siblings to `application`
(`installations/<project>/`), each `parent: core` (or extending another project image), each
adding only what that project needs.

## The contract

Each installation is a folder:

```
installations/<name>/
  installation.json   # { "name", "parent"?, "description" }   (omit "parent" for a root)
  Dockerfile          # ARG BASE_IMAGE=<parent-or-sandbox> ; FROM ${BASE_IMAGE} ; your layers
  overlay/            # (optional) files copied into /workspace/ — project template, CLAUDE.md, skills
```

**Do not** set `CMD` / `ENTRYPOINT` / `EXPOSE` / `HEALTHCHECK` — those are owned by the sandbox
base image (the engine). An installation only *adds* environment, tools, and workspace content.

## Building (manual, for now)

The agent-orange engine will get a first-class `ao installations build` command (see the engine's
`MIGRATION.md`, Phase 3). Until then, build by hand from this repo's root:

```sh
# 1. the harness/engine image (from the agent-orange repo, once)
docker build -t badcode-agent-orange-sandbox:dev ../agent-orange/sandbox

# 2. core (root) — extends the sandbox
docker build -f installations/core/Dockerfile \
  --build-arg BASE_IMAGE=badcode-agent-orange-sandbox:dev \
  -t badcode-core:dev installations/core

# 3. application — extends core
docker build -f installations/application/Dockerfile \
  --build-arg BASE_IMAGE=badcode-core:dev \
  -t badcode-application:dev installations/application
```

Pushing these to a registry (Google Cloud Artifact Registry first) is the engine's Phase 3/4 work.
