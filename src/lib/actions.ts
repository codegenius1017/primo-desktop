import {get} from 'svelte/store'
import axios from 'axios'
import config from '../stores/config'

export const cloudSites = {
  save: async (site) => {
    const {serverConfig} = get(config)
    let successful = false
    try {
      const res = await axios.post(`${serverConfig.url}/api/${site.id}`, { 
        site,
        token: serverConfig.token
      }, {
        headers: {
          Authorization: `Basic ${serverConfig.token}`,
        },
      })
      if (res.data === 'ok') {
        successful = true
      }
    } catch(e) {
      console.warn(e)
    }
    return successful
  }
}