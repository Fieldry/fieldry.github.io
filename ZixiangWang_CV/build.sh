#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

export PATH="/Library/TeX/texbin:$PATH"

usage() {
    cat <<'EOF'
Usage:
  ./build.sh
  ./build.sh main
  ./build.sh main_cn_edit
  ./build.sh main_cn_intern
  ./build.sh clean

Behavior:
  - No argument: build all resumes.
  - One resume name: build only that target.
  - clean: remove common LaTeX intermediate files.
EOF
}

require_cmd() {
    local cmd="$1"
    if ! command -v "$cmd" >/dev/null 2>&1; then
        echo "Missing required command: $cmd" >&2
        echo "Current PATH: $PATH" >&2
        exit 1
    fi
}

build_xelatex() {
    local target="$1"
    echo "==> Building ${target}.tex with xelatex"
    xelatex -interaction=nonstopmode -halt-on-error "${target}.tex"
    xelatex -interaction=nonstopmode -halt-on-error "${target}.tex"
}

build_pdflatex() {
    local target="$1"
    echo "==> Building ${target}.tex with pdflatex"
    pdflatex -interaction=nonstopmode -halt-on-error "${target}.tex"
    pdflatex -interaction=nonstopmode -halt-on-error "${target}.tex"
}

clean_artifacts() {
    echo "==> Cleaning LaTeX artifacts"
    rm -f ./*.aux ./*.fdb_latexmk ./*.fls ./*.log ./*.out ./*.synctex.gz ./*.toc ./*.xdv
}

build_target() {
    local target="$1"
    case "$target" in
        main)
            build_pdflatex "$target"
            ;;
        main_cn_edit|main_cn_intern)
            build_xelatex "$target"
            ;;
        *)
            echo "Unknown target: $target" >&2
            usage
            exit 1
            ;;
    esac
}

require_cmd xelatex
require_cmd pdflatex

if [[ $# -gt 1 ]]; then
    usage
    exit 1
fi

if [[ $# -eq 0 ]]; then
    build_target main_cn_edit
    build_target main_cn_intern
    build_target main
    echo "==> Done"
    exit 0
fi

case "$1" in
    clean)
        clean_artifacts
        ;;
    -h|--help)
        usage
        ;;
    *)
        build_target "$1"
        echo "==> Done"
        ;;
esac
