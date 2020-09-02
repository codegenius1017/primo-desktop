const PromiseWorker = nw.require('promise-worker');
function createWorker(dir) {
  const worker = new Worker(dir);
  return new PromiseWorker(worker);
}

const postcssWorker = createWorker('workers/postcss.js')
const tailwindWorker = createWorker('workers/tailwind.js')
async function processPostCSS(payload) {
  let response
  const { css, html, options, onsuccess } = payload
  if (options.includeTailwind) {
    response = await tailwindWorker.postMessage(payload)
  } else {
    response = await postcssWorker.postMessage(payload)
  }
  return response
}

const builderWorker = createWorker('workers/builder.js')
async function buildSite(pages, site) {
  builderWorker.postMessage({ pages, site })
  return 
}

const defaultData = {
  "id": "00000",
  "pages": [
    {
      "id": "index",
      "title": "Home Page",
      "content": [
        {
          "id": "0qodx",
          "width": "contained",
          "columns": [
            {
              "id": "00000",
              "size": "w-full",
              "rows": [
                {
                  "id": "00000",
                  "type": "content",
                  "value": {
                    "html": "<p><br></p>"
                  }
                }
              ]
            }
          ]
        }
      ],
      "dependencies": {
        "headEmbed": "",
        "libraries": []
      },
      "styles": {
        "raw": "",
        "final": "",
        "tailwind": "{  \ntheme: {\n    container: {\n      center: true\n    }\n  },\n  variants: {}\n}"
      },
      "wrapper": {
        "head" : {
          "raw": "",
          "final": ""
        },
        "below": {
          "raw": "",
          "final" : ""
        }
      },
      "fields": [],
      "settings": {
        "javascript": "",
        "identity": {
          "title": "",
          "url": "",
          "description": ""
        }
      }
    }
  ],
  "fields": [],
  "styles": {
    "raw": "/* Default content styles */\n.primo-content {\n  @apply text-lg;\n  h1 {\n    @apply text-3xl font-medium;\n  }\n  h2 {\n    @apply text-2xl font-medium;\n  }\n  ul {\n    @apply list-disc list-inside;\n    p {\n        @apply inline;\n    }\n  } \n  ol {\n    @apply list-decimal list-inside;\n  } \n  a {\n    @apply text-blue-600 underline;\n  }\n  blockquote {\n      @apply shadow-md p-6;\n  }\n  mark {\n    @apply text-gray-900 bg-yellow-200;\n  }\n  \n  @screen lg {\n    h1 {\n      @apply text-5xl;\n    }\n    h2 {\n      @apply text-4xl;\n    }\n  }\n}",
    "final": "",
    "tailwind": "{\n  theme: {\n    container: {\n      center: true\n    }\n  },\n  variants: {}\n}"
  },
  "wrapper": {
    "head": {
      "raw": "",
      "final": ""
    },
    "below": {
      "raw": "",
      "final": ""
    }
  },
  "symbols": []
}

const low = nw.require('lowdb')
const FileSync = nw.require('lowdb/adapters/FileSync')
const fs = nw.require('fs')
const dataPath = nw.App.getDataPath()
const buildDir = dataPath + `/db-v01.json`
const adapter = new FileSync(buildDir)
const db = low(adapter)
db.defaults({ sites: [defaultData] })
.write()

function parseDataFile(filePath) {
  let existingData = db.get('sites').value()
  if (existingData) {
    console.log('returning existing value', existingData)
    return existingData
  } else {
    fs.writeFile(filePath, JSON.stringify(defaultData), (err) => {
      err && alert("An error ocurred creating the file "+ err.message)
    });
    return defaultData
  }
}

let siteData = parseDataFile(buildDir)

async function updateDatabase(data) {
  const newSites = siteData.map(s => s.id === data.id ? data : s)
  db.set('sites', newSites).write()
}

