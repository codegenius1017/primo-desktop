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
  import activeSite from '../../stores/activeSite'
  import Build from '../../extensions/Build.svelte'
  import ImageField from '../../extensions/FieldTypes/ImageField.svelte'
  import { page } from '$app/stores'
  // import { find } from 'lodash'
  // import { signOut } from '../supabase/auth'
  // import { sites } from '../supabase/db'
  // import {
  //   uploadSiteData,
  //   downloadSiteData,
  //   updateSiteData,
  //   updatePagePreview,
  // } from '../supabase/storage'
  // import supabase from '../supabase/core'
  // import {
  //   hosts,
  //   user,
  //   activeSite,
  //   currentSite,
  //   repo,
  //   modal,
  //   tokens,
  // } from '../stores'
  // import { path } from '../stores/misc'
  // import {
  //   convertHandlebarsToSvelte,
  //   convertWrapperToHTML,
  //   convertStylesToCSS,
  //   underscoreFields,
  // } from '../utils'

  // import { router } from 'tinro'
  // import { buildStaticPage } from '@primo-app/primo/src/stores/helpers'
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

  // if (!$user.signedIn) {
  //   modal.show('AUTH', {
  //     onSignIn: () => {
  //       modal.hide()
  //       fetchSite($router.path)
  //     },
  //   })
  // }

  // $activeSite = createNewSite({ name: 'Default Site' })
  // $: $user.signedIn && fetchSite($router.path)

  let currentPath
  async function fetchSite(fullPath) {
    // if (currentPath === fullPath) return
    // currentPath = fullPath
    // if (fullPath.includes('dashboard') || fullPath.includes($currentSite))
    //   return
    // const [username, siteID] = fullPath.slice(1).split('/')
    // $path = `${username}/${siteID}`
    // const res = await sites.get({ path: $path })
    // if (res) {
    //   const { id, owner, repo: repository, data, collaborator_data } = res
    //   const storageRes = await downloadSiteData({ owner: owner.id, id })
    //   saveFile = { owner: owner.id, id }
    //   let site
    //   if (storageRes.data) {
    //     const json = await storageRes.data.text()
    //     site = JSON.parse(json)
    //   } else {
    //     site = data
    //   }
    //   if (!site.version) {
    //     // Update data for 1.3
    //     site = convertHandlebarsToSvelte(site)
    //     site = convertWrapperToHTML(site)
    //     site = convertStylesToCSS(site)
    //     site = underscoreFields(site)
    //   }
    //   console.log({ site })
    //   $activeSite = site || createNewSite({ name: site.name })
    //   $tokens = res.owner.tokens
    //   $hosts = res.hosts
    //   $repo = repository
    //   $currentSite = id
    //   stores.$unsaved = false
    //   // set collaborator role
    //   if (owner.id !== $user.uid) {
    //     const collaborator = find(collaborator_data, ['uid', $user.uid])
    //     role = collaborator.role === 'DEV' ? 'developer' : 'content'
    //   }
    // }
  }

  async function saveData(updatedSite) {
    console.log({ siteID, updatedSite })
    $sites = $sites.map((site) => {
      if (site.id !== siteID) return site
      return updatedSite
    })

    // window.updateDatabase(data)
    // saving = true
    // const includePrimoVersion = {
    //   ...data,
    //   version: 1.3,
    // }
    // await transferSiteToStorage({
    //   owner: saveFile.owner,
    //   id: saveFile.id,
    //   data: includePrimoVersion,
    // })
    // saving = false
    // const homepage = data.pages.filter((p) => p.id === 'index')[0]
    // const preview = await buildStaticPage({ page: homepage, site: data })
    // await updatePagePreview({
    //   path: `${saveFile.owner}/${saveFile.id}/preview.html`,
    //   preview,
    // })
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

  // let libraries = []
  // downloadSiteData({
  //   owner: '7ff42f0c-6a06-4ff4-b23e-695e11075350',
  //   id: 'bffe679e-5c85-4f0e-ad05-e5c578dad379',
  // }).then(async (res) => {
  //   const json = await res.data.text()
  //   const data = JSON.parse(json)
  //   libraries = [
  //     {
  //       label: 'Public Library',
  //       icon: 'users',
  //       components: data.symbols,
  //     },
  //   ]
  // })

  let mounted = false
  onMount(() => (mounted = true))

  $: siteID = $page.params.site
  $: data = $activeSite || createNewSite({ id: 'test', name: 'Test' })
  $: mounted && setActiveSite(siteID)
  async function setActiveSite(siteID) {
    // necessary for rollup to load (?)
    setTimeout(() => {
      const site = find($sites, ['id', siteID])
      if (site) {
        $activeSite = site
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
