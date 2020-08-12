const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path')
const fs = require('fs')
const Store = require('./store.js');

// NEXT: diagnose lag when saving or building
// NEXT: Test whole app by building site with Tailwind UI to make launch video

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

const jsonDatabase = new Store({
  configName: 'site-data',
  defaults: {
    site: {
      "pages": [
        {
          "id": "index",
          "title": "primo Page",
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
                        "html": ""
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
            "tailwind": "{  theme: {    container: {      center: true    }  },  variants: {}}"
          },
          "wrapper": {
            "raw": {
              "head": "",
              "above": "",
              "below": ""
            },
            "final": {
              "head": "",
              "above": "",
              "below": ""
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
        "raw": {
          "head": "",
          "above": "",
          "below": ""
        },
        "final": {
          "head": "",
          "above": "",
          "below": ""
        }
      },
      "symbols": [
      ]
    }
  }
});

ipcMain.on('getStoreValue', (event, key) => {
  event.reply('asynchronous-reply', jsonDatabase.get('site'))
  global.siteData = jsonDatabase.get('site')
})

ipcMain.on('setStoreValue', (event, arg) => {
	jsonDatabase.set('site', arg)
})

const siteData = jsonDatabase.get('site')

global.siteData = siteData

async function buildSite(pages, site) {

  const siteStyles = site.styles.raw

  const desktop = app.getPath('desktop')
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
}

ipcMain.on('build-site', async (event, args) => {
  // console.log(args)
  buildSite(args.pages, args.site)
})

function createWindow() {
    const mode = process.env.NODE_ENV;
    mainWindow = new BrowserWindow({
        width: 900,
        height: 680,
        titleBarStyle: 'hidden',
        backgroundColor: '#2e2c29',
        webPreferences: {
          nodeIntegration: true,
          nodeIntegrationInWorker: true
        }
    });


    let watcher;
    if (process.env.NODE_ENV === 'development') {
        watcher = require('chokidar').watch(path.join(__dirname, '../public/build'), { ignoreInitial: true });
        watcher.on('change', () => {
            mainWindow.reload();
        });
    }

    mainWindow.loadURL(`file://${path.join(__dirname, '../public/index.html')}`);
    mainWindow.on('closed', () => {
        if (watcher) {
            watcher.close();
        }
        mainWindow = null;
    });

    // Open the DevTools.
    mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow();
    }
});
