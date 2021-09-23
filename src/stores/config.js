import { writable } from 'svelte/store';

const { config } = window.primo

const store = writable({
  saveDir: window.primo.config.getSavedDirectory(),
  hosts: window.primo.config.getHosts(),
  serverConfig: window.primo.config.getServerConfig(),
})

store.subscribe((c) => {
  config.setHosts(c.hosts)
  config.setServerConfig(c.serverConfig)
})

export default store