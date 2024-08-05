<script lang="ts">
	import { Home, Package2, Settings, CalendarCheck } from 'lucide-svelte';

	import SidebarButton from './SidebarButton.svelte';

	export let path: string;
</script>

<aside class="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
	<nav class="flex flex-col items-center gap-4 px-2 sm:py-5">
		<a
			href="/dashboard"
			class="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
		>
			<Package2 class="h-4 w-4 transition-all group-hover:scale-110" />
			<span class="sr-only">Acme Inc</span>
		</a>
		<SidebarButton icon={Home} name="Dashboard" href="/dashboard" {path} />
		<SidebarButton icon={CalendarCheck} name="Scheduler" href="/dashboard/scheduler" {path} />
	</nav>
	<nav class="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
		<SidebarButton icon={Settings} name="Settings" href="/dashboard/settings" {path} />
	</nav>
</aside>
