<script setup>

import { onMounted, ref } from 'vue';
import { Head } from '@inertiajs/vue3';
import axios from 'axios';
import * as CMS from '@/Scripts/CMS';

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import SecondaryButton from '@/Components/SecondaryButton.vue';
import Divider from '@/Components/Divider.vue';
import LoadingSpinner from '@/Components/LoadingSpinner.vue';
import TextInput from '@/Components/TextInput.vue';

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

    // document.getElementsByTagName("AuthenticatedLayout").style.margin = document.getElementById("CMSSidebar").width

    // window.addEventListener("scroll", (event) => {
    //     console.log(document.getElementById("primaryNav").getBoundingClientRect().top);
    //     if (document.getElementById("primaryNav").getBoundingClientRect().bottom <= 0) {
    //         document.getElementById("primaryNav").style.marginBottom = document.getElementsByTagName('header')[0].offsetHeight + "px";
    //         document.getElementById("CMSSidebar").classList.remove("relative");
    //         document.getElementById("CMSSidebar").classList.add("fixed");
    //     } else {
    //         document.getElementById("primaryNav").style.marginBottom = "0px";
    //         document.getElementById("CMSSidebar").classList.remove("fixed");
    //         .classList.add("relative");
    //     }
    // })

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
    
    <!-- FIX THIS SHIT -->
    <div class="relative flex flex-start">
        <div id="CMSSidebar" class="relative w-[25em] bg-white border-e shadow-[0_2px_10px_rgba(0,0,0,0.15)] border-slate">
            <div class="fixed w-full">
                <div class="relative flex justify-between p-3 border-b border-slate">
                    <h2 class="text-lg">Overview</h2>
                    <a @click="CMS.hideElementsInId('overlay')" class="!p-1 text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="-1 0 25 25" fill="none">
                            <path d="M6.99486 7.00636C6.60433 7.39689 6.60433 8.03005 6.99486 8.42058L10.58 12.0057L6.99486 15.5909C6.60433 15.9814 6.60433 16.6146 6.99486 17.0051C7.38538 17.3956 8.01855 17.3956 8.40907 17.0051L11.9942 13.4199L15.5794 17.0051C15.9699 17.3956 16.6031 17.3956 16.9936 17.0051C17.3841 16.6146 17.3841 15.9814 16.9936 15.5909L13.4084 12.0057L16.9936 8.42059C17.3841 8.03007 17.3841 7.3969 16.9936 7.00638C16.603 6.61585 15.9699 6.61585 15.5794 7.00638L11.9942 10.5915L8.40907 7.00636C8.01855 6.61584 7.38538 6.61584 6.99486 7.00636Z" fill="#0F0F0F"/>
                        </svg>
                    </a>
                </div>
            
                <!-- Tab for element styling -->
                <div class="relative flex justify-center mt-5 py-1 border-b border-slate-300 shadow-sm">
                    <h3 class="">Styling</h3>
                </div>
                <div class="relative flex flex-col gap-2 justify-center mt-2">
                    <div class="relative flex justify-between px-3 pb-2 items-center border-b border-slate">
                        <span>font size:</span>
                        <span>
                            <TextInput type="number" class="w-20 h-8" placeholder="10"/>
                            <span class="ms-2">px</span>
                        </span>
                    </div>
                    <div class="relative flex justify-between px-3 pb-2 items-center border-b border-slate">
                        <span>font color:</span>
                        <span>
                            <TextInput type="text" class="w-40 h-8" placeholder="#000000"/>
                        </span>
                    </div>
                    <!-- <SecondaryButton class="justify-center mx-5 bg-slate-200 hover:bg-slate-300 !border-none">add style +</SecondaryButton> -->
                </div>
            </div>
        </div>
        <div class="relative">
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
                        <SecondaryButton @click="CMS.showSidebar('rowSelect')" class="w-[36em] justify-center text-white !bg-emerald-500 !hover:bg-emerald-600">Add new row +</SecondaryButton>
                    </div>
                    <div class="flex justify-center">
                        <SecondaryButton @click="CMS.appendElement('testpointer', 'p')" class="w-[16em] justify-center text-white !bg-emerald-500 !hover:bg-emerald-600">Add element test</SecondaryButton>
                    </div>
                    
                    <div class="h-[50em]"></div>
                </div>
            </AuthenticatedLayout>
        </div>
    </div>

</template>

<!-- 

<SecondaryButton @click="CMS.hideElementsInId('overlay')" class="absolute right-[-10px] top-[-10px] !p-1 text-center">
    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="-1 0 25 25" fill="none">
        <path d="M6.99486 7.00636C6.60433 7.39689 6.60433 8.03005 6.99486 8.42058L10.58 12.0057L6.99486 15.5909C6.60433 15.9814 6.60433 16.6146 6.99486 17.0051C7.38538 17.3956 8.01855 17.3956 8.40907 17.0051L11.9942 13.4199L15.5794 17.0051C15.9699 17.3956 16.6031 17.3956 16.9936 17.0051C17.3841 16.6146 17.3841 15.9814 16.9936 15.5909L13.4084 12.0057L16.9936 8.42059C17.3841 8.03007 17.3841 7.3969 16.9936 7.00638C16.603 6.61585 15.9699 6.61585 15.5794 7.00638L11.9942 10.5915L8.40907 7.00636C8.01855 6.61584 7.38538 6.61584 6.99486 7.00636Z" fill="#0F0F0F"/>
    </svg>
</SecondaryButton>

-->