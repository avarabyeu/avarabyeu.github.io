#!/bin/bash
set -e # Exit with nonzero exit code if anything fails

# publi.sh
# change the branch names appropriately
# git checkout develop
git fetch;

git config --global user.email "andrei_varabyeu@gmail.com";
git config --global user.name "avarabyeu";
git remote set-url origin git@github.com:avarabyeu/avarabyeu.github.io.git;

git add _site;
git commit -m "`date`";
git push origin develop;
git subtree push --prefix  _site/ origin master;
