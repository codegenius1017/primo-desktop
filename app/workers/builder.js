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
    createFile(page, 'html')
    createFile(page, 'css')
    createFile(page, 'json', JSON.stringify(page))
  })

  function createFile(page, fileType, value = null) {
    fs.writeFile(`${buildDir}/${page.id}.${fileType}`, value || page[fileType], (err) => {
      err && alert("An error ocurred creating the file "+ err.message)
    });
  }
});
