#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

node_modules/.bin/tsx scripts/generate-cv-cn.ts
latexmk -xelatex -interaction=nonstopmode -halt-on-error -outdir=build/cv build/cv/ZixiangWang_CV_CN.tex
cp build/cv/ZixiangWang_CV_CN.pdf "build/cv/王子翔-个人简历.pdf"
