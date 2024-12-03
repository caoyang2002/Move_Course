## this script deploys the static website of course.rs to github pages

## build static website for book
mdbook build
## copy CNAME info to book dir
cp ./assets/CNAME ./book/
cp ./assets/*.html ./book/
cp ./assets/sitemap.xml ./book/

## init git repo
cd book
git init
git add .
git commit -m 'deploy'
git branch -M gh-pages
git remote add origin https://github.com/caoyang2002/Move_Course

## push to github pages
git push -u -f origin gh-pages
