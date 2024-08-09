<script lang="ts">
	import { cn } from '$lib/utils';
	import { Pencil, Plus, RefreshCcw } from 'lucide-svelte';

	let {
		workDays,
		days,
		shift,
		shiftName,
		employeeNumber,
		employees
	}: {
		workDays: number;
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

	let totalWorkDays: { [employee: string]: number } = $state({});

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

	const generateRandomHolidaysForEmployee = (workDays: number, totalDays: number) => {
		return totalDays - workDays;
	};

	const generateSchedule = () => {
		if (employeeNumber !== null) {
			schedule = {};
			totalWorkDays = {};

			employees.forEach((employee) => {
				let holidayCount = generateRandomHolidaysForEmployee(workDays, days);
				schedule[employee] = [];
				totalWorkDays[employee] = 0;

				let lastShift = '';
				let remainingWorkDays = workDays;

				for (let day = 0; day < days; day++) {
					let nextShift = '';

					if (shift == 3) {
						if (holidayCount > 0) {
							if (lastShift === '') {
								const randomNum = Math.floor(Math.random() * 4);
								nextShift =
									randomNum === 0 ? 'P' : randomNum === 1 ? 'S' : randomNum === 2 ? 'M' : 'L';
								if (nextShift === 'L') {
									holidayCount--;
								}
							} else if (lastShift === 'M') {
								// Night can either stay as Night or go to Holiday
								nextShift = Math.random() < 0.1 ? 'M' : 'L';
								if (nextShift === 'L') {
									holidayCount--;
								}
							} else if (lastShift === 'L') {
								const randomNum = Math.floor(Math.random() * 3);
								nextShift = randomNum === 0 ? 'P' : randomNum === 1 ? 'S' : 'L';
								if (nextShift === 'L') {
									holidayCount--;
								}
							} else if (lastShift === 'P' || lastShift === 'S') {
								const randomNum = Math.floor(Math.random() * 3);
								nextShift = randomNum === 0 ? 'P' : randomNum === 1 ? 'S' : 'M';
							}
						} else {
							if (lastShift === 'M') {
								nextShift = 'M'; // No holidays left, must remain Night
							} else {
								const randomNum = Math.floor(Math.random() * 3);
								nextShift = randomNum === 0 ? 'P' : randomNum === 1 ? 'S' : 'M';
							}
						}
					} else if (shift == 2) {
						if (holidayCount > 0) {
							if (lastShift === '') {
								const randomNum = Math.floor(Math.random() * 3);
								nextShift = randomNum === 0 ? 'P' : randomNum === 1 ? 'M' : 'L';
								if (nextShift === 'L') {
									holidayCount--;
								}
							} else if (lastShift === 'M') {
								// Night can either stay as Night or go to Holiday
								nextShift = Math.random() < 0.1 ? 'M' : 'L';
								if (nextShift === 'L') {
									holidayCount--;
								}
							} else if (lastShift === 'L') {
								nextShift = Math.random() < 0.5 ? 'P' : 'L';
								if (nextShift === 'L') {
									holidayCount--;
								}
							} else if (lastShift === 'P') {
								nextShift = Math.random() < 0.5 ? 'P' : 'M';
							}
						} else {
							if (lastShift === 'M') {
								nextShift = 'M'; // No holidays left, must remain Night
							} else {
								nextShift = Math.random() < 0.5 ? 'P' : 'M';
							}
						}
					}

					schedule[employee].push(nextShift);
					lastShift = nextShift;

					if (nextShift !== 'L') {
						totalWorkDays[employee]++;
						remainingWorkDays--;
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
	<div class="mb-10 mt-6 flex flex-col justify-between gap-4 md:flex-row">
		<h1 class="text-lg font-semibold md:text-4xl">Jadwal Karyawan</h1>
		<div class="flex gap-4">
			<button
				onclick={() => exportTableToExcel('employeeSchedule', 'excel_data')}
				type="button"
				class="flex gap-2 rounded-sm bg-blue-600 px-3 py-3 text-white md:px-5"
				><Plus class="hidden md:block" />Download</button
			>
			<button
				onclick={handleEditTable}
				type="button"
				class="flex gap-2 rounded-sm bg-blue-600 px-3 py-3 text-white md:px-5"
				><Pencil class="hidden md:block" /> Atur Manual</button
			>
			<button
				onclick={updateSchedule}
				type="button"
				class="flex gap-2 rounded-sm bg-blue-600 px-3 py-3 text-white md:px-5"
				><RefreshCcw class="hidden md:block" /> Atur Ulang</button
			>
		</div>
	</div>
	<div class="overflow-x-auto">
		<table class="w-full border-collapse rounded-sm" id="employeeSchedule">
			<thead class="bg-foreground text-background">
				<tr>
					<th class="border border-foreground px-2 py-3">No</th>
					<th class="border border-foreground px-2 py-3">Nama Karyawan</th>
					{#each Array.from({ length: days }, (_, i) => i + 1) as day}
						<th class="border border-foreground px-2 py-3 text-center">{day}</th>
					{/each}
					<th class="border border-foreground px-2 py-3">Total</th>
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
										<option value="L">L</option>
									</select>
								{:else}
									{shift}
								{/if}
							</td>
						{/each}
						<td class="border border-foreground px-2 py-3 text-center">{totalWorkDays[employee]}</td
						>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
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
