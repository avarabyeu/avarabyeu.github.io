#!/bin/bash
set -e # Exit with nonzero exit code if anything fails

# publi.sh
# change the branch names appropriately
# git checkout develop

git config --global user.email "andrei_varabyeu@gmail.com";
git config --global user.name "avarabyeu";
git remote set-url origin git@github.com:avarabyeu/avarabyeu.github.io.git;

echo "Fetch the repo"
git fetch;

git add _site;
git commit -m "`date`";

echo "Push to develop"
git push origin develop;

echo "Push subtree to master"
git subtree push --prefix  _site/ origin master;
