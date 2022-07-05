#!/usr/bin/env bash

script_dir=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
# For OSX only

cp "$HOME/Library/Application Support/Google/Chrome/Default/Bookmarks" $script_dir/chrome-bookmarks.json
