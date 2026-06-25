# core — the minimal, product-neutral root installation.
#
# The Agent Orange sandbox base (badcode-agent-orange-sandbox, built from the
# agent-orange repo's sandbox/Dockerfile) already provides the harness: a
# node:20-slim base with bash, git, ripgrep, ca-certificates, the in-image
# control server, /workspace, port 3010, healthcheck and CMD.
#
# "core" adds only a small set of universally-useful, project-neutral CLI tools
# so every downstream image can rely on them. It deliberately contains NOTHING
# project-specific. Other installations extend this via `parent: core`.
#
# Do NOT set CMD / ENTRYPOINT / EXPOSE / HEALTHCHECK — owned by the base image.
#
# Build:
#   docker build -t badcode-agent-orange-sandbox:dev ../agent-orange/sandbox
#   docker build -f installations/core/Dockerfile \
#     --build-arg BASE_IMAGE=badcode-agent-orange-sandbox:dev \
#     -t badcode-core:dev installations/core
ARG BASE_IMAGE=badcode-agent-orange-sandbox:dev
FROM ${BASE_IMAGE}

# Shell + filesystem essentials. bash/git/ripgrep/ca-certificates already come
# from the base; this guarantees the rest are present even on a slimmer base.
RUN apt-get update && apt-get install -y --no-install-recommends \
      coreutils findutils grep sed gawk \
      curl jq file less unzip \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /workspace
