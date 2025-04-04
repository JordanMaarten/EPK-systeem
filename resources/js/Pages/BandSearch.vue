<script setup>

import { ref } from 'vue';
import { Head } from '@inertiajs/vue3';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import TextInput from '@/Components/TextInput.vue';
import PrimaryButton from '@/Components/PrimaryButton.vue';
import SecondaryButton from '@/Components/SecondaryButton.vue';

const props = defineProps({
    bands: {
        type: Object
    },
});

// placeholder array
const band_cards = ref([
    {name: 'band 1', descryption: 'dit is de beschrijving van band 1MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM'}, 
    {name: 'band 2', descryption: 'dit is de beschrijving van band 2'}, 
    {name: 'band 3', descryption: 'dit is de beschrijving van band 3'}, 
    {name: 'band 4', descryption: 'dit is de beschrijving van band 4MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM'}, 
    {name: 'band 5', descryption: 'dit is de beschrijving van band 5'}, 
    {name: 'band 6', descryption: 'dit is de beschrijving van band 6'}, 
    {name: 'band 7', descryption: 'dit is de beschrijving van band 7MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM'}, 
    {name: 'band 8', descryption: 'dit is de beschrijving van band 8'}, 
    {name: 'band 9', descryption: 'dit is de beschrijving van band 9MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM'}, 
    {name: 'band 10', descryption: 'dit is de beschrijving van band 10'}, 
    {name: 'band 11', descryption: 'dit is de beschrijving van band 11'}, 
    {name: 'band 12', descryption: 'dit is de beschrijving van band 12'}, 
    {name: 'band 13', descryption: 'dit is de beschrijving van band 13MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM'}, 
    {name: 'band 14', descryption: 'dit is de beschrijving van band 14'}, 
]);

const searchterm = "";

</script>

<template>
    <Head title="Bands"/>

    <AuthenticatedLayout>
        <template #header>
            <h2 class="text-xl font-semibold leading-tight text-gray-800">
                Bands
            </h2>
            <h1></h1>
        </template>
        <div class="px-[8em]">
            <div class="relative pt-8 flex justify-center">
                <div class="w-[40em] flex">
                    <TextInput type="text" class="grow" v-model="searchterm"/>
                    <PrimaryButton class="ms-4 float-right">Zoeken</PrimaryButton>
                </div>
            </div>
        </div>
        <div class="px-[8em]">
            <div class="relative pt-8 overflow-auto">
                <div class="columns-4">
                    <div class="bg-white rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700 break-inside-avoid-column" v-for="(band_card, index) in band_cards" :class="{'mt-5' : index != 0}" :href="route('dashboard')">
                        <div class="relative">
                            <a href="">
                                <div class="absolute inset-0 shadow-[inset_0px_-30px_20px_-10px_rgba(31,41,55,1.0)]"></div>
                                <img class="rounded-t-lg" src="@/../assets/example.jpg" alt="">
                            </a>
                        </div>
                        <div class="p-5">
                            <a href="">
                                <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{{ band_card.name }}</h5>
                                <p class="mb-3 font-normal text-gray-700 dark:text-gray-400 break-words">   
                                    {{ band_card.descryption }}
                                </p>
                                <SecondaryButton @click="">Read more</SecondaryButton>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AuthenticatedLayout>
</template>