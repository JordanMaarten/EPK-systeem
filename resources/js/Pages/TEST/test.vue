<script setup>

import { onMounted, ref } from 'vue';
import { Head } from '@inertiajs/vue3';
import { useForm } from '@inertiajs/vue3';

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import PrimaryButton from '@/Components/PrimaryButton.vue';
import SecondaryButton from '@/Components/SecondaryButton.vue';

const submit = () => {
    form.post(route('testController'), {

    });
};

const form = useForm({
    html: '',
    processing: false,
});

const content = ref();
const saved_content = new DOMParser().parseFromString('<div class="content_body"><h1>Lorem ipsum dolor sit amet consectetur adipisicing elit.</h1><p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Illo aliquid veritatis enim ad? Ea possimus, neque fugiat ut earum nihil nulla autem totam repudiandae iste beatae nobis in voluptatem eveniet.</p></div>', 'text/html').body;
const parse_error = saved_content.querySelector("parsererror");

function HTMLtoString() {
    let content_string = content.value.innerHTML;
    console.log(content_string);
}

onMounted(() => {
    if (parse_error) 
    {
        console.log("parse error: process aborted");
    } else 
    {
        try 
        {
            console.log("Successfuly displayed saved content")
            document.getElementById("content").appendChild(saved_content.firstChild);
        } catch 
        {
            console.log('Error while appending child to element with id = "content".');
            document.getElementById("content").innerHTML = "Oops something went wrong... Could not display saved content."
        }
    }
});

setInterval(function () {
    
}, 1000);

</script>

<template>
    <Head title="Test"/>

    <AuthenticatedLayout>
        <template #header>
            <h2 class="text-xl font-semibold leading-tight text-gray-800">
                Test
            </h2>
        </template>
        <div class="px-[8em]">
            <form @submit.prevent="submit">
                <div id="content" ref="content"></div>
                <SecondaryButton @click="HTMLtoString()">Save</SecondaryButton>
                <!-- <PrimaryButton
                    :class="{ 'opacity-25': form.processing }"
                    :disabled="form.processing"
                >
                    Save
                </PrimaryButton> -->
            </form>
        </div>
    </AuthenticatedLayout>
</template>