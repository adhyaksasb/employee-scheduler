import { redirect } from '@sveltejs/kit';

export function load() {
	// Redirect to another route
	throw redirect(302, '/dashboard/scheduler');
}
