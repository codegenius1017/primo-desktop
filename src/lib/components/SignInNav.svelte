<script>
  // import { signOut } from '../../supabase/auth'
  import Logo from '$lib/ui/PrimoLogo.svelte'

  import { show } from '$lib/components/Modal.svelte'

  function openUserSettings() {
    // modal.show('USER_SETTINGS')
  }

  function signOutUser() {
    // signOut()
  }
</script>

<nav role="navigation" aria-label="main navigation">
  <div class="logo">
    <Logo />
  </div>
  <div>
    <button on:click={() => show('USER_SETTINGS')}>Settings</button>
  </div>
</nav>

<style lang="postcss">
  nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 1rem;
    color: var(--color-gray-3);
    margin-bottom: 0.5rem;

    .logo {
      width: 8rem;
    }

    .toolbar {
      display: flex;

      button.settings {
        color: var(--color-gray-6);
        font-size: var(--font-size-1);
        margin-right: 1rem;

        img,
        svg {
          width: 1.5rem;
          height: 1.5rem;
          border-radius: 100%;
          object-fit: cover;
          border: 2px solid transparent;
        }

        svg:focus,
        img:focus {
          border-color: var(--color-primored);
        }

        &:hover {
          color: var(--color-primored);
        }
      }

      button.sign-out {
        font-size: var(--font-size-1);
        font-weight: 600;
        border-radius: var(--primo-border-radius);
        background: var(--color-gray-8);
        color: var(--color-gray-2);
        padding: 0.5rem 0.75rem;

        &:hover {
          background: var(--color-primored);
        }
      }
    }
  }

  button {
    padding: 0.5rem 1rem;
    border: 1px solid var(--color-gray-7);
    border-radius: var(--primo-border-radius);

    &:hover {
      box-shadow: var(--primo-ring-primored);
    }
  }
</style>
