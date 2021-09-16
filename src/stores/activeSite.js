import {find} from 'lodash-es'
import {writable, get} from 'svelte/store'
import sites from './sites'
// import {page} from '$app/stores'

// page.subscribe(p => {
//   const id = p.params.site
//   console.log({id})
//   const activeSite = find(get(sites), ['id', id])
//   console.log({activeSite})
//   store.set(activeSite)
// })

const site = {
  name: '',
  data: null,
  deployments: []
}

// const activeSite = find(get(sites), ['name', get(page).params.site])
// console.log({activeSite})
const store = writable(site);

store.subscribe((site) => {
  console.log({site})
  // sites.update(s => {
  //   const updated = find(get(sites), ['id', id])
  // }
})

export default {
  update: store.update,
  set: store.set,
  subscribe: store.subscribe
}