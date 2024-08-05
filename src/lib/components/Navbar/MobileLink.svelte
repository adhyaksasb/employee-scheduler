<script lang="ts">
	import { cn } from '$lib/utils';

	export let icon: any;
	export let path: string;
	export let href: string;
	export let name: string;
</script>

<a
	{href}
	class={cn(
		'flex items-center gap-4 px-2.5',
		path === href ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
	)}
>
	<svelte:component this={icon} class="h-5 w-5" />
	{name}
</a>
