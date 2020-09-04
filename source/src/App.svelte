<script>
	import {beforeUpdate, setContext, onMount} from 'svelte'
	import axios from 'axios/dist/axios'
	import Primo, {modal, pageId} from 'primo-app'
  import {buildPageHTML,buildPageStyles} from './utils'
	import Build from './extensions/Build.svelte';

	// references node stuff in happening in client.js

	const siteData = window.siteData
	const processPostCSS = window.processPostCSS

	function saveData(data) {
		window.updateDatabase(data)
	}

	let sites = siteData
	let activeSite = siteData[0]

	modal.create([
		{
			id: 'BUILD',
			component: Build,
			componentProps: {
				site: activeSite,
				onbuild: async () => {

					const pages = await Promise.all(
						activeSite.pages.map(async page => {
							const html = buildPageHTML(page, true)
							const css = await buildPageStyles(page, activeSite, html)
							return { 
								id: page.id, 
								html, 
								css 
							}
						})
					)

					buildSite(pages, activeSite)
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

	let data = siteData[0]

	onMount(() => {
		const splashPage = document.querySelector('#splash-page')
		splashPage.classList.add('fadeout')
		setTimeout(() => {splashPage.remove();}, 1000)
	})

</script>

<Primo 
	{data}
	sites={siteData}
	role="developer"
	showDashboardLink={false}
	functions={{
		processPostCSS
	}}
	on:save={({detail:sites}) => {
		saveData(sites)
	}} 
/>