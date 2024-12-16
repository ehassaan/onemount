<template>
    <div class="container">
        <h1 class="heading">Create Connection</h1>

        <Dropdown label="Connection Type" class="connection-type" :items="items" v-model="selected"></Dropdown>

        <ConnectionForm v-if="selected" :connection-type="selected.name"></ConnectionForm>

    </div>
</template>

<script setup lang="ts">
import ConnectionForm from '@/components/ConnectionForm.vue';
import Dropdown from '@/components/Dropdown.vue';
import { ref } from 'vue';

const selected = ref();

const items = [
    {
        name: 'minio',
        label: 'Minio',
    },
    {
        name: 'blob',
        label: 'Azure Blob Storage',
    },
    {
        name: 'aws_s3',
        label: 'AWS S3',
    },
    {
        name: 'gcs',
        label: 'Google Cloud Storage',
    },
];
</script>

<style scoped lang="css">
.container {
    display: flex;
    flex-direction: column;
    align-items: start;
    padding: 15px;
}

.connection-type {
    width: auto;
}
</style>
