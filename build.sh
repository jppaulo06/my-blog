#!/bin/bash

for file in posts*.md; do
  pandoc -f markdown "$file" > ./public/posts/"${file%.md}.html"
done
