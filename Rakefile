# http://davidensinger.com/2013/07/automating-jekyll-deployment-to-github-pages-with-rake/

desc "Deploy _site/ to gh-pages branch"
task :deploy do
  puts "\n## Deleting gh-pages branch"
  status = system("git branch -D gh-pages")
  puts status ? "Success" : "Failed"
  puts "\n## Creating new gh-pages branch and switching to it"
  status = system("git checkout -b gh-pages")
  puts status ? "Success" : "Failed"
  puts "\n## Forcing the _site subdirectory to be project root"
  status = system("git filter-branch --subdirectory-filter _site/ -f")
  puts status ? "Success" : "Failed"
  puts "\n## Switching back to master branch"
  status = system("git checkout master")
  puts status ? "Success" : "Failed"
  puts "\n## Pushing all branches to origin"
  status = system("git push --all origin")
  puts status ? "Success" : "Failed"
end