#!/usr/bin/env python3
import os
import shutil
import json
from pathlib import Path

script_dir = os.getcwd()
home = str(Path.home())
chrome_bookmarks_src_path = f"{home}/Library/Application Support/Google/Chrome/Default/Bookmarks"
bookmarks_path = f"{script_dir}/chrome-bookmarks.json"
shutil.copyfile(chrome_bookmarks_src_path, bookmarks_path)


def process_bookmarks_level(data: dict, level=1):
    indent = ' ' * (level - 1) * 2

    is_folder = data.get('type') == 'folder'

    if is_folder:
        print(indent + data.get('name'))
    else:
        print(indent + data.get('url') + ' ' + data.get('name'))

    children = data.get('children')
    if children:
        for child in children:
            if 'children' in child:
                child_list = child.get('children')
                for c in child_list:
                    process_bookmarks_level(c, level=level + 1)


with open(bookmarks_path) as json_file:
    bookmarks = json.load(json_file)
    roots = bookmarks.get('roots')

    for root in roots:
        root_dict = roots.get(root)
        process_bookmarks_level(root_dict, level=1)

        # links = roots.get(root).get('children')
        # print(roots.get(root).get('type'))
        # for link in links:
        #     # print(f"{link.get('name')} - {link.get('type')}")
        #     pass

        # {
        #   "date_added": "13250185595855825",
        #   "guid": "8d8da5bd-f16b-4771-abb9-e6e503ef7b52",
        #   "id": "829",
        #   "name": "edge-detector",
        #   "type": "url",
        #   "url": "https://github.com/JasonAltschuler/EdgeDetector"
        # },
