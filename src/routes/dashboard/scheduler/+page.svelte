<script lang="ts">
	import { fade } from 'svelte/transition';
	import type { DateRange } from 'bits-ui';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Select from '$lib/components/ui/select';
	import { cn, hasDuplicates } from '$lib/utils';
	import { CalendarIcon } from 'lucide-svelte';
	import {
		CalendarDate,
		DateFormatter,
		type DateValue,
		getLocalTimeZone
	} from '@internationalized/date';
	import { RangeCalendar } from '$lib/components/ui/range-calendar/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import StepLevel from '$lib/components/EmployeeScheduler/StepLevel.svelte';
	import GeneratedTable from '$lib/components/EmployeeScheduler/GeneratedTable.svelte';

	let employeeCard = '/assets/images/EmployeeCard.png';
	let showAlert: boolean = $state(false);
	let firstPageAlert: boolean = $state(false);
	let secondPageAlert: boolean = $state(false);
	let thirdPageAlert: boolean = $state(false);

	let stepLevel: number = $state(1);

	let workDays: number = $state(0);
	let selectedShift = $state({ value: 0, label: 'Pilih Jumlah Shift' });
	let shifts: string[] = $state([]);
	let selectionDays: number[] = $state([]);

	// ====================================================================================== Step 1 (Set Variables) ============================================================================================
	// ==========================================================================================================================================================================================================
	let employee: number | null = $state(null);

	const now: Date = new Date();

	const day: number = now.getDate();
	const month: number = now.getMonth() + 1; // Months are zero-indexed, so add 1
	const year: number = now.getFullYear();
	let daysDifference: number = $state(0);

	const checkStepOne = () => {
		if (stepLevel == 1) {
			if (employee == null || employee < 3 || employee > 20) {
				firstPageAlert = true;
				showAlert = true;
				setTimeout(() => {
					showAlert = false;
					firstPageAlert = false;
				}, 2000);
				return false;
			} else if (selectedShift.value == 0) {
				firstPageAlert = true;
				showAlert = true;
				setTimeout(() => {
					showAlert = false;
					firstPageAlert = false;
				}, 2000);
				return false;
			} else if (daysDifference < 20 || daysDifference > 31) {
				firstPageAlert = true;
				showAlert = true;
				setTimeout(() => {
					showAlert = false;
					firstPageAlert = false;
				}, 2000);
				return false;
			}

			if (selectedShift.value == 2) {
				shifts = ['P', 'M'];
			} else {
				shifts = ['P', 'S', 'M'];
			}

			// Calculate the start and end range
			let start = daysDifference - 9;
			let end = daysDifference;

			// Create an array from start to end
			selectionDays = Array.from({ length: end - start + 1 }, (_, i) => start + i);

			nextStep();
		} else if (stepLevel == 2) {
			if (workDays == 0) {
				secondPageAlert = true;
				showAlert = true;
				setTimeout(() => {
					showAlert = false;
					secondPageAlert = false;
				}, 2000);
				return false;
			}
			if (employee != null) {
				employeeNames = Array(employee).fill('');
			}
			nextStep();
		} else if (stepLevel == 3) {
			if (hasEmptyValue() || hasDuplicates(employeeNames)) {
				thirdPageAlert = true;
				showAlert = true;
				setTimeout(() => {
					showAlert = false;
					thirdPageAlert = false;
				}, 2000);
				return false;
			}
			nextStep();
		}
	};

	const nextStep = () => {
		stepLevel += 1;
		if (stepLevel > 4) {
			stepLevel = 4;
		}
	};

	const backStep = () => {
		stepLevel -= 1;
		if (stepLevel < 1) {
			stepLevel = 1;
		}
	};

	const handleInputEmployee = (event: Event): void => {
		const target = event.target as HTMLInputElement;
		const value = target.value;

		// Temporarily allow any input
		if (value === '') {
			employee = null;
		} else {
			employee = Number(value);
		}
	};

	const validateEmployee = (event: Event): void => {
		const target = event.target as HTMLInputElement;
		const value = target.value;
		const numberValue = Number(value);

		// Check if the number value is less than 3 or greater than 20
		if (isNaN(numberValue) || numberValue < 3 || numberValue > 20) {
			employee = null;
			target.value = '';
		} else {
			employee = numberValue;
			target.value = employee.toString();
		}
	};

	const df = new DateFormatter('en-US', {
		dateStyle: 'medium'
	});

	let value: DateRange | undefined = $state({
		start: new CalendarDate(year, month, day),
		end: new CalendarDate(year, month, day).add({ days: 20 })
	});

	let startValue: DateValue | undefined = $state(undefined);

	// Function to calculate the difference between two dates
	const calculateDateDifference = (
		startDay?: number,
		startMonth?: number,
		startYear?: number,
		endDay?: number,
		endMonth?: number,
		endYear?: number
	): void => {
		// Check if all date components are provided
		if (
			startDay === undefined ||
			startMonth === undefined ||
			startYear === undefined ||
			endDay === undefined ||
			endMonth === undefined ||
			endYear === undefined
		) {
			return;
		}

		// Create Date objects
		const startDate = new Date(startYear, startMonth, startDay);
		const endDate = new Date(endYear, endMonth, endDay);

		// Calculate difference in milliseconds
		const differenceInMs = endDate.getTime() - startDate.getTime();

		// Convert milliseconds to days
		const msPerDay = 24 * 60 * 60 * 1000; // Number of milliseconds in a day
		daysDifference = Math.floor(differenceInMs / msPerDay);
	};
	// ====================================================================================== Step 3 (Input Employee Name) ======================================================================================
	// ==========================================================================================================================================================================================================

	let employeeNames: string[] = $state([]);

	// Function to handle changes in input fields
	const updateEmployeeName = (index: number, event: Event): void => {
		const target = event.target as HTMLInputElement;
		employeeNames[index] = target.value;
	};

	// Function to check if any value is empty
	const hasEmptyValue = (): boolean => employeeNames.some((value) => value.trim() === '');

	$effect(() => {
		document.title = 'Employee Scheduler';

		calculateDateDifference(
			value?.start?.day,
			value?.start?.month,
			value?.start?.year,
			value?.end?.day,
			value?.end?.month,
			value?.end?.year
		);
	});
</script>

<div class="min-h-[365px] px-4 py-4 md:px-12">
	{#if showAlert}
		<div class="fixed right-5 top-8 z-50" transition:fade={{ duration: 200 }}>
			<div
				class="mb-4 flex w-[350px] rounded-lg bg-red-50 p-4 text-sm text-red-800 dark:bg-gray-800 dark:text-red-400"
				role="alert"
			>
				<svg
					class="me-3 mt-[2px] inline h-4 w-4 flex-shrink-0"
					aria-hidden="true"
					xmlns="http://www.w3.org/2000/svg"
					fill="currentColor"
					viewBox="0 0 20 20"
				>
					<path
						d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"
					/>
				</svg>
				<span class="sr-only">Danger</span>
				<div>
					{#if firstPageAlert}
						<span class="font-medium">Pastikan persyaratan ini terpenuhi:</span>
						<ul class="mt-1.5 list-inside list-disc">
							<li>Minimal masukkan 3 karyawan</li>
							<li>Minimal masukkan 2 shift</li>
							<li>Periode minimal 20 hari dan maksimal 31 hari</li>
						</ul>
					{:else if secondPageAlert}
						<span class="font-medium">Pilih hari kerja</span>
					{:else if thirdPageAlert}
						<span class="font-medium">Pastikan persyaratan ini terpenuhi:</span>
						<ul class="mt-1.5 list-inside list-disc">
							<li>Masukkan seluruh karyawan pada setiap input</li>
							<li>
								Tidak ada nama karyawan yang sama (Gunakan nomor, jika terdapat nama yang sama)
							</li>
						</ul>
					{/if}
				</div>
			</div>
		</div>
	{/if}
	<div class="mb-12 flex flex-col items-center justify-center gap-3">
		<h1 class="text-4xl font-bold">Selamat Datang,</h1>
		<p class="text-center text-lg text-muted-foreground">
			Ayo coba mulai dengan buat aturan untuk generate otomatis penjadwalan karyawanmu.
		</p>
	</div>
	<StepLevel {stepLevel} />
	{#if stepLevel == 1}
		<div class="mt-12 flex flex-col rounded-lg shadow-lg">
			<div
				class="flex w-full items-center justify-center rounded-t-lg bg-foreground py-2 text-background"
			>
				<h1 class="text-2xl font-bold">Step {stepLevel}</h1>
			</div>
			<div class="flex flex-col rounded-b-lg bg-background px-3 py-4 md:px-6">
				<h1 class="text-2xl font-bold">Karyawan & Shift</h1>
				<p class="text-md mb-6">Ayo masukkan jumlah karyawan dan shift yang mau kamu buat</p>
				<div class="mb-4 grid w-full grid-cols-1 gap-3 lg:grid-cols-3">
					<div class="flex flex-col gap-2 rounded-md border-foreground p-8 md:border">
						<img src={employeeCard} alt="employee" class="mb-2 hidden w-full md:block" />
						<label for="jumlahKaryawan" class="font-semibold"> Jumlah Karyawan</label>
						<input
							type="number"
							placeholder="Masukkan Jumlah Karyawan (Min 3 & Max 20)"
							class="rounded-sm border border-muted-foreground px-4 py-2"
							oninput={handleInputEmployee}
							onblur={validateEmployee}
							min="3"
							max="20"
							bind:value={employee}
						/>
					</div>
					<div class="flex flex-col gap-2 rounded-md border-foreground p-8 md:border">
						<img src={employeeCard} alt="employee" class="mb-2 hidden w-full md:block" />
						<label for="jumlahKaryawan" class="font-semibold"> Jumlah Shift </label>
						<Select.Root bind:selected={selectedShift}>
							<Select.Trigger class="w-full">
								<Select.Value placeholder="Pilih Jumlah Shift" />
							</Select.Trigger>
							<Select.Content>
								<Select.Item value="2">2 (Pagi & Malam)</Select.Item>
								<Select.Item value="3">3 (Pagi, Siang, dan Malam)</Select.Item>
							</Select.Content>
						</Select.Root>
					</div>
					<div class="flex flex-col gap-2 rounded-md border-foreground p-8 md:border">
						<img src={employeeCard} alt="employee" class="mb-2 hidden w-full md:block" />
						<label for="jumlahKaryawan" class="font-semibold"> Periode </label>
						<div class="grid gap-2">
							<Popover.Root openFocus>
								<Popover.Trigger asChild let:builder>
									<Button
										variant="outline"
										class={cn(
											'w-full justify-start text-left font-normal',
											!value && 'text-muted-foreground'
										)}
										builders={[builder]}
									>
										<CalendarIcon class="mr-2 h-4 w-4" />
										{#if value && value.start}
											{#if value.end}
												{df.format(value.start.toDate(getLocalTimeZone()))} - {df.format(
													value.end.toDate(getLocalTimeZone())
												)}
												<p class="ml-2">({daysDifference} Hari)</p>
											{:else}
												{df.format(value.start.toDate(getLocalTimeZone()))}
											{/if}
										{:else if startValue}
											{df.format(startValue.toDate(getLocalTimeZone()))}
										{:else}
											Pick a date
										{/if}
									</Button>
								</Popover.Trigger>
								<Popover.Content class="w-auto p-0" align="start">
									<RangeCalendar
										bind:value
										bind:startValue
										initialFocus
										numberOfMonths={2}
										placeholder={value?.start}
									/>
								</Popover.Content>
							</Popover.Root>
						</div>
					</div>
				</div>
				<div class="flex justify-end">
					<button
						onclick={checkStepOne}
						class="mb-2 rounded-md bg-foreground px-3 py-2 font-semibold text-background md:px-5"
						>Next</button
					>
				</div>
			</div>
		</div>
	{:else if stepLevel == 2}
		<div class="mt-12 flex flex-col rounded-lg shadow-lg">
			<div
				class="flex w-full items-center justify-center rounded-t-lg bg-foreground py-2 text-background"
			>
				<h1 class="text-2xl font-bold">Step {stepLevel}</h1>
			</div>
			<div class="flex flex-col rounded-b-lg bg-background px-4 py-4 md:px-6">
				<h1 class="text-2xl font-bold">Hari Kerja</h1>
				<p class="text-md mb-6">Pilih jumlah hari kerja karyawan dalam satu periode</p>
				<div
					class="mb-6 grid grid-cols-2 gap-4 px-5 text-lg sm:grid-cols-3 md:text-2xl lg:grid-cols-5"
				>
					{#each selectionDays as day}
						<div class="flex items-center justify-center gap-3">
							<input type="radio" name="workDays" value={day} bind:group={workDays} /><label
								for="workDays">{day} Hari Kerja</label
							>
						</div>
					{/each}
				</div>
				<div class="mt-4 flex justify-end">
					<div class="flex gap-2">
						<button
							onclick={backStep}
							class="mb-2 rounded-md bg-muted-foreground px-4 py-2 font-semibold text-background md:px-5"
							>Back</button
						>
						<button
							onclick={checkStepOne}
							class="mb-2 rounded-md bg-foreground px-4 py-2 font-semibold text-background md:px-5"
							>Next</button
						>
					</div>
				</div>
			</div>
		</div>
	{:else if stepLevel == 3}
		<div class="mt-12 flex flex-col rounded-lg shadow-lg">
			<div
				class="flex w-full items-center justify-center rounded-t-lg bg-foreground py-2 text-background"
			>
				<h1 class="text-2xl font-bold">Step {stepLevel}</h1>
			</div>
			<div class="flex flex-col rounded-b-lg bg-background px-4 py-4 md:px-6">
				<h1 class="text-2xl font-bold">Karyawan</h1>
				<p class="text-md mb-6">Langkah terakhir, ayo masukkan nama-nama karyawan</p>
				<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
					{#each employeeNames as val, i}
						<div class="flex flex-col gap-1">
							<label for="jumlahKaryawan" class="ml-2 font-semibold">Nama Karyawan {i + 1}</label>
							<input
								type="text"
								placeholder="Masukkan Nama Karyawan"
								class="rounded-sm border border-muted-foreground px-4 py-2"
								value={val}
								oninput={(event) => updateEmployeeName(i, event)}
							/>
						</div>
					{/each}
				</div>
				<div class="mt-4 flex justify-end">
					<div class="flex gap-2">
						<button
							onclick={backStep}
							class="mb-2 rounded-md bg-muted-foreground px-4 py-2 font-semibold text-background md:px-5"
							>Back</button
						>
						<button
							onclick={checkStepOne}
							class="mb-2 rounded-md bg-foreground px-4 py-2 font-semibold text-background md:px-5"
							>Next</button
						>
					</div>
				</div>
			</div>
		</div>
	{:else if stepLevel == 4}
		<GeneratedTable
			{workDays}
			shift={selectedShift.value}
			shiftName={shifts}
			employeeNumber={employee}
			employees={employeeNames}
			days={daysDifference}
		/>
	{/if}
</div>
