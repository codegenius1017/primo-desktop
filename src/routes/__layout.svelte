<script>
  import '$lib/assets/reset.css'
  import { browser } from '$app/env'
  import ImageField from '../extensions/FieldTypes/ImageField.svelte'
  import SiteButtons from '$lib/components/SiteButtons.svelte'
  import {
    dropdown,
    registerProcessors,
    fieldTypes,
    PrimoFieldTypes,
  } from '@primo-app/primo'

  if (browser) {
    import('../compiler/processors').then(({ html, css }) => {
      registerProcessors({ html, css })
    })
  }

  fieldTypes.register([
    {
      id: 'image',
      label: 'Image',
      component: ImageField,
    },
    ...PrimoFieldTypes,
  ])

  dropdown.set([
    {
      label: 'Back to Dashboard',
      icon: 'fas fa-arrow-left',
      href: '/',
    },
    {
      component: SiteButtons,
    },
  ])
</script>

<div id="primo-desktop-toolbar" />
<slot />

<style>
  #primo-desktop-toolbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 30px;
    -webkit-app-region: drag;
    border-bottom: 1px solid #222;
    background: var(--primo-color-black);
    z-index: 1;
  }
</style>
