#!/usr/bin/env bash

# if bun is installed, use it to run the app
if command -v bun >/dev/null 2>&1; then
    # pass arguments to bun
    bun run ./index.mjs $@
else
    # otherwise, use the local version of node
    node ./index.mjs $@
fi
