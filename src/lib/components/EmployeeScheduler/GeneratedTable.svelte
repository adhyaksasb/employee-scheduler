<script lang="ts">
	import { cn } from '$lib/utils';
	import { Pencil, Plus, RefreshCcw } from 'lucide-svelte';

	let {
		days,
		shift,
		shiftName,
		employeeNumber,
		employees
	}: {
		days: number;
		shift: number;
		shiftName: string[];
		employeeNumber: number | null;
		employees: string[];
	} = $props();

	type Schedule = {
		[employee: string]: string[];
	};

	let schedule: Schedule = $state({});

	let showTable: boolean = $state(false);

	let editableShift: { employee: string; day: number } | null = $state(null);

	let editTable: boolean = $state(false);

	const exportTableToExcel = (transactionsTable: string, filename: string) => {
		const dataType = 'application/vnd.ms-excel';
		const tableSelect = document.getElementById(transactionsTable);

		if (!tableSelect) {
			console.error(`Table with id ${transactionsTable} not found`);
			return;
		}

		const tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');
		const downloadLink = document.createElement('a');

		// Specify file name
		const fullFilename = `${filename}.xls`;

		// Create a link to the file
		downloadLink.href = `data:${dataType}, ${tableHTML}`;

		// Setting the file name
		downloadLink.download = fullFilename;

		// Append the download link to the document
		document.body.appendChild(downloadLink);

		// Triggering the download
		downloadLink.click();

		// Remove the download link from the document
		document.body.removeChild(downloadLink);
	};

	const generateSchedule = () => {
		if (employeeNumber !== null) {
			schedule = {};
			const shiftCounts = Array.from({ length: days }, () => new Array(shift).fill(0));
			const shiftQuota = Math.floor((employeeNumber * days) / (shift * days));
			let shiftRemainder = (employeeNumber * days) % (shift * days);

			employees.forEach((employee) => {
				schedule[employee] = [];
				for (let day = 0; day < days; day++) {
					let assigned = false;
					let attempts = 0;
					while (!assigned && attempts < 100) {
						// Add a fail-safe mechanism
						attempts++;
						const randomShift = Math.floor(Math.random() * shift);
						if (
							shiftCounts[day][randomShift] < shiftQuota ||
							(shiftRemainder > 0 && shiftCounts[day][randomShift] < shiftQuota + 1)
						) {
							schedule[employee].push(shiftName[randomShift]);
							shiftCounts[day][randomShift]++;
							assigned = true;
							if (shiftCounts[day][randomShift] === shiftQuota + 1) shiftRemainder--;
						}
					}
					if (!assigned) {
						// In case all attempts fail, fallback to any shift with minimum assignments
						const minShift = shiftCounts[day].indexOf(Math.min(...shiftCounts[day]));
						schedule[employee].push(shiftName[minShift]);
						shiftCounts[day][minShift]++;
					}
				}
			});
		}
	};

	const updateSchedule = () => {
		if (shift == 2) {
			shift = 2;
		} else {
			shift = 3;
		}
		showTable = true;
		generateSchedule();
	};

	const handleCellClick = (employee: string, day: number) => {
		editableShift = { employee, day };
	};

	const updateShift = (employee: string, day: number, newShift: string) => {
		schedule[employee][day] = newShift;
		editableShift = null;
	};

	const handleEditTable = () => {
		editTable = !editTable;
		console.log(editTable);
	};

	generateSchedule();
</script>

{#if showTable}
	<div class="mb-10 mt-6 flex justify-between">
		<h1 class="text-4xl font-semibold">Jadwal Karyawan</h1>
		<div class="flex gap-4">
			<button
				onclick={() => exportTableToExcel('employeeSchedule', 'excel_data')}
				type="button"
				class="flex gap-2 rounded-sm bg-blue-600 px-5 py-3 text-white"><Plus />Download</button
			>
			<button
				onclick={handleEditTable}
				type="button"
				class="flex gap-2 rounded-sm bg-blue-600 px-5 py-3 text-white"
				><Pencil /> Atur Manual</button
			>
			<button
				onclick={updateSchedule}
				type="button"
				class="flex gap-2 rounded-sm bg-blue-600 px-5 py-3 text-white"
				><RefreshCcw /> Atur Ulang</button
			>
		</div>
	</div>
	<table class="w-full border-collapse rounded-sm" id="employeeSchedule">
		<thead class="bg-foreground text-background">
			<tr>
				<th class="border border-foreground px-2 py-3">No</th>
				<th class="border border-foreground px-2 py-3">Nama Karyawan</th>
				{#each Array.from({ length: days }, (_, i) => i + 1) as day}
					<th class="border border-foreground px-2 py-3 text-center">{day}</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each Object.keys(schedule) as employee, i}
				<tr>
					<td class="border border-foreground px-2 py-3">{i + 1}</td>
					<td class="border border-foreground px-2 py-3">{employee}</td>
					{#each schedule[employee] as shift, day}
						<td
							class={cn(
								'border border-foreground px-2 py-3 text-center',
								editTable ? 'cursor-pointer' : 'cursor-not-allowed'
							)}
							onclick={() => handleCellClick(employee, day)}
						>
							{#if editableShift && editableShift.employee === employee && editableShift.day === day && editTable}
								<select
									onchange={(e) =>
										updateShift(employee, day, (e.target as HTMLSelectElement).value)}
								>
									{#each shiftName as shiftOption}
										<option value={shiftOption} selected={shift === shiftOption}
											>{shiftOption}</option
										>
									{/each}
								</select>
							{:else}
								{shift}
							{/if}
						</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
{:else}
	<div class="mt-12 flex w-full items-center justify-center">
		<button
			onclick={updateSchedule}
			type="button"
			class="flex gap-2 rounded-sm bg-blue-600 px-6 py-4 text-2xl font-bold text-white"
			>Generate Schedule</button
		>
	</div>
{/if}
