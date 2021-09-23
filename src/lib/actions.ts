import {get} from 'svelte/store'
import axios from 'axios'
import config from '../stores/config'

export const cloudSites = {
  save: async (site) => {
    const {serverConfig} = get(config)
    const res = await axios.post(`${serverConfig.url}/api/${site.id}.json?token=${serverConfig.token}`, { site })
    console.log({res})
  }
}