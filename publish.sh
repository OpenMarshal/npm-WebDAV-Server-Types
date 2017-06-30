#!/bin/bash

if [[ $# -eq 0 ]] ; then
    echo 'Usage : publish <repo>'
    exit 0
fi

node tools/packagerOne.js $1 && cd "repositories/$1" && npm i && tsc && npm publish --access=public && echo 'Done.'
