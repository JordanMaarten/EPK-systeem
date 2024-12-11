<script setup>

</script>

<template>
    <table class="table-auto border-collapse w-full text-sm">
        <thead>
            <slot name="thead"/>
        </thead>
        <tbody class="bg-white dark:bg-slate-800">
            <slot name="tbody"/>
        </tbody>
    </table>
</template>