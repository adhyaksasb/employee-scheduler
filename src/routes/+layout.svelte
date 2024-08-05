<script lang="ts">
	import '../app.css';

	let { children } = $props();
	import { ModeWatcher } from 'mode-watcher';
</script>

<ModeWatcher />
<div class="min-h-screen bg-background font-sans antialiased">
	{@render children()}
</div>
