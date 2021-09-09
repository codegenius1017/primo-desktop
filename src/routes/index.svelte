<script context="module">
  export const ssr = false;
</script>

<script>
  import Primo, {
    modal as primoModal,
    createNewSite,
    site,
    savedSite,
    stores,
    registerProcessors,
  } from "@primo-app/primo";
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
  import { html, css } from "../compiler/processors";

  registerProcessors({ html, css });

  let role = "developer";

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

  let currentPath;
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

  let saveFile = {};
  async function saveData(data) {
    localStorage.setItem("data", JSON.stringify(data));
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

  async function transferSiteToStorage(args) {
    // const { data } = await updateSiteData(args)
    // if (!data) {
    //   const uploaded = await uploadSiteData(args)
    //   if (!uploaded.data) return false
    // }
    // return true
  }

  let saving = false;

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

  const data =
    JSON.parse(localStorage.getItem("data")) ||
    createNewSite({ id: "test", name: "Test" });
  console.log({ data });
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

<style global lang="postcss">
  :global(:root) {
    --primo-color-primored: rgb(248, 68, 73);
    --primo-color-primored-dark: rgb(186, 37, 42);
    --primo-color-white: white;
    --primo-color-codeblack: rgb(30, 30, 30);
    --primo-color-codeblack-opaque: rgba(30, 30, 30, 0.9);

    --primo-color-black: rgb(17, 17, 17);
    --primo-color-black-opaque: rgba(17, 17, 17, 0.9);

    --color-gray-1: rgb(245, 245, 245);
    --color-gray-2: rgb(229, 229, 229);
    --color-gray-3: rgb(212, 212, 212);
    --color-gray-4: rgb(156, 163, 175);
    --color-gray-5: rgb(115, 115, 115);
    --color-gray-6: rgb(82, 82, 82);
    --color-gray-7: rgb(64, 64, 64);
    --color-gray-8: rgb(38, 38, 38);
    --color-gray-9: rgb(23, 23, 23);

    --font-size-1: 0.75rem;
    --font-size-2: 0.875rem;
    --font-size-3: 1.125rem;
    --font-size-4: 1.25rem;

    box-shadow: 0 0 #0000 0 0 #0000, 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    --box-shadow-xl: 0 0 #0000, 0 0 #0000, 0 20px 25px -5px rgba(0, 0, 0, 0.1),
      0 10px 10px -5px rgba(0, 0, 0, 0.04);

    --transition-colors: background-color 0.1s, border-color 0.1s, color 0.1s,
      fill 0.1s, stroke 0.1s;

    --padding-container: 15px;
    --max-width-container: 1900px;

    --ring: 0px 0px 0px 2px var(--primo-color-primored);
  }
  .primo-reset {
    @tailwind base;
    font-family: "Satoshi", sans-serif !important;

    button,
    button * {
      cursor: pointer;
    }
  }

  #primo-toolbar {
    left: 75px;
  }

  body {
    margin: 0;
  }
</style>
