var registerPromiseWorker = require('promise-worker/register');
const fs = require('fs')

registerPromiseWorker(async function ({pages, site}) {
  const siteStyles = site.styles.raw

  const desktop = require('os').homedir() + '/Desktop';
  const buildDir = desktop + `/primo-build`

  if (!fs.existsSync(buildDir)){
      fs.mkdirSync(buildDir);
  }

  pages.forEach(page => {
    fs.writeFile(`${buildDir}/${page.id}.html`, page.html, (err) => {
      err && alert("An error ocurred creating the file "+ err.message)
    });
    fs.writeFile(`${buildDir}/${page.id}.css`, page.css, (err) => {
      err && alert("An error ocurred creating the file "+ err.message)
    });
  })
});
