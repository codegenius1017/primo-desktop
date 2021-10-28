<script lang="ts">
  import SignInNav from '$lib/components/SignInNav.svelte'
  import SiteFooter from '$lib/components/SiteFooter.svelte'
  import SiteThumbnail from '$lib/components/SiteThumbnail.svelte'
  import Modal, { show, hide } from '$lib/components/Modal.svelte'
  import sites from '../stores/sites'
  import cloudSites, { connected } from '../stores/cloudSites'
  import config from '../stores/config'

  function beginInvitation(site): void {
    // modal.show('INVITATION', { site })
  }

  let loading
  function createSite() {
    show({
      id: 'SITE_CREATION',
      props: {
        onSuccess: (site) => {
          $sites = [...$sites, site]
          hide()
        },
      },
    })
  }

  function connectToServer() {
    show({
      id: 'USER_SETTINGS',
      props: {
        tab: 1,
      },
    })
  }

  async function deleteSiteItem(siteID: string): Promise<any> {
    const confirm = window.confirm('Are you sure you want to delete this site?')
    if (!confirm) return
    $sites = $sites.filter((site) => site.id !== siteID)
    window.primo.data.deleteSite(siteID)
  }

  let siteBeingEdited
</script>

<Modal />
<main class="primo-reset">
  <div class="container">
    <SignInNav />
    <div class="sites-container">
      <ul class="sites" xyz="fade stagger stagger-1">
        {#each $sites as site, i (site.id)}
          <li class="xyz-in">
            <a href={site.id} class="site-link">
              <SiteThumbnail {site} />
            </a>
            <div class="site-info">
              <div class="site-name">
                {#if siteBeingEdited === site.id}
                  <form
                    on:submit|preventDefault={() => (siteBeingEdited = null)}
                  >
                    <input
                      on:blur={() => (siteBeingEdited = null)}
                      autofocus
                      class="reset-input"
                      type="text"
                      bind:value={site.name}
                    />
                  </form>
                {:else}
                  <a href={site.url}>{site.name}</a>
                  <button on:click={() => (siteBeingEdited = site.id)}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"
                      />
                      <path
                        fill-rule="evenodd"
                        d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </button>
                {/if}
              </div>
              <span class="site-url">{site.id} </span>
              <div class="buttons">
                <button
                  class="delete-link"
                  on:click={() => deleteSiteItem(site.id)}
                >
                  <svg
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                    ><path
                      fill-rule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clip-rule="evenodd"
                    /></svg
                  >
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </li>
        {/each}
        <li>
          <button class="create-site" on:click={createSite}>
            {#if loading}
              <!-- <Spinner /> -->
            {:else}
              <svg
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
                ><path
                  fill-rule="evenodd"
                  d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                  clip-rule="evenodd"
                /></svg
              >
            {/if}
            create local site
          </button>
        </li>
      </ul>
    </div>
    {#if $cloudSites}
      <hr />
      <div class="sites-container">
        <header>
          <h2>Primo Server</h2>
          <a target="blank" rel="external" href={$config.serverConfig.url}
            >{$config.serverConfig.url}</a
          >
        </header>
        <ul class="sites" xyz="fade stagger stagger-1">
          {#each $cloudSites as site, i (site.id)}
            <li class="xyz-in">
              <a href={site.id} class="site-link">
                <SiteThumbnail site={site.data} />
              </a>
              <div class="site-info">
                <div class="site-name">
                  {#if siteBeingEdited === site.id}
                    <form
                      on:submit|preventDefault={() => (siteBeingEdited = null)}
                    >
                      <input
                        on:blur={() => (siteBeingEdited = null)}
                        autofocus
                        class="reset-input"
                        type="text"
                        bind:value={site.name}
                      />
                    </form>
                  {:else}
                    <a href={site.url}>{site.name}</a>
                    <button on:click={() => (siteBeingEdited = site.id)}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"
                        />
                        <path
                          fill-rule="evenodd"
                          d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </button>
                  {/if}
                </div>
                <span class="site-url">{site.id} </span>
                <div class="buttons">
                  <button
                    class="delete-link"
                    on:click={() => deleteSiteItem(site.id)}
                  >
                    <svg
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                      ><path
                        fill-rule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clip-rule="evenodd"
                      /></svg
                    >
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </li>
          {:else}
            <span class="info"
              >When you create sites on {$config.serverConfig.url} they will appear
              here</span
            >
          {/each}
          {#if !$connected}
            <li>
              <button class="create-site" on:click={connectToServer}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z"
                  />
                </svg>
                <span>connect to primo server</span>
              </button>
            </li>
          {/if}
        </ul>
      </div>
    {/if}
    <SiteFooter />
  </div>
</main>

<style lang="postcss">
  main {
    background-color: var(--primo-color-black);
    min-height: 100vh;

    .container {
      border-radius: var(--primo-border-radius);
      margin: 0 auto;
      padding: 1.5rem 1rem;
    }

    hr {
      margin: 2rem 0;
      border-color: var(--color-gray-9);
    }

    .sites-container {
      display: grid;
      gap: 1rem;

      span.info {
        padding: 1rem;
        color: white;
        background: var(--color-gray-9);
      }

      header {
        h2 {
          color: white;
        }
        a {
          text-decoration: underline;
          color: var(--color-gray-4);
        }
      }

      ul.sites {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr;
        gap: 1rem;

        li {
          background: var(--color-gray-9);
          border-radius: var(--primo-border-radius);
          overflow: hidden;
          font-size: var(--font-size-4);
          box-shadow: var(--box-shadow-md);
          display: flex;
          flex-direction: column;
          justify-content: flex-start;

          .site-link {
            transition: opacity 0.1s;

            &:hover {
              opacity: 0.75;
            }
          }

          .site-info {
            color: var(--color-gray-1);
            padding: 1.5rem;
            gap: 0.25rem;
            display: flex;
            flex-direction: column;

            .site-name {
              display: flex;
              align-items: center;

              a,
              input {
                text-align: left;
                font-size: var(--font-size-4);
                font-weight: 600;
              }

              button {
                border-radius: var(--primo-border-radius);
                padding: 0 0.5rem;

                &:hover {
                  color: var(--primo-color-primored);
                }

                svg {
                  width: 1rem;
                  height: 1rem;
                }
              }
            }

            .site-url {
              margin-bottom: 0.5rem;
              font-size: var(--font-size-1);
              color: var(--color-gray-4);
            }

            .buttons {
              display: flex;
              align-items: center;
              justify-content: space-between;
              color: var(--color-gray-3);
              margin-top: 0.5rem;

              .button-group {
                margin-right: 0.5rem;
              }
            }
          }
        }

        button.create-site {
          padding: 3rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          background: var(--primo-color-black);
          font-weight: 600;
          color: var(--color-gray-2);
          border-radius: var(--primo-border-radius);
          border: 2px solid var(--primo-color-primored);

          svg {
            height: 2rem;
            width: 2rem;
          }

          &:hover {
            background: var(--primo-color-primored);
          }
        }
      }
    }
  }
  .stop-deleting {
    display: flex;
    justify-content: space-between;
  }
  .small-button {
    color: var(--color-gray-1);
    background: var(--color-gray-8);
    display: flex;
    align-items: center;
    height: 100%;
    font-weight: 600;
    border-radius: var(--primo-border-radius);
    padding: 0.25rem 0.5rem;

    svg {
      height: 1rem;
      width: 1rem;
    }

    &:hover {
      background: var(--primo-color-primored);
    }

    --Spinner-size: 1rem;
    --spinner-mr: 0.5rem;
  }

  .delete-link {
    display: flex;
    align-items: center;
    font-size: 0.75rem;
    color: var(--color-gray-2);
    text-decoration: underline;
    svg {
      padding-right: 0.25rem;
      width: 1.25rem;
      height: 1.25rem;
    }
    &:hover {
      color: var(--primo-color-primored);
    }
  }

  .button-group {
    margin-right: 0.5rem;
    display: flex;
    overflow: hidden;
    border-radius: var(--primo-border-radius);

    button {
      font-size: var(--font-size-1);
      color: var(--color-gray-1);
      background: var(--color-gray-7);
      font-weight: 600;
      display: flex;
      align-items: center;
      padding: 0.25rem 0.5rem;
      transition: color 0.1s;
      &:hover {
        background: var(--primo-color-primored);
      }
      svg {
        width: 0.75rem;
        height: 100%;
      }
      svg + span {
        display: inline-block;
        margin-left: 0.25rem;
      }
    }

    button:first-child:not(:only-child) {
      border-right: 1px solid var(--color-gray-8);
    }
  }

  button {
    transition: color 0.1s, background-color 0.1s;
    &:focus {
      outline: 2px solid var(--primo-color-primored);
    }
  }

  .reset-input {
    border: none;
    background-image: none;
    background-color: transparent;
    box-shadow: none;
    background: transparent;
    border: 0;
    padding: 0;
    margin: 0;

    &:focus {
      outline: 0;
    }
  }

  @media (max-width: 900px) {
    main {
      ul.sites {
        grid-template-columns: 1fr 1fr !important;
      }
    }
  }

  @media (max-width: 600px) {
    main {
      ul.sites {
        grid-template-columns: auto !important;
      }
    }
  }
</style>
