<script>
  import axios from 'axios'
  import { flattenDeep } from 'lodash-es'
  import TimeAgo from 'javascript-time-ago'
  import en from 'javascript-time-ago/locale/en'
  // import JSZip from 'jszip'
  // import { saveAs } from 'file-saver'
  // import { getGithubAuthToken } from '../../supabase/middleware'
  import Hosting from '$lib/components/Hosting.svelte'
  import PrimaryButton from '$lib/ui/PrimaryButton.svelte'
  import Spinner from '$lib/ui/Spinner.svelte'
  import { site, modal, savedSite } from '@primo-app/primo'
  import { buildStaticPage } from '@primo-app/primo/src/stores/helpers'
  import { unsaved } from '@primo-app/primo/src/stores/app/misc'
  // import { saveSite } from '@primo-app/primo/src/stores/actions'
  import Preview from '@primo-app/primo/src/components/misc/Preview.svelte'
  import { makeValidUrl } from '$lib/utils'
  // import { buildSite, createRepo } from '../../Github.svelte'
  import hosts from '../stores/hosts'
  import sites from '../stores/sites'
  // import {
  //   tokens,
  //   hosts,
  //   repo,
  //   activeSite,
  //   currentSite,
  //   user,
  // } from '../../stores'
  // import { path } from '../../stores/misc'
  // import { repos, sites, users } from '../../supabase/db'
  // import confetti from 'canvas-confetti'
  // import Hosting from '$lib/components/Hosting.svelte'
  import ModalHeader from '@primo-app/primo/src/views/modal/ModalHeader.svelte'
  import PageItem from '@primo-app/primo/src/views/modal/PageList/PageItem.svelte'
  // import TimeAgo from 'javascript-time-ago'
  // import en from 'javascript-time-ago/locale/en'
  import { page } from '$app/stores'

  TimeAgo.addDefaultLocale(en)
  const timeAgo = new TimeAgo('en-US')

  async function pushToRepo() {
    feedback = `Pushing site to Github`
    loading = true
    // const success = await buildSiteTree($site, $path)
    // if (success) {
    //   feedback = 'Good to go!'
    //   progress = 100
    //   setTimeout(() => {
    //     modal.hide()
    //   }, 2000)
    // } else {
    //   feedback = 'Something went wrong :('
    // }
  }

  async function buildSiteTree(siteData, siteName) {
    // const files = await buildSiteBundle(siteData, siteName)
    // return await buildSite(
    //   {
    //     site: $path,
    //     files,
    //     message: commitMessage,
    //   },
    //   (ratio) => {
    //     progress = ratio * 100
    //   }
    // ).catch((e) => {
    //   alert(`The site couldn't be saved for some reason. Sorry about that.`)
    //   console.error(e)
    // })
  }

  let repoName = ''
  $: repoName.replace(' ', '-')

  let feedback = ''
  let loading = false
  let progress = 0

  let commitMessage = ''

  // if no repo exists for this site
  // If logged into Github
  // Option to create repository
  // If not logged into Github
  // Sign in w/ Github

  // get repo from db before this
  // let currentMessage = $user.token
  let currentMessage = ''
    ? `Your website will get built out to a Github repository. You can publish it from there.`
    : `Download your website or connect your Github account to save your site to a repository`
  async function startCreatingRepo() {
    loading = true
    // const sitePath = $path.split('/')[1]
    // const repoName = `primo-` + makeValidUrl(sitePath)
    // const repoData = await createRepo({ name: repoName })
    // loading = false
    // if (repoData) {
    //   const { html_url, owner, name, private: isPrivate } = repoData
    //   // save repo to db
    //   const repoRow = await repos.create({
    //     owner: owner.login,
    //     name,
    //     url: html_url,
    //     isPublic: !isPrivate,
    //   })
    //   // // attach new repo row to website
    //   sites.update($currentSite, {
    //     repo: repoRow.id,
    //   })
    //   $repo = repoRow
    //   commitMessage = `Repository created at ${$repo.url}, building and pushing site`
    //   pushToRepo()
    //   // Change screen to 'Your website has been built to {url}, this is where changes will be built to in the future'
    // } else {
    //   alert(
    //     `Could not create a repository. Ensure you don't already have a repo named ${repoName}`
    //   )
    // }
  }

  async function downloadSite() {
    loading = true
    // const zip = new JSZip()
    // const files = await buildSiteBundle($site, $path)
    // files.forEach((file) => {
    //   zip.file(
    //     file.path,
    //     typeof file.content === 'string'
    //       ? file.content
    //       : 'h1 { font-size: 4rem; }'
    //   )
    // })
    // const toDownload = await zip.generateAsync({ type: 'blob' })
    // saveAs(toDownload, `${$path}.zip`)
    // modal.hide()
  }

  // $: if ($router.query.code) connectRepo($router.query.code)
  // async function connectRepo(code = null) {
  //   if ($unsaved) {
  //     window.alert('Please save your site before continuing')
  //     return
  //   }

  //   const client_id = '39b8a7b215c8e8add020'

  //   //
  //   if ($user.token) {
  //   } else if (!code) {
  //     window.location.href = `https://github.com/login/oauth/authorize?client_id=${client_id}&scope=public_repo&redirect_uri=${window.location.href}`
  //   } else {
  //     const authtoken = await getGithubAuthToken(code)

  //     users.update($user.uid, {
  //       tokens: {
  //         github: authtoken,
  //       },
  //     })

  //     user.update((u) => ({
  //       ...u,
  //       token: authtoken,
  //     }))

  //     const foo = await axios.get('https://api.github.com/user', {
  //       headers: {
  //         Authorization: 'token ' + authtoken,
  //       },
  //     })
  //   }

  //   // Show Github account info
  // }

  // let token = $tokens.vercel || ''

  // 1. Connect repository
  // 2. Connect hosting (deploy with repository)

  let deployments = []
  let gettingDeployments = true
  // async function getDeployments() {
  //   gettingDeployments = true
  //   axios
  //     .get('https://api.vercel.com/v5/now/deployments', {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     })
  //     .then(async ({ data }) => {
  //       deployments = data.deployments.slice(0, 5)
  //     })
  //     .catch((e) => {
  //       console.error(e)
  //     })
  //   setTimeout(() => {
  //     gettingDeployments = false
  //   }, 1000)
  // }
  // getDeployments()

  let deployment
  async function publishToHosts() {
    loading = true

    const siteID = $page.params.site

    // const name = window.location.pathname.split('/')[2]
    const files = (await buildSiteBundle($site, siteID)).map((file) => ({
      file: file.path,
      data: file.content,
    }))

    await Promise.allSettled(
      $hosts.map(async ({ token, type }) => {
        if (type === 'vercel') {
          const { data } = await axios
            .post(
              'https://api.vercel.com/v12/now/deployments',
              {
                name: siteID,
                files,
                projectSettings: {
                  framework: null,
                },
                target: 'production',
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            )
            .catch((e) => ({ data: null }))

          deployment = data
        } else if (type === 'github') {
          // TODO
          // if no host exists, attempt to publish to new repo
          // is host exists, push to repo
          // enable connecting to existing repo
        }
      })
    )

    loading = false

    // $hosts = updatedHosts
    // sites.update($currentSite, {
    //   hosts: updatedHosts,
    // })
    // loading = false

    // async function publishToHost({
    //   key,
    //   endpoint,
    //   args,
    //   error = null,
    //   token,
    //   onSuccess = (data) => data,
    // }) {
    //   const res = await axios
    //     .post(endpoint, args, {
    //       headers: {
    //         Authorization: `Bearer ${token}`,
    //       },
    //     })
    //     .catch((e) => {
    //       console.error(e)
    //     })
    //   if (!res) {
    //     connectingHost = true
    //     errorMessage = error
    //     return null
    //   } else if (res.data) {
    //     confetti({
    //       particleCount: 50,
    //       startVelocity: 30,
    //       spread: 180,
    //       origin: {
    //         x: 1,
    //         y: 0,
    //       },
    //       zIndex: 99999,
    //     })
    //     return {
    //       ...onSuccess(res.data),
    //     }
    //     // published = true
    //     // domainName.set(res.data.alias[0])
    //     // const { alias, createdAt } = res.data
    //     // const updatedHost = {
    //     //   ...$hosts,
    //     //   vercel: {
    //     //     ...$hosts?.vercel,
    //     //     deployment: {
    //     //       domain: alias[0],
    //     //       createdAt,
    //     //     },
    //     //   },
    //     // }
    //     // $hosts = updatedHost
    //     // sites.update($currentSite, {
    //     //   hosts: updatedHost,
    //     // })
    //     // loading = false
    //   }
    // }

    async function buildSiteBundle(site, siteName) {
      const primoPage = `
        <!doctype html>
        <html lang="en">
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>

          <body class="primo-page">   
            <iframe allow="clipboard-read; clipboard-write self https://its.primo.af" border="0" src="https://its.primo.af/${siteName}" style="height:100vh;width:100vw;position:absolute;top:0;left:0;border:0;"></iframe>
          </body>
        </html>
      `

      const pages = await Promise.all([
        ...site.pages.map((page) => buildPageTree({ page, site })),
        // [
        //   {
        //     path: `primo/index.html`,
        //     content: primoPage,
        //   },
        //   // {
        //   //   path: 'robots.txt',
        //   //   content: `
        //   //   # Example 3: Block all but AdsBot crawlers
        //   //   User-agent: *
        //   //   Disallow: /`
        //   // },
        // ],
      ])

      return buildSiteTree(pages, site)

      async function buildPageTree({ page, site, isChild = false }) {
        const { id } = page
        const { html, modules } = await buildStaticPage({
          page,
          site,
          separateModules: true,
        })
        // const formattedHTML = await formatCode(html, 'html')
        const formattedHTML = html

        return await Promise.all([
          {
            path: `${id === 'index' ? `index.html` : `${id}/index.html`}`,
            content: formattedHTML,
          },
          ...modules.map((module) => ({
            path: `${module.symbol}.js`,
            content: module.content,
          })),
          ...(page.pages
            ? page.pages.map((subpage) =>
                buildPageTree({ page: subpage, site, isChild: true })
              )
            : []),
        ])
      }

      async function buildSiteTree(pages, site) {
        const json = JSON.stringify(site)

        return [
          ...flattenDeep(pages),
          // {
          //   path: `styles.css`,
          //   content: styles
          // },
          // {
          //   path: `primo.json`,
          //   content: json,
          // },
          // {
          //   path: 'README.md',
          //   content: `# Built with [primo](https://primo.af)`,
          // },
        ]

        function getSiteHTML(site) {
          const symbolHTML = site.symbols
            .map((symbol) => symbol.value.html)
            .join(' ')
          const componentHTML = flattenDeep(
            site.pages.map((page) =>
              page.content
                .filter(
                  (block) => block.type === 'component' && !block.symbolID
                )
                .map((block) => block.value.html)
            )
          ).join(' ')
          return symbolHTML + componentHTML
        }
      }
    }

    pages = []
  }

  let published = false
  let connectingHost = false
  let errorMessage = null

  let pages = []
  async function detectDifferences() {
    // pull in original site and draft
    // const [oldVersions, newVersions] = [
    //   await Promise.all(
    //     $activeSite.pages.map(async (page) => {
    //       // console.log({ page, $activeSite })
    //       const html = await buildStaticPage({ page, site: $activeSite })
    //       return {
    //         id: page.id,
    //         html,
    //         data: page,
    //       }
    //     })
    //   ),
    //   await Promise.all(
    //     $site.pages.map(async (page) => {
    //       const html = await buildStaticPage({ page, site: $site })
    //       return {
    //         id: page.id,
    //         html,
    //         data: page,
    //       }
    //     })
    //   ),
    // ]
    // const deletedPages = oldVersions
    //   .map((oldVersion) => {
    //     const newVersion = _.find(newVersions, ['id', oldVersion.id])
    //     if (!newVersion) {
    //       return [oldVersion, null]
    //     }
    //   })
    //   .filter(Boolean)
    // const updatedPages = newVersions
    //   .map((newVersion) => {
    //     const oldVersion = _.find(oldVersions, ['id', newVersion.id])
    //     if (!oldVersion || !_.isEqual(oldVersion, newVersion)) {
    //       return [oldVersion, newVersion]
    //     }
    //   })
    //   .filter(Boolean)
    // pages = [...deletedPages, ...updatedPages]
    // include pages that are not the same as their original source
  }
  detectDifferences()

  // save site depolyment in supa
  // show recent deployments only from project
  // save site before publish
  // get latest deployments from vercel *
  // if connected to host but not published, publish immediately
  // if connected to host, show Review and Change *
  // otherwise, show options of connected hosts
  // if none exists, show prompt to connect new host
  // once published
</script>

<ModalHeader icon="fas fa-globe" title="Publish" variants="mb-4" />

<main>
  <div class="publish">
    <div>
      <Hosting />
      <!-- <div class="boxes">
        {#each $activeSite.deployments as deployment}
          <div class="box">
            <a class="title" href="https://{$hosts.vercel.url}" target="blank">
              <span>{$hosts.vercel.url}</span>
              <i class="fas fa-external-link-square-alt" /></a
            >
            <span>
              Last published {timeAgo.format($hosts.vercel.createdAt)}
            </span>
            <a
              target="blank"
              class="footer-link"
              href="https://vercel.com/{$hosts.vercel.creator.username}/{$hosts
                .vercel.name}/settings/domains">Connect Custom Domain</a
            >
          </div>
        {/each}
      </div> -->
    </div>
    <div>
      <!-- {#if $hosts}
        <div class="boxes">
          <div class="box">
            {#each $hosts as host}
              <div class="deployment">
                {host.type}
                <button
                  on:click={() => {
                    hosts.update((h) => h.filter((h) => h.type !== host.type))
                  }}>remove</button
                >
                <span
                  >Publishing to <a target="blank" href={host.deployment}
                    >{host.deployment.domain}</a
                  >
                </span>
                <span
                  >Last published {timeAgo.format(
                    host.deployment.createdAt
                  )}</span
                >
              </div>
            {/each}
          </div>
        </div>
      {/if} -->
      {#if deployment}
        <div class="boxes">
          <div class="box">
            <div class="deployment">
              <a href={deployment.alias[0]} rel="external"
                >{deployment.alias[0]}</a
              >
              <span>{timeAgo.format(deployment.createdAt)}</span>
            </div>
          </div>
        </div>
      {/if}
      <header class="review">
        <div>
          {#if published}
            <p class="title">
              Congrats! Your newest updates should be live in no time at <a
                target="blank"
                href="https://{$hosts?.vercel?.url}">{$hosts?.vercel?.url}</a
              >.
            </p>
          {:else if pages.length > 0}
            <p class="title">Review and Publish</p>
            <p class="subtitle">
              Here are the changes that you're making to your site
            </p>
            <PrimaryButton
              on:click={publishToHosts}
              label="Save and Publish"
              {loading}
            />
          {:else if $hosts}
            <p class="title">Publish Changes</p>
            <PrimaryButton
              on:click={publishToHosts}
              label="Save and Publish"
              {loading}
            />
          {:else}
            <p class="title">Publish your website</p>
            <p class="subtitle">
              Your website will be published to your connected web host[s]
            </p>
            <PrimaryButton
              on:click={publishToHosts}
              label="Save and Publish"
              {loading}
            />
            <!-- <p class="title">No Changes to Publish</p>
            <p class="subtitle">
              Looks like nothing's changed yet. <br />That's too bad.
            </p> -->
          {/if}
        </div>
        <div class="pages">
          {#each pages as [before, after]}
            <div class="page">
              <div>
                {#if before}
                  <PageItem page={before.data} displayOnly={true} />
                {:else}
                  <div class="empty-state">
                    <i class="fas fa-lightbulb" />
                  </div>
                {/if}
              </div>
              <i class="fas fa-arrow-right" />
              <div>
                {#if after}
                  <PageItem page={after.data} displayOnly={true} />
                {:else}
                  <div class="empty-state">
                    <i class="fas fa-trash" />
                  </div>
                {/if}
              </div>
            </div>
          {/each}
        </div>
      </header>
    </div>
  </div>
</main>

<style lang="postcss">
  .title {
    margin-bottom: 0.5rem;
    color: var(--color-gray-1);
    font-weight: 600;
    transition: color 0.1s;
    a {
      text-decoration: underline;
    }
    span {
      margin-right: 0.25rem;
    }
  }
  a.title:hover {
    color: var(--color-primored);
  }

  .subtitle {
    color: var(--color-gray-2);
    margin-bottom: 1rem;
    font-size: var(--font-size-2);
    line-height: 1.5;
    a {
      text-decoration: underline;
      &:hover {
        color: var(--color-primored);
      }
    }
  }

  .error-message {
    border: 1px solid var(--color-primored);
    padding: 1rem;
    font-size: 0.75rem;
    margin-bottom: 1rem;
  }

  .publish-description {
    background: var(--color-gray-9);
    color: var(--color-gray-2);
    font-weight: 600;
    padding: 1rem;
    font-size: var(--font-size-2);
    margin-bottom: 0.5rem;
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    a,
    underline {
      text-decoration: underline;
    }
  }
  main {
    background: var(--primo-color-black);
    color: var(--color-gray-1);
    padding: 1rem;
    /* max-width: 500px;
    align-self: flex-end; */

    .message {
      margin-bottom: 1rem;
    }

    .button-container {
      --space-y: 0.5rem;

      svg {
        height: 1rem;
        width: 1rem;
        margin-right: 0.25rem;
      }

      hr {
        border-color: var(--color-gray-8);
      }
    }

    form {
      width: 100%;
      label {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        margin-bottom: 1rem;

        input {
          border: 0;
          width: 100%;
          background: var(--color-gray-8);
          color: var(--color-gray-1);
        }
      }
      .submit-button {
        display: flex;
        justify-content: flex-end;
        margin-top: 1rem;
      }
    }

    .repo-publish {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      gap: 2rem;
    }

    .feedback {
      display: flex;
      justify-content: center;
      color: var(--color-gray-2);
      font-weight: 600;
      margin-bottom: 1rem;
    }

    .publish {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      place-items: flex-start normal;

      @media screen and (max-width: 900px) {
        grid-template-columns: auto;
      }

      .latest-deployments {
        --Spinner-size: 1rem;
        padding-top: 1.5rem;
        .heading {
          display: flex;
          justify-content: space-between;
          font-size: 1rem;
          font-weight: 700;

          button {
            i {
              color: white;
              padding: 0.5rem;
              border-radius: 50%;
              box-shadow: var(--ring-primored-thin);
              transition: box-shadow 0.1s;
            }
            &:hover {
              i {
                box-shadow: var(--ring-primored-thick);
              }
            }
            &:active {
              i {
                box-shadow: var(--ring-primored);
              }
            }
            &.spinning {
              animation: spin 1s linear infinite;
            }
            @keyframes spin {
              from {
                transform: rotate(0deg);
              }
              to {
                transform: rotate(360deg);
              }
            }
          }
        }
        .item {
          display: flex;
          flex-direction: column;
          padding: 0.75rem 0;

          &:not(:last-child) {
            margin-bottom: 0.5rem;
            border-bottom: 1px solid var(--color-gray-8);
          }

          .title {
            font-size: 0.85rem;
            font-weight: 500;
            margin-bottom: 0;
          }
          .subtitle {
            font-size: 0.75rem;
            color: var(--color-gray-5);
            margin-bottom: 0;
          }
        }
      }

      .boxes {
        margin-bottom: 1rem;
      }

      .box {
        padding: 1rem;
        background: var(--color-gray-9);
        color: var(--color-gray-2);
        display: flex;
        flex-direction: column;

        &:not(:last-child) {
          border-bottom: 1px solid var(--color-gray-8);
        }

        .deployment {
          padding: 0.5rem 0;
          display: flex;
          flex-direction: column;

          a {
            text-decoration: underline;
            transition: color 0.1s;
            &:hover {
              color: var(--color-primored);
            }
          }

          span:last-child {
            font-size: 0.75rem;
            color: var(--color-gray-4);
          }
          &:not(:last-child) {
            border-bottom: 1px solid var(--color-gray-8);
          }
        }

        header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-direction: column;
          align-items: flex-start;

          .button {
            font-size: 0.75rem;
            text-decoration: underline;
            transition: color 0.1s;
            &:hover {
              color: var(--color-primored);
            }
          }

          .footer-link {
            font-size: 0.85rem;
            text-decoration: underline;
            margin-top: 0.5rem;
          }

          & > span {
            font-size: 0.85rem;
            color: var(--color-gray-4);
          }
        }

        .header-logo {
          width: 7rem;
        }

        .box-item {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          padding: 1rem 0;
          .icon-item {
            i {
              margin-right: 5px;
            }
            a {
              text-decoration: underline;
            }
          }
          .box-footer {
            font-size: 0.75rem;
            color: var(--color-gray-5);
          }
          .user {
            display: grid;
            grid-template-columns: auto 1fr;
            place-items: center;
            gap: 1rem;
          }
          /* background: var(--color-gray-8); */
          & > *:not(:last-child) {
            margin-bottom: 0.5rem;
          }
          span:first-child {
            font-weight: 700;
          }
          a {
            text-decoration: underline;
          }
          &:first-child {
            padding-top: 0;
          }
        }

        .host-account {
          border-bottom: 1px solid var(--color-gray-7);
          padding-bottom: 1rem;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          img {
            width: 3rem;
            height: 3rem;
            object-fit: contain;
            border-radius: 50%;
          }
          .user-details {
            display: flex;
            flex-direction: column;

            span:not(:last-child) {
              margin-bottom: 0.25rem;
            }
          }
        }

        .buttons {
          display: grid;
          gap: 0.5rem;
          grid-template-columns: 1fr 1fr;

          button {
            background: white;
            padding: 1rem 2rem;
            box-shadow: 0 0 0 0 var(--color-primored);
            border-radius: 0.25rem;
            transition: box-shadow 0.1s;
            overflow: visible;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            &.netlify {
            }
            &.vercel {
              color: black;
            }
            svg {
              width: 6rem;
              height: 100%;
              padding: 1rem 0;
            }
            &:hover {
              box-shadow: 0 0 0 3px var(--color-primored);
            }
            &[disabled] {
              opacity: 0.5;
            }
          }
        }
      }
      .publish-status {
        a {
          text-decoration: underline;
          &:hover {
            color: var(--color-primored);
          }
        }
        button.upload-button {
          padding: 0.5rem 1rem;
          background: var(--color-primored);
          border-radius: 2px;
          font-weight: 500;
          transition: background 0.1s;

          &:hover {
            background: var(--color-primored-dark);
          }
        }
      }
      header.review {
        margin-bottom: 2rem;

        .pages {
          display: grid;
          gap: 0.5rem;
          margin: 1rem 0;
          .page {
            display: grid;
            grid-template-columns: 1fr auto 1fr;
            gap: 0.5rem;

            i {
              align-self: center;
            }

            .empty-state {
              border-radius: var(--primo-border-radius);
              height: 100%;
              color: var(--color-primored);
              border: 2px solid var(--color-gray-9);
              display: flex;
              justify-content: center;
              font-size: 2rem;
            }
          }
        }
      }
    }
  }

  input {
    border: 0;
    box-shadow: 0 0 0 2px transparent;
    transition: box-shadow 0.2s;
    border-radius: 1px;

    &:focus {
      box-shadow: 0 0 0 2px var(--color-primored);
    }
  }

  @media (max-width: 600px) {
    main {
      .publish {
        grid-template-columns: auto;
      }
    }
  }
</style>
