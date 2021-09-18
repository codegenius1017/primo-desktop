import { writable, get } from 'svelte/store';
import {get as getIDB, set as setIDB} from 'idb-keyval'
import { browser } from '$app/env';


const config = writable({
  saveDir: ''
})

if (browser) {
  console.log(window.primo)
  let defaultSaveDirectory = window.primo.config.getSavedDirectory()  

  getIDB('config').then(res => {
    config.set({
      ...res,
      saveDir: res.saveDir || defaultSaveDirectory
    })
  })

  config.subscribe((c) => {
    setIDB('config', c)
  })

}

export default config