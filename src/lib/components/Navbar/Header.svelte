<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { Moon, Search, Sun } from 'lucide-svelte';

	let avatar = '/assets/images/placeholder-user.png';

	import { resetMode, setMode } from 'mode-watcher';
	import MobileHeader from './MobileHeader.svelte';

	let { path }: { path: string } = $props();

	let breadcrumbLinks: Array<String> = $derived(path.split('/').filter(Boolean));

	let isSingleItem: boolean = $derived(breadcrumbLinks.length === 1);
</script>

<header
	class="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6"
>
	<MobileHeader {path} />
	<Breadcrumb.Root class="hidden md:flex">
		<Breadcrumb.List>
			{#if isSingleItem}
				<Breadcrumb.Item>
					<Breadcrumb.Page class="capitalize"
						>{breadcrumbLinks[0].charAt(0).toUpperCase() +
							breadcrumbLinks[0].slice(1)}</Breadcrumb.Page
					>
				</Breadcrumb.Item>
			{:else}
				{#each breadcrumbLinks as breadcrumb, i}
					{#if i === breadcrumbLinks.length - 1}
						<Breadcrumb.Item>
							<Breadcrumb.Page class="capitalize"
								>{breadcrumb.charAt(0).toUpperCase() + breadcrumb.slice(1)}</Breadcrumb.Page
							>
						</Breadcrumb.Item>
					{:else}
						<Breadcrumb.Item>
							<Breadcrumb.Link href="/dashboard" class="capitalize">{breadcrumb}</Breadcrumb.Link>
						</Breadcrumb.Item>
						<Breadcrumb.Separator />
					{/if}
				{/each}
			{/if}
		</Breadcrumb.List>
	</Breadcrumb.Root>
	<div class="relative ml-auto flex-1 md:grow-0">
		<Search class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
		<Input
			type="search"
			placeholder="Search..."
			class="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
		/>
	</div>
	<!-- Set Theme Button -->
	<DropdownMenu.Root>
		<DropdownMenu.Trigger asChild let:builder>
			<Button builders={[builder]} variant="outline" size="icon">
				<Sun
					class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
				/>
				<Moon
					class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
				/>
				<span class="sr-only">Toggle theme</span>
			</Button>
		</DropdownMenu.Trigger>
		<DropdownMenu.Content align="end">
			<DropdownMenu.Item on:click={() => setMode('light')}>Light</DropdownMenu.Item>
			<DropdownMenu.Item on:click={() => setMode('dark')}>Dark</DropdownMenu.Item>
			<DropdownMenu.Item on:click={() => resetMode()}>System</DropdownMenu.Item>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
	<DropdownMenu.Root>
		<DropdownMenu.Trigger asChild let:builder>
			<Button
				variant="outline"
				size="icon"
				class="overflow-hidden rounded-full"
				builders={[builder]}
			>
				<img
					src={avatar}
					width={36}
					height={36}
					alt="Avatar"
					class="overflow-hidden rounded-full"
				/>
			</Button>
		</DropdownMenu.Trigger>
		<DropdownMenu.Content align="end">
			<DropdownMenu.Label>My Account</DropdownMenu.Label>
			<DropdownMenu.Separator />
			<DropdownMenu.Item>Settings</DropdownMenu.Item>
			<DropdownMenu.Item>Support</DropdownMenu.Item>
			<DropdownMenu.Separator />
			<DropdownMenu.Item>Logout</DropdownMenu.Item>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
</header>
