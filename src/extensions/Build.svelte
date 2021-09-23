<script>
  import axios from 'axios'
  import { flattenDeep } from 'lodash-es'
  import TimeAgo from 'javascript-time-ago'
  import en from 'javascript-time-ago/locale/en'
  import JSZip from 'jszip'
  import { saveAs } from 'file-saver'
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

  const siteID = $page.params.site

  let loading = false

  async function downloadSite() {
    loading = true
    const zip = new JSZip()
    const files = await buildSiteBundle($site, siteID)
    files.forEach((file) => {
      zip.file(file.path, file.content)
    })
    const toDownload = await zip.generateAsync({ type: 'blob' })
    saveAs(toDownload, `${siteID}.zip`)
    modal.hide()
  }

  $: console.log($hosts)

  let deployment
  async function publishToHosts() {
    loading = true

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
        }
      })
    )

    loading = false

    pages = []
  }

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
              .filter((block) => block.type === 'component' && !block.symbolID)
              .map((block) => block.value.html)
          )
        ).join(' ')
        return symbolHTML + componentHTML
      }
    }
  }

  let published = false

  let pages = []
</script>

<ModalHeader icon="fas fa-globe" title="Publish" variants="mb-4" />

<main>
  <div class="publish">
    <div>
      <Hosting />
    </div>
    <div>
      {#if deployment}
        <div class="boxes">
          <div class="box">
            <div class="deployment">
              <a
                href="https://{deployment.alias[0]}"
                rel="external"
                target="blank">{deployment.alias[0]}</a
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
          {:else if $hosts.length > 0}
            <p class="title">Publish Changes</p>
            <PrimaryButton
              on:click={publishToHosts}
              label="Save and Publish"
              {loading}
            />
          {:else}
            <p class="title">Download your website</p>
            <p class="subtitle">
              You can connect a web host to publish your website directly from
              primo, or download it to publish it manually
            </p>
            <PrimaryButton
              on:click={downloadSite}
              label="Download your site"
              {loading}
            />
          {/if}
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
