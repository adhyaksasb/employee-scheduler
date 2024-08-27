<script lang="ts">
	import { cn } from '$lib/utils';
	import { Pencil, Plus, RefreshCcw } from 'lucide-svelte';

	let {
		workDays,
		days,
		shift,
		shiftName,
		employeeNumber,
		employees,
		dayNames
	}: {
		workDays: number;
		days: number;
		shift: number;
		shiftName: string[];
		employeeNumber: number | null;
		employees: string[];
		dayNames: { Day: number; Name: string }[];
	} = $props();

	type Schedule = {
		[employee: string]: string[];
	};

	let minMorning = 4;
	let minAfternoon = 4;
	let minNight = 4;
	let maxMorning = 5;
	let maxAfternoon = 5;
	let maxNight = 5;

	let schedule: Schedule = $state({});

	let showTable: boolean = $state(false);

	let editableShift: { employee: string; day: number } | null = $state(null);

	let editTable: boolean = $state(false);

	let totalWorkDays: { [employee: string]: number } = $state({});

	let shiftCountPerDay: any = $state([]);

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
			shiftCountPerDay = [];
			schedule = {};
			totalWorkDays = {};

			employees.forEach((employee) => {
				let holidayCount = generateRandomHolidaysForEmployee(workDays, days);
				schedule[employee] = [];
				totalWorkDays[employee] = 0;

				let lastShift = '';
				let remainingWorkDays = workDays;
				let daysSinceLastHoliday = 0;
				let consecutiveP = 0;
				let consecutiveS = 0;

				for (let day = 0; day < days + 1; day++) {
					if (!shiftCountPerDay[day]) {
						shiftCountPerDay[day] = { P: 0, S: 0, M: 0, L: 0 };
					}

					let nextShift = '';

					if (shift === 3) {
						if (holidayCount > 0) {
							const holidayChance = daysSinceLastHoliday >= 6 ? 0.9 : 0.1;
							const shouldAssignHoliday = Math.random() < holidayChance;

							if (lastShift === '') {
								const randomNum = Math.floor(Math.random() * 4);
								nextShift =
									randomNum === 0 ? 'P' : randomNum === 1 ? 'S' : randomNum === 2 ? 'M' : 'L';
								if (nextShift === 'L') {
									holidayCount--;
									daysSinceLastHoliday = 0;
									consecutiveP = 0;
									consecutiveS = 0;
								} else {
									daysSinceLastHoliday = 6;
								}
							} else if (lastShift === 'M' && shouldAssignHoliday && daysSinceLastHoliday >= 6) {
								nextShift = 'L';
								holidayCount--;
								daysSinceLastHoliday = 0;
								consecutiveP = 0;
								consecutiveS = 0;
							} else if (lastShift === 'M') {
								nextShift = Math.random() < 0.1 && daysSinceLastHoliday >= 6 ? 'L' : 'M';
								if (nextShift === 'L') {
									holidayCount--;
									daysSinceLastHoliday = 0;
									consecutiveP = 0;
									consecutiveS = 0;
								} else {
									daysSinceLastHoliday++;
								}
							} else if (lastShift === 'L') {
								const randomNum = Math.floor(Math.random() * 2);
								nextShift = randomNum === 0 ? 'P' : 'S';
								daysSinceLastHoliday++;
								consecutiveP = nextShift === 'P' ? 1 : 0;
								consecutiveS = nextShift === 'S' ? 1 : 0;
							} else if (lastShift === 'P' || lastShift === 'S') {
								if (
									(lastShift === 'P' && consecutiveP === 3) ||
									(lastShift === 'S' && consecutiveS === 3)
								) {
									nextShift = lastShift === 'P' ? 'S' : 'P';
									consecutiveP = nextShift === 'P' ? 1 : 0;
									consecutiveS = nextShift === 'S' ? 1 : 0;
								} else {
									const randomNum = Math.floor(Math.random() * 4);
									if (daysSinceLastHoliday >= 5) {
										nextShift = 'M';
									} else {
										nextShift =
											randomNum === 0
												? 'P'
												: randomNum === 1
													? 'S'
													: daysSinceLastHoliday >= 4
														? 'M'
														: Math.random() < 0.5
															? 'P'
															: 'S';
									}
									if (nextShift === 'P') {
										consecutiveP++;
										consecutiveS = 0;
									} else if (nextShift === 'S') {
										consecutiveS++;
										consecutiveP = 0;
									} else {
										consecutiveP = 0;
										consecutiveS = 0;
									}
									daysSinceLastHoliday++;
								}
							}
						} else {
							if (lastShift === 'M') {
								nextShift = 'M';
							} else {
								const randomNum = Math.floor(Math.random() * 3);
								nextShift =
									randomNum === 0
										? 'P'
										: randomNum === 1
											? 'S'
											: daysSinceLastHoliday >= 4
												? 'M'
												: Math.random() < 0.5
													? 'P'
													: 'S';
							}
							daysSinceLastHoliday++;
						}
					} else if (shift === 2) {
						if (holidayCount > 0) {
							const holidayChance = daysSinceLastHoliday >= 7 ? 0.5 : 0.1;
							const shouldAssignHoliday = Math.random() < holidayChance;

							if (shouldAssignHoliday && daysSinceLastHoliday >= 7) {
								nextShift = 'L';
								holidayCount--;
								daysSinceLastHoliday = 0;
								consecutiveP = 0;
								consecutiveS = 0;
							} else if (lastShift === '') {
								const randomNum = Math.floor(Math.random() * 3);
								nextShift = randomNum === 0 ? 'P' : randomNum === 1 ? 'M' : 'L';
								if (nextShift === 'L') {
									holidayCount--;
									daysSinceLastHoliday = 0;
									consecutiveP = 0;
									consecutiveS = 0;
								} else {
									daysSinceLastHoliday++;
								}
							} else if (lastShift === 'M') {
								nextShift = Math.random() < 0.1 && daysSinceLastHoliday >= 7 ? 'L' : 'M';
								if (nextShift === 'L') {
									holidayCount--;
									daysSinceLastHoliday = 0;
									consecutiveP = 0;
									consecutiveS = 0;
								} else {
									daysSinceLastHoliday++;
								}
							} else if (lastShift === 'L') {
								nextShift = Math.random() < 0.5 ? 'P' : 'S';
								daysSinceLastHoliday++;
								consecutiveP = nextShift === 'P' ? 1 : 0;
								consecutiveS = nextShift === 'S' ? 1 : 0;
							} else if (lastShift === 'P') {
								if (consecutiveP === 3) {
									nextShift = 'M';
									consecutiveP = 0;
								} else {
									nextShift = daysSinceLastHoliday >= 4 ? 'M' : Math.random() < 0.5 ? 'P' : 'S';
									if (nextShift === 'P') {
										consecutiveP++;
										consecutiveS = 0;
									} else if (nextShift === 'S') {
										consecutiveS++;
										consecutiveP = 0;
									} else {
										consecutiveP = 0;
										consecutiveS = 0;
									}
								}
								daysSinceLastHoliday++;
							}
						} else {
							if (lastShift === 'M') {
								nextShift = 'M';
							} else {
								nextShift = daysSinceLastHoliday >= 4 ? 'M' : Math.random() < 0.5 ? 'P' : 'S';
							}
							daysSinceLastHoliday++;
						}
					}

					// Track the shift counts for the day
					shiftCountPerDay[day][nextShift]++;

					// Update the employee's schedule
					schedule[employee].push(nextShift);
					lastShift = nextShift;

					if (nextShift !== 'L') {
						totalWorkDays[employee]++;
						remainingWorkDays--;
					}
				}
			});

			// Display the shift counts per day below the table
			displayShiftCounts(shiftCountPerDay);
		}
	};

	const displayShiftCounts = (shiftCountPerDay: any) => {
		// Implement your logic to display shiftCountPerDay below the generated shift table
		console.log(shiftCountPerDay);
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
		if (schedule[employee][day] == 'L' && newShift == 'L') {
			return;
		} else if (schedule[employee][day] == 'L' && newShift != 'L') {
			totalWorkDays[employee]++;
		} else if (schedule[employee][day] != 'L' && newShift == 'L') {
			totalWorkDays[employee]--;
		}
		shiftCountPerDay[day][schedule[employee][day]]--;
		schedule[employee][day] = newShift;
		editableShift = null;
		shiftCountPerDay[day][newShift]++;
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
					<th rowspan="2" class="border border-background px-2 py-3">No</th>
					<th rowspan="2" class="border border-background px-2 py-3">Nama Karyawan</th>
					{#each dayNames as day}
						<th class="border border-background px-2 py-3 text-center">{day.Name}</th>
					{/each}
					<th rowspan="2" class="border border-background px-2 py-3">Total</th>
				</tr>
				<tr>
					{#each dayNames as day}
						<th class="border border-background px-2 py-3 text-center">{day.Day}</th>
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
			<tfoot class="border-4 border-foreground">
				<tr>
					<td class="border border-foreground px-2 py-3" colspan="2">Total Shift Pagi (P)</td>
					{#each dayNames as _, index}
						<td class="border border-foreground px-2 py-3 text-center"
							>{shiftCountPerDay[index]?.P || 0}</td
						>
					{/each}
				</tr>
				<tr>
					<td class="border border-foreground px-2 py-3" colspan="2">Total Shift Siang (S)</td>
					{#each dayNames as _, index}
						<td class="border border-foreground px-2 py-3 text-center"
							>{shiftCountPerDay[index]?.S || 0}</td
						>
					{/each}
				</tr>
				<tr>
					<td class="border border-foreground px-2 py-3" colspan="2">Total Shift Malam (M)</td>
					{#each dayNames as _, index}
						<td class="border border-foreground px-2 py-3 text-center"
							>{shiftCountPerDay[index]?.M || 0}</td
						>
					{/each}
				</tr>
				<tr>
					<td class="border border-foreground px-2 py-3" colspan="2">Total Shift Libur (L)</td>
					{#each dayNames as _, index}
						<td class="border border-foreground px-2 py-3 text-center"
							>{shiftCountPerDay[index]?.L || 0}</td
						>
					{/each}
				</tr>
			</tfoot>
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
