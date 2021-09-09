import * as idb from 'idb-keyval';
import _ from 'lodash'
import {get} from 'svelte/store'
import PromiseWorker from 'promise-worker';
import svelteWorker from './workers/worker?worker'
// import {downloadSiteImage} from '../supabase/storage' 
// import {convertBlobToBase64} from '../utils'
import {site} from '@primo-app/primo/src/stores/data/draft'
import activePage from '@primo-app/primo/src/stores/app/activePage'

// const postCSSWorker = new Worker('/processors/postcss.worker.js');
// const cssPromiseWorker = new PromiseWorker(postCSSWorker);

// const handlebarsWorker = new Worker('/processors/handlebars.worker.js');
// const htmlPromiseWorker = new PromiseWorker(handlebarsWorker);

const SvelteWorker = new svelteWorker()
const htmlPromiseWorker = new PromiseWorker(SvelteWorker);

// Clear out storage to avoid mucking it up
// idb.clear()

export async function html({ code, data, buildStatic = true, format = 'esm'}) {

  const finalData = _.cloneDeep(data)

  let finalRequest = buildFinalRequest(finalData)

  const cached = await idb.get(JSON.stringify(finalRequest))
  if (cached) {
    return cached
  }

  // const newData = await replaceImagesWithBase64(data)
  const newData = data

  finalRequest = buildFinalRequest(newData)

  let res
  try {
    res = await htmlPromiseWorker.postMessage(finalRequest)
  } catch(e) {
    console.log('error', e)
    res = {
      error: e.toString()
    }
  }

  let final 

  if (res.error) {
    console.log({res})
    final = {
      error: escapeHtml(res.error)
    }
    function escapeHtml(unsafe) {
      return unsafe
           .replace(/&/g, "&amp;")
           .replace(/</g, "&lt;")
           .replace(/>/g, "&gt;")
           .replace(/"/g, "&quot;")
           .replace(/'/g, "&#039;");
    }
  } else if (buildStatic) {   
    const blob = new Blob([res.ssr], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);

    const {default:App} = await import(url/* @vite-ignore */)
    const rendered = App.render()
    final = {
      html: rendered.html || rendered.head,
      css: rendered.css.code,
      js: res.dom
    }
    // console.log({final})
  } else {
    final = {
      js: res.dom
    }
  } 

  await idb.set(JSON.stringify(finalRequest), final)
  return final

  function buildFinalRequest(finalData) {

    // export const primo = ${JSON.stringify(finalData)}

    const dataAsVariables = `\
    ${Object.entries(finalData)
      .filter(field => field[0])
      .map(field => `export let ${field[0]} = ${JSON.stringify(field[1])};`)
      .join(` \n`)
    }
   `

    const finalCode = `${code.html}
      ${ code.css 
        ? `<style>${code.css}</style>`
        : ``
      }
      ${ code.js || (!code.js && !code.html.includes('<script>'))
        ? `<script>${dataAsVariables}${code.js || ''}</script>`
        : ``
      }
    `
  
    const hydrated = !!code.js && buildStatic
  
    return {
      code: finalCode,
      hydrated,
      buildStatic,
      format
    }
  }

  async function replaceImagesWithBase64(data) {
    // Modify final request by replacing all img url's beginning with 'primo:' - 
    // Download file from supabase, then convert to Base64 and replace url value
    // let finalRequest = buildFinalRequest()
    const modifiedData = _.cloneDeep(data)
    await Promise.all(
      Object.entries(data).map(async field => {
        const [ key, val ] = field
        if (val.url && val.url.startsWith('primo:')) { // Image type
          const b64 = await fetchAndConvert(val.url)
          modifiedData[key] = {
            ...modifiedData[key],
            url: b64,
            src: b64
          }
        } else if (typeof val === 'object' && !Array.isArray(val) && key !== 'page' && key !== 'site') { // Group type
          await Promise.all(
            Object.entries(val).map(async subfield => {
              const [ subfieldKey, subfieldVal ] = subfield
              if (subfieldVal && subfieldVal.url && subfieldVal.url.startsWith('primo:')) { // Image type
                const b64 = await fetchAndConvert(subfieldVal.url)
                modifiedData[key] = {
                  ...modifiedData[key],
                  [subfieldKey]: {
                    ...subfieldVal,
                    url: b64,
                    src: b64
                  }
                }
              }
            })
          )
        } else if (Array.isArray(val)) { // Repeater type
          let newRepeaters = []
          await Promise.all(
            val.map(async subfield => {
              await Promise.all(
                Object.entries(subfield).map(async repeaterItem => {
                  const [ repeaterKey, repeaterVal ] = repeaterItem
                  if (repeaterVal.url && repeaterVal.url.startsWith('primo:')) { // Image type
                    const b64 = await fetchAndConvert(repeaterVal.url)
                    subfield = {
                      ...subfield,
                      [repeaterKey]: {
                        ...repeaterVal,
                        url: b64,
                        src: b64
                      }
                    }
                  }
                })
              )
              newRepeaters = [
                ...newRepeaters,
                subfield
              ]
            })
          )
          modifiedData[key] = newRepeaters
        }
      })
    )
    return modifiedData
  }

  async function fetchAndConvert(url) {
    // const imageKey = url.slice(12) // remove primo:sites/
    // const cached = await idb.get(imageKey)
    // if (cached) return cached
    // const blob = await downloadSiteImage(imageKey)
    // if (blob) {
    //   const b64 = await convertBlobToBase64(blob)
    //   await idb.set(imageKey, b64)
    //   return b64
    // } else {
    //   return ''
    // }
  }

}


export async function css(raw, options = {}) {
  return raw
}