<script context="module">
  export const ssr = false
</script>

<script>
  import { onMount, tick } from 'svelte'
  import Primo, {
    modal as primoModal,
    createNewSite,
    site,
    savedSite,
    stores,
    registerProcessors,
    PrimoFieldTypes,
    fieldTypes,
    modal,
  } from '@primo-app/primo'
  import { find } from 'lodash-es'
  import sites from '../../stores/sites'
  import cloudSites from '../../stores/cloudSites'
  import activeSite from '../../stores/activeSite'
  import Build from '../../extensions/Build.svelte'
  import ImageField from '../../extensions/FieldTypes/ImageField.svelte'
  import { page } from '$app/stores'
  import * as actions from '$lib/actions'

  import { html, css } from '../../compiler/processors'

  registerProcessors({ html, css })

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
    } else {
      await actions.cloudSites.save(updatedSite)
    }

    saving = false
  }

  fieldTypes.register([
    {
      id: 'image',
      label: 'Image',
      component: ImageField,
    },
    ...PrimoFieldTypes,
  ])

  let saving = false

  let mounted = false
  onMount(() => (mounted = true))

  $: siteID = $page.params.site
  $: data = $activeSite || createNewSite({ id: 'test', name: 'Test' })
  $: mounted && setActiveSite(siteID, [...$sites, ...$cloudSites])
  async function setActiveSite(siteID, sites) {
    // necessary for rollup to load (?)
    setTimeout(() => {
      const site = find(sites, ['id', siteID])
      console.log({ site })
      if (site) {
        $activeSite = site.data || site
      }
    }, 100)
  }
</script>

<svelte:head>
  <link
    href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@300;400;500;600&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<Primo
  {data}
  {role}
  {saving}
  on:save={async ({ detail: data }) => saveData(data)}
/>

<span>
  {$page.path}
</span>

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
