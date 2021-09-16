import { writable } from 'svelte/store';
import {get, set} from 'idb-keyval'

const hosts = writable([])

get('hosts').then(res => {
  hosts.set(res || [])
})

hosts.subscribe((h) => {
  set('hosts', h)
})

export default hosts