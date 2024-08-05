<script lang="ts">
	import { formatCurrency, formatNumber } from '$lib/utils';
	import * as Card from '../ui/card';

	export let icon: any;
	export let title: string;
	export let body: number;
	export let desc: string;
	export let format: string;

	let formatBody: string;

	if (format === 'currency') {
		formatBody = formatCurrency(body);
	} else {
		formatBody = formatNumber(body);
	}
</script>

<Card.Root
	data-x-chunk-name="dashboard-01-chunk-0"
	data-x-chunk-description="A card showing the total revenue in USD and the percentage difference from last month."
>
	<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
		<Card.Title class="text-sm font-medium">{title}</Card.Title>
		<svelte:component this={icon} class="h-4 w-4 text-muted-foreground" />
	</Card.Header>
	<Card.Content>
		<div class="text-2xl font-bold">{formatBody}</div>
		<p class="text-xs text-muted-foreground">{desc}</p>
	</Card.Content>
</Card.Root>
