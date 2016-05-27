# publi.sh
# change the branch names appropriately
# git checkout develop
rm -rf _site/
bundle jekyll build
git add --all
git commit -m "`date`"
git push origin develop
git subtree push --prefix  _site/ "git@github.com:avarabyeu/avarabyeu.github.io.git" master
