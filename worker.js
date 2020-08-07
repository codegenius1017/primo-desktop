var registerPromiseWorker = require('promise-worker/register');

registerPromiseWorker(async function ({html, css, options, onsuccess}) {
  const {processPostCSS} = require('primo-functions').default
  const response = await processPostCSS(css, html, options, onsuccess) 
  return response;
});