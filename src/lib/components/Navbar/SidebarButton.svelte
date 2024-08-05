<script lang="ts">
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import { cn } from '$lib/utils';

	export let icon: any;
	export let name: string;
	export let href: string;
	export let path: string;
</script>

<Tooltip.Root>
	<Tooltip.Trigger asChild let:builder>
		<a
			{href}
			class={cn(
				'flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:text-foreground md:h-8 md:w-8',
				path === href ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
			)}
			use:builder.action
			{...builder}
		>
			<svelte:component this={icon} class="h-5 w-5" />
			<span class="sr-only">{name}</span>
		</a>
	</Tooltip.Trigger>
	<Tooltip.Content side="right">{name}</Tooltip.Content>
</Tooltip.Root>
