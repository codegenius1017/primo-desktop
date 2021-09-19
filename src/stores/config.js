import { writable } from 'svelte/store';

const { config } = window.primo

const store = writable({
  saveDir: window.primo.config.getSavedDirectory(),
  hosts: window.primo.config.getHosts()
})

store.subscribe((c) => {
  config.setHosts(c.hosts)
})

export default store