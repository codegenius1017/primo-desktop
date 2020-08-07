var registerPromiseWorker = require('promise-worker/register');
const {processPostCSS} = require('primo-functions').default

registerPromiseWorker(async function ({html, css, options, onsuccess}) {
  const response = await processPostCSS(css, html, options, onsuccess) 
  return response;
});