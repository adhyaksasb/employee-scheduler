<script lang="ts">
	import { cn } from '$lib/utils';
	import { Check } from 'lucide-svelte';

	let { stepLevel }: { stepLevel: number } = $props();
</script>

<div class="mx-auto my-4 max-w-[64rem] border-b-2 pb-4">
	<div class="flex pb-3">
		<div class="flex-1"></div>
		<div class="flex-1">
			<div
				class={cn(
					'mx-auto flex h-10 w-10 items-center rounded-full border-2 border-gray-400 bg-foreground text-lg text-background',
					stepLevel == 1 ? 'bg-foreground' : 'bg-green-500 text-foreground'
				)}
			>
				<div class="m-auto">
					{#if stepLevel == 1}
						<div class="h-4 w-4 rounded-full bg-background"></div>
					{:else}
						<Check />
					{/if}
				</div>
			</div>
		</div>
		<div class="align-center flex w-1/6 content-center items-center align-middle">
			<div class="bg-grey-light align-center w-full flex-1 items-center rounded align-middle">
				<div
					class={cn(
						'rounded  py-1 text-center text-xs leading-none',
						stepLevel == 1 ? 'bg-foreground' : 'bg-green-500'
					)}
					style="width: 100%"
				></div>
			</div>
		</div>
		<div class="flex-1">
			<div
				class={cn(
					'mx-auto flex h-10 w-10 items-center rounded-full border-2 border-gray-400 bg-foreground text-lg text-background',
					stepLevel > 2 ? 'bg-green-500 text-foreground' : 'bg-foreground'
				)}
			>
				<div class="m-auto">
					{#if stepLevel == 2}
						<div class="h-4 w-4 rounded-full bg-background"></div>
					{:else if stepLevel > 2}
						<Check />
					{:else}
						<span class="w-full text-center">2</span>
					{/if}
				</div>
			</div>
		</div>
		<div class="align-center flex w-1/6 content-center items-center align-middle">
			<div class="bg-grey-light align-center w-full flex-1 items-center rounded align-middle">
				<div
					class={cn(
						'rounded  py-1 text-center text-xs leading-none',
						stepLevel > 2 ? 'bg-green-500' : 'bg-foreground'
					)}
					style="width: 100%"
				></div>
			</div>
		</div>
		<div class="flex-1">
			<div
				class={cn(
					'mx-auto flex h-10 w-10 items-center rounded-full border-2 border-gray-400 bg-foreground text-lg text-background',
					stepLevel > 3 ? 'bg-green-500 text-foreground' : 'bg-foreground'
				)}
			>
				<div class="m-auto">
					{#if stepLevel == 3}
						<div class="h-4 w-4 rounded-full bg-background"></div>
					{:else if stepLevel > 3}
						<Check />
					{:else}
						<span class="w-full text-center">3</span>
					{/if}
				</div>
			</div>
		</div>
		<div class="align-center flex w-1/6 content-center items-center align-middle">
			<div class="bg-grey-light align-center w-full flex-1 items-center rounded align-middle">
				<div
					class={cn(
						'rounded  py-1 text-center text-xs leading-none',
						stepLevel > 3 ? 'bg-green-500' : 'bg-foreground'
					)}
					style="width: 100%"
				></div>
			</div>
		</div>
		<div class="flex-1">
			<div
				class={cn(
					'mx-auto flex h-10 w-10 items-center rounded-full border-2 border-gray-400 bg-foreground text-lg text-background',
					stepLevel == 4 ? 'bg-green-500 text-foreground' : 'bg-foreground'
				)}
			>
				<div class="m-auto">
					{#if stepLevel == 4}
						<Check />
					{:else}
						<span class="w-full text-center">4</span>
					{/if}
				</div>
			</div>
		</div>

		<div class="flex-1"></div>
	</div>
	<div class="flex content-center text-center text-xs">
		<div class="w-1/4">
			<h3 class="text-sm text-muted-foreground">Step 1</h3>
			<h2 class="text-md font-bold">Atur Komponen Utama</h2>
			{#if stepLevel == 1}
				<p class="text-xs text-blue-500">On progress</p>
			{:else}
				<p class="text-xs text-green-500">Finished</p>
			{/if}
		</div>
		<div class="w-1/4">
			<h3 class="text-sm text-muted-foreground">Step 2</h3>
			<h2 class="text-md font-bold">Atur Komponen Kedua</h2>
			{#if stepLevel == 2}
				<p class="text-xs text-blue-500">On progress</p>
			{:else if stepLevel > 2}
				<p class="text-xs text-green-500">Finished</p>
			{:else}
				<p class="text-xs text-muted-foreground">Pending</p>
			{/if}
		</div>
		<div class="w-1/4">
			<h3 class="text-sm text-muted-foreground">Step 3</h3>
			<h2 class="text-md font-bold">Atur Komponen Ketiga</h2>
			{#if stepLevel == 3}
				<p class="text-xs text-blue-500">On progress</p>
			{:else if stepLevel > 3}
				<p class="text-xs text-green-500">Finished</p>
			{:else}
				<p class="text-xs text-muted-foreground">Pending</p>
			{/if}
		</div>
		<div class="w-1/4">
			<h3 class="text-sm text-muted-foreground">Step 4</h3>
			<h2 class="text-md font-bold">Generate Jadwal</h2>
			{#if stepLevel == 4}
				<p class="text-xs text-green-500">Finished</p>
			{:else}
				<p class="text-xs text-muted-foreground">Pending</p>
			{/if}
		</div>
	</div>
</div>
