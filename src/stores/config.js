import { writable, get } from 'svelte/store';
import {get as getIDB, set as setIDB} from 'idb-keyval'

let defaultSaveDirectory = window.primo.config.getSavedDirectory()

const config = writable({
  saveDir: defaultSaveDirectory
})

getIDB('config').then(res => {
  console.log({res})
  config.set({
    ...res,
    saveDir: res.saveDir || defaultSaveDirectory
  })
})

config.subscribe((c) => {
  setIDB('config', c)
})

export default config