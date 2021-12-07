import { writable } from 'svelte/store'
import { browser } from '$app/env'
import { get, set } from 'idb-keyval'
import _find from 'lodash/find'

const store = writable([])

if (browser) initializSiteData()

async function initializSiteData() {
  const { data } = window.primo // preload.cjs
  const sites = data.load()
  const sitesDB = await get('sites')

  const rebuiltSites = sites.map((site) => {
    const savedSite = _find(sitesDB, (site) => site.data.id === site.id)
    return {
      id: site.id,
      name: site.name,
      deployments: savedSite ? savedSite.deployments : [],
      activeDeployment: savedSite ? savedSite.activeDeployment : null,
      data: site,
    }
  })

  store.set(rebuiltSites)

  store.subscribe((s) => {
    const sitesData = s.map((site) => ({
      ...site.data,
    }))
    data.save(sitesData)

    set('sites', s)
  })
}

export default {
  update: store.update,
  set: store.set,
  subscribe: store.subscribe,
}
