<template>
    <div :class="$style.container">
        <h1>Create Connection</h1>

        <Dropdown label="Connection Type" :class="$style.connection_type" :items="items" v-model="selected"
            @update:model-value="clearForm">
        </Dropdown>

        <DynamicForm @submit="onCreate" @cancel="onCancel" v-if="selected"
            :fields="connectionTypes[selected.name as keyof typeof connectionTypes]" v-model="form">
        </DynamicForm>

    </div>
</template>

<script setup lang="ts">
import DynamicForm from '@/components/DynamicForm.vue';
import Dropdown from '@/components/atoms/DropdownInput.vue';
import { connectionTypes } from '@/entities/formFields';
import { ref } from 'vue';

const items = [
    {
        name: 'none',
        label: 'Select Provider'
    },
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

const selected = ref(items[0]);

const form = ref<any>({});
let vscode: any = null;

// for dev
if (import.meta.env.DEV) {
    (window as any).acquireVsCodeApi = () => ({
        postMessage: (args: any) => {
            console.log("Message: ", args);
        }
    });
}
if (!(window as any).acquireVsCodeApi) {
    console.log(window);
    console.error("No acquireVsCodeApi found. Please make sure the code is running in VS Code");
}
else {
    vscode = (window as any).acquireVsCodeApi();
}

function clearForm() {
    form.value = {};
}


function onCreate(data: any) {
    console.log("On Create: ", data);
    data = { ...data, authType: selected.value?.name }
    vscode?.postMessage({
        command: 'connection.create',
        data: data
    });
}

function onCancel() {
    console.log("On Cancel");
    vscode?.postMessage({
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
