<template>
    <div :class="$style.container">
        <h1>Create Connection</h1>

        <Dropdown label="Connection Type" :class="$style.connection_type" :items="items" v-model="selected">
        </Dropdown>

        <ConnectionForm v-if="selected" :connection-type="selected?.name" @submit="onCreate" @cancel="onCancel">
        </ConnectionForm>

    </div>
</template>

<script setup lang="ts">
import ConnectionForm from '@/components/ConnectionForm.vue';
import Dropdown from '@/components/atoms/DropdownInput.vue';
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

// for dev
if (import.meta.env.DEV) {
    (window as any).acquireVsCodeApi = () => ({
        postMessage: (args: any) => {
            console.log("Message: ", args);
        }
    });
}

const vscode = (window as any).acquireVsCodeApi();

function onCreate(data: any) {
    vscode.postMessage({
        command: 'connection.create',
        data: data
    });
}

function onCancel() {
    vscode.postMessage({
        command: 'cancel',
    });
}

</script>

<style module>
.container {
    display: flex;
    flex-direction: column;
    align-items: start;
    padding: 25px;
    margin: 10px;
    background-color: var(--dl-editor-background);
    color: var(--dt-editor-foreground);
}

.connection_type {
    width: 350px;
    margin: 0 20px 20px 0;
}
</style>
