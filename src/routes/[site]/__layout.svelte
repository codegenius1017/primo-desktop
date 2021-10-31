<script context="module">
  export const ssr = false
</script>

<script>
  import { onMount } from 'svelte'
  import { get } from 'svelte/store'
  import Primo, {
    modal as primoModal,
    createNewSite,
    fieldTypes,
    modal,
    stores,
  } from '@primo-app/primo'
  import { find } from 'lodash-es'
  import sites from '../../stores/sites'
  import cloudSites from '../../stores/cloudSites'
  import activeSite from '../../stores/activeSite'
  import Build from '../../extensions/Build.svelte'
  import { page } from '$app/stores'
  import * as actions from '$lib/actions'

  primoModal.register([
    {
      id: 'BUILD',
      component: Build,
      componentProps: {
        siteName: 'Website', // TODO - change
      },
      options: {
        route: 'build',
        width: 'md',
        header: {
          title: 'Build to Github',
          icon: 'fab fa-github',
        },
      },
    },
  ])

  let role = 'developer'

  async function saveData(updatedSite) {
    saving = true

    if (find($sites, ['id', siteID])) {
      $sites = $sites.map((site) => {
        if (site.id !== siteID) return site
        return updatedSite
      })
      stores.saved.set(true)
    } else {
      const success = await actions.cloudSites.save(updatedSite)
      stores.saved.set(success)
      if (!get(stores.saved)) {
        window.alert('Could not save site. See console for details.')
      }
    }

    saving = false
  }

  let saving = false

  let mounted = false
  onMount(() => (mounted = true))

  $: siteID = $page.params.site
  $: data = $activeSite || createNewSite({ id: 'test', name: 'Test' })
  $: mounted &&
    setActiveSite(siteID, $cloudSites ? [...$sites, ...$cloudSites] : $sites)
  async function setActiveSite(siteID, sites) {
    // necessary for rollup to load (?)
    setTimeout(() => {
      const site = find(sites, ['id', siteID])
      if (site) {
        $activeSite = site.data || site
      }
    }, 100)
  }
</script>

<Primo
  {data}
  {role}
  {saving}
  on:save={async ({ detail: data }) => saveData(data)}
/>

<style global lang="postcss">
  .primo-reset {
    @tailwind base;
    font-family: 'Satoshi', sans-serif !important;

    button,
    button * {
      cursor: pointer;
    }
  }

  body {
    margin: 0;
  }
</style>
