import {get, writable} from 'svelte/store'
import { browser } from '$app/env'

const site = {
  id: '',
  data: {},
  deployments: []
}

const store = writable([]);

if (browser) {
  const {data} = window.primo
  store.set(data.load() || [])
  store.subscribe(s => {
    data.save(s) 
  })
}


export default {
  update: store.update,
  set: store.set,
  subscribe: store.subscribe
}