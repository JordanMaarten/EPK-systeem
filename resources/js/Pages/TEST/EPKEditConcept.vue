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

    document.getElementById("addRow").addEventListener("click", (event) => {
        CMS.appendRow(content.value.getElementsByTagName("body")[0]);
    });

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
            <div id="content" ref="content">
                <body>
                    <testComponent></testComponent>
                </body>
            </div>
            <Divider/>
            <div class="flex justify-center">
                <SecondaryButton id="addRow" class="w-[36em] justify-center text-white !bg-emerald-500 !hover:bg-emerald-600">Add new row +</SecondaryButton>
            </div>
        </div>
    </AuthenticatedLayout>
</template>