<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import { Package, CreditCard, DollarSign, Users, ArrowUpRight } from 'lucide-svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import DashboardCard from '$lib/components/Dashboard/DashboardCard.svelte';
</script>

<main class="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
	<div class="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
		<DashboardCard
			icon={DollarSign}
			title="Total Revenue"
			body={45392.21}
			desc="+20.1% from last month"
			format="currency"
		/>
		<DashboardCard
			icon={Users}
			title="Subscriptions"
			body={2350}
			desc="+180.1% from last month"
			format="number"
		/>
		<DashboardCard
			icon={CreditCard}
			title="Sales"
			body={12234}
			desc="+19% from last month"
			format="number"
		/>
		<DashboardCard
			icon={Package}
			title="Active Products"
			body={573}
			desc="+201 from last month"
			format="number"
		/>
	</div>
	<div class="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
		<Card.Root
			class="xl:col-span-2"
			data-x-chunk-name="dashboard-01-chunk-4"
			data-x-chunk-description="A card showing a table of recent transactions with a link to view all transactions."
		>
			<Card.Header class="flex flex-row items-center">
				<div class="grid gap-2">
					<Card.Title>Transactions</Card.Title>
					<Card.Description>Recent transactions from your store.</Card.Description>
				</div>
				<Button href="##" size="sm" class="ml-auto gap-1">
					View All
					<ArrowUpRight class="h-4 w-4" />
				</Button>
			</Card.Header>
			<Card.Content>
				<Table.Root>
					<Table.Header>
						<Table.Row>
							<Table.Head>Customer</Table.Head>
							<Table.Head class="xl:table.-column hidden">Type</Table.Head>
							<Table.Head class="xl:table.-column hidden">Status</Table.Head>
							<Table.Head class="xl:table.-column hidden">Date</Table.Head>
							<Table.Head class="text-right">Amount</Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						<Table.Row>
							<Table.Cell>
								<div class="font-medium">Liam Johnson</div>
								<div class="hidden text-sm text-muted-foreground md:inline">liam@example.com</div>
							</Table.Cell>
							<Table.Cell class="xl:table.-column hidden">Sale</Table.Cell>
							<Table.Cell class="xl:table.-column hidden">
								<Badge class="text-xs" variant="outline">Approved</Badge>
							</Table.Cell>
							<Table.Cell class="md:table.-cell xl:table.-column hidden lg:hidden">
								2023-06-23
							</Table.Cell>
							<Table.Cell class="text-right">$250.00</Table.Cell>
						</Table.Row>
						<Table.Row>
							<Table.Cell>
								<div class="font-medium">Olivia Smith</div>
								<div class="hidden text-sm text-muted-foreground md:inline">olivia@example.com</div>
							</Table.Cell>
							<Table.Cell class="xl:table.-column hidden">Refund</Table.Cell>
							<Table.Cell class="xl:table.-column hidden">
								<Badge class="text-xs" variant="outline">Declined</Badge>
							</Table.Cell>
							<Table.Cell class="md:table.-cell xl:table.-column hidden lg:hidden">
								2023-06-24
							</Table.Cell>
							<Table.Cell class="text-right">$150.00</Table.Cell>
						</Table.Row>
						<Table.Row>
							<Table.Cell>
								<div class="font-medium">Noah Williams</div>
								<div class="hidden text-sm text-muted-foreground md:inline">noah@example.com</div>
							</Table.Cell>
							<Table.Cell class="xl:table.-column hidden">Subscription</Table.Cell>
							<Table.Cell class="xl:table.-column hidden">
								<Badge class="text-xs" variant="outline">Approved</Badge>
							</Table.Cell>
							<Table.Cell class="md:table.-cell xl:table.-column hidden lg:hidden">
								2023-06-25
							</Table.Cell>
							<Table.Cell class="text-right">$350.00</Table.Cell>
						</Table.Row>
						<Table.Row>
							<Table.Cell>
								<div class="font-medium">Emma Brown</div>
								<div class="hidden text-sm text-muted-foreground md:inline">emma@example.com</div>
							</Table.Cell>
							<Table.Cell class="xl:table.-column hidden">Sale</Table.Cell>
							<Table.Cell class="xl:table.-column hidden">
								<Badge class="text-xs" variant="outline">Approved</Badge>
							</Table.Cell>
							<Table.Cell class="md:table.-cell xl:table.-column hidden lg:hidden">
								2023-06-26
							</Table.Cell>
							<Table.Cell class="text-right">$450.00</Table.Cell>
						</Table.Row>
						<Table.Row>
							<Table.Cell>
								<div class="font-medium">Liam Johnson</div>
								<div class="hidden text-sm text-muted-foreground md:inline">liam@example.com</div>
							</Table.Cell>
							<Table.Cell class="xl:table.-column hidden">Sale</Table.Cell>
							<Table.Cell class="xl:table.-column hidden">
								<Badge class="text-xs" variant="outline">Approved</Badge>
							</Table.Cell>
							<Table.Cell class="md:table.-cell xl:table.-column hidden lg:hidden">
								2023-06-27
							</Table.Cell>
							<Table.Cell class="text-right">$550.00</Table.Cell>
						</Table.Row>
					</Table.Body>
				</Table.Root>
			</Card.Content>
		</Card.Root>
		<Card.Root
			data-x-chunk-name="dashboard-01-chunk-5"
			data-x-chunk-description="A card showing a list of recent sales with customer names and email addresses."
		>
			<Card.Header>
				<Card.Title>Recent Sales</Card.Title>
			</Card.Header>
			<Card.Content class="grid gap-8">
				<div class="flex items-center gap-4">
					<Avatar.Root class="hidden h-9 w-9 sm:flex">
						<Avatar.Image src="/avatars/01.png" alt="Avatar" />
						<Avatar.Fallback>OM</Avatar.Fallback>
					</Avatar.Root>
					<div class="grid gap-1">
						<p class="text-sm font-medium leading-none">Olivia Martin</p>
						<p class="text-sm text-muted-foreground">olivia.martin@email.com</p>
					</div>
					<div class="ml-auto font-medium">+$1,999.00</div>
				</div>
				<div class="flex items-center gap-4">
					<Avatar.Root class="hidden h-9 w-9 sm:flex">
						<Avatar.Image src="/avatars/02.png" alt="Avatar" />
						<Avatar.Fallback>JL</Avatar.Fallback>
					</Avatar.Root>
					<div class="grid gap-1">
						<p class="text-sm font-medium leading-none">Jackson Lee</p>
						<p class="text-sm text-muted-foreground">jackson.lee@email.com</p>
					</div>
					<div class="ml-auto font-medium">+$39.00</div>
				</div>
				<div class="flex items-center gap-4">
					<Avatar.Root class="hidden h-9 w-9 sm:flex">
						<Avatar.Image src="/avatars/03.png" alt="Avatar" />
						<Avatar.Fallback>IN</Avatar.Fallback>
					</Avatar.Root>
					<div class="grid gap-1">
						<p class="text-sm font-medium leading-none">Isabella Nguyen</p>
						<p class="text-sm text-muted-foreground">isabella.nguyen@email.com</p>
					</div>
					<div class="ml-auto font-medium">+$299.00</div>
				</div>
				<div class="flex items-center gap-4">
					<Avatar.Root class="hidden h-9 w-9 sm:flex">
						<Avatar.Image src="/avatars/04.png" alt="Avatar" />
						<Avatar.Fallback>WK</Avatar.Fallback>
					</Avatar.Root>
					<div class="grid gap-1">
						<p class="text-sm font-medium leading-none">William Kim</p>
						<p class="text-sm text-muted-foreground">will@email.com</p>
					</div>
					<div class="ml-auto font-medium">+$99.00</div>
				</div>
				<div class="flex items-center gap-4">
					<Avatar.Root class="hidden h-9 w-9 sm:flex">
						<Avatar.Image src="/avatars/05.png" alt="Avatar" />
						<Avatar.Fallback>SD</Avatar.Fallback>
					</Avatar.Root>
					<div class="grid gap-1">
						<p class="text-sm font-medium leading-none">Sofia Davis</p>
						<p class="text-sm text-muted-foreground">sofia.davis@email.com</p>
					</div>
					<div class="ml-auto font-medium">+$39.00</div>
				</div>
			</Card.Content>
		</Card.Root>
	</div>
</main>
