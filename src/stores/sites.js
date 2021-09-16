import {get, writable} from 'svelte/store'
import {isEqual} from 'lodash-es'

const {data} = window.primo

const site = {
  id: '',
  data: {},
  deployments: []
}

const store = writable([]);

store.set(data.load() || [])

store.subscribe(s => {
  data.save(s)
})

export default {
  update: store.update,
  set: store.set,
  subscribe: store.subscribe
}