<script setup>

import { onMounted, ref } from 'vue';
import { Head } from '@inertiajs/vue3';
import { useForm } from '@inertiajs/vue3';

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import PrimaryButton from '@/Components/PrimaryButton.vue';

const submit = () => {
    form.post(route('testController'), {

    });
};

const form = useForm({
    html: '',
});

//bruh, duurt me gewoon een hele dag smh

const content = ref();
const old_content = new DOMParser().parseFromString('<h1>Lorem ipsum dolor sit amet consectetur adipisicing elit.</h1><p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Illo aliquid veritatis enim ad? Ea possimus, neque fugiat ut earum nihil nulla autem totam repudiandae iste beatae nobis in voluptatem eveniet.</p>', "text/html").body;

onMounted(() => {
    document.getElementById("content").appendChild(old_content);
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
                <PrimaryButton
                    :class="{ 'opacity-25': form.processing }"
                    :disabled="form.processing"
                >
                    Save
                </PrimaryButton>
            </form>
        </div>
    </AuthenticatedLayout>
</template>