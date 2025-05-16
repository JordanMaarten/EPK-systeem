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
const saved_content = CMS.stringToDOM(props.saved_data);
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
            content.value.innerHTML = "Oops... Could not display saved content."
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

    document.getElementById("saveButton").addEventListener("click", () => saveHTML());

    
    const sidebar = document.getElementById("sidebar");
    const sidebar_content = sidebar.getElementsByClassName("content")[0];
    const primaryNav = document.getElementById("primaryNav");
    const header = document.getElementById("header");

    
    // Event handlers for resizable sidebar and header
    const sidebarObserver = new ResizeObserver(() => {
        sidebar_content.style.maxWidth = sidebar.offsetWidth + "px";
    });

    sidebarObserver.observe(sidebar);

    sidebar_content.style.maxWidth = sidebar.offsetWidth + "px";
    window.addEventListener("resize", (event) => {
        if (primaryNav.getBoundingClientRect().bottom <= 0) {
            header.style.width = primaryNav.offsetWidth + "px";
        } else {
            header.style.width = "100%";
        }
    })

    window.addEventListener("scroll", (event) => {
        if (primaryNav.getBoundingClientRect().bottom <= 0) {
            header.style.width = primaryNav.offsetWidth + "px";
        } else {
            header.style.width = "100%";
        }
    })

    // use later for automatic saving
    // setInterval(function () {
    //     console.log(content.value.innerHTML);
    // } , 5000);

    console.log(CMS.hooktest);

    CMS.onReady();
});

</script>

<template>
    <Head title="Test"/>
    
    <div class="relative flex w-full">
        <div id="sidebar" class="relative hidden lg:block lg:w-[50%] xl:w-[40%] 2xl:w-[30%] bg-white border-e shadow-[0_2px_10px_rgba(0,0,0,0.15)] border-slate overflow-hidden">
            <div class="content relative fixed min-w-[18em] w-full h-full overflow-hidden">
                <div class="relative flex justify-between p-3 border-b border-slate">
                    <h2 class="text-lg">Overview</h2>
                    <a @click="CMS.toggleHidden('sidebar')" class="!p-1 text-center cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="-1 0 25 25" fill="none">
                            <path d="M6.99486 7.00636C6.60433 7.39689 6.60433 8.03005 6.99486 8.42058L10.58 12.0057L6.99486 15.5909C6.60433 15.9814 6.60433 16.6146 6.99486 17.0051C7.38538 17.3956 8.01855 17.3956 8.40907 17.0051L11.9942 13.4199L15.5794 17.0051C15.9699 17.3956 16.6031 17.3956 16.9936 17.0051C17.3841 16.6146 17.3841 15.9814 16.9936 15.5909L13.4084 12.0057L16.9936 8.42059C17.3841 8.03007 17.3841 7.3969 16.9936 7.00638C16.603 6.61585 15.9699 6.61585 15.5794 7.00638L11.9942 10.5915L8.40907 7.00636C8.01855 6.61584 7.38538 6.61584 6.99486 7.00636Z" 
                            fill="#0F0F0F"/>
                        </svg>
                    </a>
                </div>
            
                <!-- Tab for element styling -->
                 <div>
                    <div class="relative flex justify-center mt-5 py-1 border-b border-slate-300 shadow-sm">
                        <h3>Rows</h3>
                    </div>
                    <div id="sidebar_rows" class="relative flex flex-col mt-2 mx-2 gap-3"></div>
                </div>
                <div class="relative flex justify-center mt-5 py-1 border-b border-slate-300 shadow-sm">
                    <h3>Global Styling</h3>
                </div>
                <div class="relative flex flex-col gap-2 justify-center mt-2">
                    <div class="relative flex justify-between px-3 pb-2 items-center border-b border-slate">
                        <span>font size:</span>
                        <span>
                            <TextInput type="number" class="w-20 h-8" placeholder="16" @input="(event) => CMS.updateStyle('fontSize', ((event.target.value < 50 && event.target.value > 0) ? event.target.value : '16') + 'px')"/>
                            <span class="ms-2">px</span>
                        </span>
                    </div>
                    <div class="relative flex justify-between px-3 pb-2 items-center border-b border-slate">
                        <span>font color:</span>
                        <span>
                            <span>#</span>
                            <TextInput type="number" class="w-40 h-8 ms-2" placeholder="000000" @input="(event) => CMS.updateStyle('color', '#' + ((event.target.value) ? event.target.value : '000000'))"/>
                        </span>
                    </div>
                    <!-- <SecondaryButton class="justify-center mx-5 bg-slate-200 hover:bg-slate-300 !border-none">add style +</SecondaryButton> -->
                </div>
            </div>
        </div>
        <div class="relative w-full overflow-hidden">
            <AuthenticatedLayout class="overflow-hidden">
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
                
                <div id="main" class="relative">
                    <SecondaryButton @click="CMS.toggleHidden('sidebar')" class="absolute top-0 left-0 mt-5 ms-5 !p-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" viewBox="0 0 24 24" fill="none">
                            <path d="M4 5L10 5M10 5C10 6.10457 10.8954 7 12 7C13.1046 7 14 6.10457 14 5M10 5C10 3.89543 10.8954 3 12 3C13.1046 3 14 3.89543 14 5M14 5L20 5M4 12H16M16 12C16 13.1046 16.8954 14 18 14C19.1046 14 20 13.1046 20 12C20 10.8954 19.1046 10 18 10C16.8954 10 16 10.8954 16 12ZM8 19H20M8 19C8 17.8954 7.10457 17 6 17C4.89543 17 4 17.8954 4 19C4 20.1046 4.89543 21 6 21C7.10457 21 8 20.1046 8 19Z" 
                            stroke="#000000" stroke-width="1.5" stroke-linecap="round"/>
                        </svg>
                    </SecondaryButton>
                    <div id="content" class="px-[100px]" ref="content"></div>
                    <Divider/>
                    <div class="flex justify-center">
                        <SecondaryButton @click="CMS.addRow()" class="text-white !bg-emerald-500 hover:!bg-emerald-600 shadow-sm">Add new row +</SecondaryButton>
                        <SecondaryButton @click="CMS.refreshRowList()" class="text-white !bg-emerald-500 hover:!bg-emerald-600 shadow-sm">Refresh</SecondaryButton>
                        <SecondaryButton @click="CMS.addElement('p', '741d735d502f6')" class="text-white !bg-emerald-500 hover:!bg-emerald-600 shadow-sm">Insert element</SecondaryButton>
                    </div>
                    <!-- <div class="flex justify-center">
                        <SecondaryButton @click="CMS.appendElement('testpointer', 'p')" class="px-12 text-white bg-emerald-500 hover:bg-emerald-600">Add element test</SecondaryButton>
                    </div> -->
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