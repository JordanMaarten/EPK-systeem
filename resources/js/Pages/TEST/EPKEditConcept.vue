<script setup>

import { onMounted, ref } from 'vue';
import { Head } from '@inertiajs/vue3';
import axios from 'axios';
import * as CMS from '@/Scripts/CMS';

import testComponent from '@/Components/test/testComponent.vue';

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import SecondaryButton from '@/Components/SecondaryButton.vue';
import Divider from '@/Components/Divider.vue';
import LoadingSpinner from '@/Components/LoadingSpinner.vue';

const props = defineProps({
    epk_id: String, 
    saved_data: String
});

const content = ref();
const saved_content = new DOMParser().parseFromString(props.saved_data, 'text/html').body;
const parse_error = saved_content.querySelector("parsererror");

const savingHTML = ref(false);

onMounted(() => {
    if (parse_error) 
    {
        console.log("parse error: process aborted");
    } else 
    {
        try 
        {
            console.log("Successfuly displayed saved content")
            content.value.appendChild(saved_content);
        } catch 
        {
            console.log('Error while appending child to element with id = "content".');
            content.value.innerHTML = "Oops something went wrong... Could not display saved content."
        }
    }

    function saveHTML() {
        savingHTML.value = true;
        
        axios.post('/test/store', {
            epk_id: props.epk_id,
            data: content.value.innerHTML
        }).then(function (response) {
            console.log(response);
            console.log("Succesfully saved data to DB");
        }).catch(function (response) {
            console.log(response);
        }).finally(() => {
            savingHTML.value = false;
        });
    }

    document.getElementById("saveButton").addEventListener("click", (event) => {
        saveHTML();
    });

    // document.getElementById("addRow").addEventListener("click", (event) => {
    //     CMS.addRow(content.value.getElementsByTagName("body")[0]);
    // });

    // use later for automatic saving
    setInterval(function () {
    
    } , 5000);

    console.log(CMS.hooktest);
});

</script>

<template>
    <Head title="Test"/>

    <AuthenticatedLayout>
        <template #header>
            <div class="flex justify-between">
                <h2 class="text-xl font-semibold leading-tight text-gray-800">
                    Test
                </h2>
                <span class="inline-flex justify-between items-center gap-4">
                    <LoadingSpinner :class="{hidden : !savingHTML}"></LoadingSpinner>
                    <SecondaryButton id="saveButton">Save</SecondaryButton>
                </span>
            </div>
        </template>
        <div id="main" class="px-[8em]">
            <div id="content" ref="content"></div>
            <Divider/>
            <div class="flex justify-center">
                <SecondaryButton @click="CMS.showElement('rowSelect')" class="w-[36em] justify-center text-white !bg-emerald-500 !hover:bg-emerald-600">Add new row +</SecondaryButton>
            </div>
        </div>
        <div id="overlay" class="hidden absolute top-0 left-0 w-full h-full bg-slate-200/75 px-[8em]" aria-hide>
            <div @click="CMS.hideElementsInId('overlay')" class="z-10 absolute top-0 left-0 w-full h-full"></div>
            <div class="relative flex w-full h-full">
                <div class="hidden z-50 flex relative justify-center gap-5 p-5 m-auto border-2 border-black border-dashed rounded" aria-hide aria-trigger="rowSelect">
                    <div @click="CMS.addRow('content')" class="bg-white w-[7em] h-[7em]"></div>
                    <div class="bg-white w-[7em] h-[7em]"></div>
                    <div class="bg-white w-[7em] h-[7em]"></div>
                    <div class="bg-white w-[7em] h-[7em]"></div>
                    <SecondaryButton @click="CMS.hideElementsInId('overlay')" class="absolute right-[-10px] top-[-10px] !p-1 text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="-1 0 25 25" fill="none">
                            <path d="M6.99486 7.00636C6.60433 7.39689 6.60433 8.03005 6.99486 8.42058L10.58 12.0057L6.99486 15.5909C6.60433 15.9814 6.60433 16.6146 6.99486 17.0051C7.38538 17.3956 8.01855 17.3956 8.40907 17.0051L11.9942 13.4199L15.5794 17.0051C15.9699 17.3956 16.6031 17.3956 16.9936 17.0051C17.3841 16.6146 17.3841 15.9814 16.9936 15.5909L13.4084 12.0057L16.9936 8.42059C17.3841 8.03007 17.3841 7.3969 16.9936 7.00638C16.603 6.61585 15.9699 6.61585 15.5794 7.00638L11.9942 10.5915L8.40907 7.00636C8.01855 6.61584 7.38538 6.61584 6.99486 7.00636Z" fill="#0F0F0F"/>
                        </svg>
                    </SecondaryButton>
                </div>
            </div>
        </div>
    </AuthenticatedLayout>
</template>