# application — EXAMPLE installation extending "core".
#
# This demonstrates the layered build and is the starting template for a
# per-project base image. Copy this folder to installations/<your-project>/,
# set "parent" in installation.json, and replace the layers below with what the
# project actually needs.
#
# Do NOT set CMD / ENTRYPOINT / EXPOSE / HEALTHCHECK — owned by the base image.
#
# Build (after core exists):
#   docker build -f installations/application/Dockerfile \
#     --build-arg BASE_IMAGE=badcode-core:dev \
#     -t badcode-application:dev installations/application
ARG BASE_IMAGE=badcode-core:dev
FROM ${BASE_IMAGE}

# --- Example project runtime layer (replace per project) -------------------
# RUN apt-get update && apt-get install -y --no-install-recommends \
#       python3 python3-pip nodejs \
#     && rm -rf /var/lib/apt/lists/*

# --- Seed the workspace from this installation's overlay/ -------------------
# Files under overlay/ are copied into /workspace (project memory, skills,
# templates). Here it ships only a CLAUDE.md as an example.
COPY overlay/ /workspace/

WORKDIR /workspace
