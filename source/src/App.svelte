<script>
	import {setContext, onMount} from 'svelte'
	import axios from 'axios/dist/axios'
	import Primo, {modal, pageId} from '../../../primo-framework/primo-app/dist/build/main'
  import {buildPageHTML,buildPageStyles} from './utils'

	import Build from '../../../primo-framework/plugins/builder'

	function saveData(data) {
		updateDatabase(data)
	}

	let data = siteData
	let localData = siteData

	modal.create([
		{
			id: 'BUILD',
			component: Build,
			componentProps: {
				site: localData,
				onbuild: async () => {

					const pages = await Promise.all(
						localData.pages.map(async page => {
							const html = buildPageHTML(page, true)
							const css = await buildPageStyles(page, localData, html)
							return { 
								id: page.id, 
								html, 
								css 
							}
						})
					)

					buildSite(pages, siteData)
					modal.hide()
				}
			},
			options: {
				width: 'md',
				header: {
					title: 'Build',
					icon: 'fas fa-hammer'
				},
			},
		}
	])

	// NOTE: An error is being thrown at runtime related to the custom elements inside primo. It only seems to occur when pulling the package from npm. 

</script>

<Primo 
	endpoint="http://localhost:3005/__functions"
	{data}
	on:save={({detail:data}) => {
		localData = data
		saveData(data)
	}} 
	on:change={({detail:content}) => {
		console.log(content)
	}} 
/>