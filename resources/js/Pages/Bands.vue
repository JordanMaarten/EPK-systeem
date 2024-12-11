<script setup>

    import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
    import Table from '@/Components/Table.vue';
    import TableHeader from '@/Components/TableHeader.vue';
    import TableData from '@/Components/TableData.vue';
    import { Head } from '@inertiajs/vue3';

</script>

<template>
    <Head title="Bands"/>

    <AuthenticatedLayout>
        <template #header>
            <h2 class="text-xl font-semibold leading-tight text-gray-800">
                Bands
            </h2>
        </template>
        <div class="not-prose relative bg-slate-50 rounded-xl overflow-hidden dark:bg-slate-800/25">
            <div class="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]" style="background-position: 10px 10px;"></div>
            <div class="relative rounded-xl overflow-auto">
                <div class="shadow-sm overflow-hidden my-8">
                    <Table>
                        <template #thead>
                            <tr>
                                <TableHeader>Head1</TableHeader>
                                <TableHeader>Head2</TableHeader>
                                <TableHeader>Head3</TableHeader>
                                <TableHeader>Head4</TableHeader>
                            </tr>
                        </template>
                        <template #tbody>
                            <tr>
                                <TableData>Body1</TableData>
                                <TableData>Body2</TableData>
                                <TableData>Body3</TableData>
                                <TableData>Body4</TableData>
                            </tr>
                            <tr>
                                <TableData>Body5</TableData>
                                <TableData>Body6</TableData>
                                <TableData>Body7</TableData>
                                <TableData>Body8</TableData>
                            </tr>
                            <tr>
                                <TableData>Body9</TableData>
                                <TableData>Body10</TableData>
                                <TableData>Body11</TableData>
                                <TableData>Body12</TableData>
                            </tr>
                        </template>
                    </Table>
                </div>
            </div>
        </div>
    </AuthenticatedLayout>
</template>