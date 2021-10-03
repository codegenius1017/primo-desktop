<script>
  import '$lib/assets/reset.css'
  import { browser } from '$app/env'
  import ImageField from '../extensions/FieldTypes/ImageField.svelte'
  import {
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
</script>

<slot />
