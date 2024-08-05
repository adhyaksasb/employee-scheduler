<script lang="ts">
	import Sidebar from '$lib/components/Navbar/Sidebar.svelte';
	import Header from '$lib/components/Navbar/Header.svelte';
	import { page } from '$app/stores';

	let { children } = $props();

	let path = $derived($page.url.pathname);
</script>

<div class="flex min-h-screen w-full flex-col bg-muted/40">
	<Sidebar {path} />
	<div class="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
		<Header {path} />
		{@render children()}
	</div>
</div>
