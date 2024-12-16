<template>
    <div class="container">

        <form class="form">

            <InputField label="Name" :required="true" class="field" placeholder="myconnection"></InputField>
            <InputField label="Remote URI" :required="true" placeholder="https://example.com"></InputField>
            <InputField label="Local Path" placeholder="./ducklake/"></InputField>

            <Dropdown class="field" label="Authentication Type" v-model="authType"
                :items="authTypes[props.connectionType]">
            </Dropdown>

            <InputField v-if="authType?.name === 'sas_token'" label="SAS Token" type="password" v-model="auth.sasToken"
                class="field">
            </InputField>
            <InputField v-if="authType?.name === 'account_key'" label="Account Key" type="password" class="field"
                v-model="auth.accountKey"></InputField>

            <template v-if="authType?.name === 'service_principal'">
                <InputField label="Tenant ID" class="field" v-model="auth.tenantId"></InputField>
                <InputField label="Subscription ID" class="field" v-model="auth.subscriptionId"></InputField>
                <InputField label="Client ID" class="field" v-model="auth.spId"></InputField>
                <InputField type="password" class="field" label="Client Secret" v-model="auth.spSecret"></InputField>
            </template>

            <template v-if="authType?.name === 'iam_user'">
                <InputField label="Access Key ID" class="field" v-model="auth.iamAccessKeyId"></InputField>
                <InputField type="password" class="field" label="Secret Access Key" v-model="auth.iamSecretKey">
                </InputField>
            </template>

        </form>
    </div>
</template>

<script setup lang="ts">
import { ref, type PropType } from 'vue';
import Dropdown from './Dropdown.vue';
import InputField from './InputField.vue';

const props = defineProps({
    connectionType: {
        type: String as PropType<'blob' | 'minio' | 'gcs' | 'aws_s3'>,
        required: true
    }
});

const s3AuthTypes = [
    {
        name: 'env_auth',
        label: 'ENV Auth (CLI / Environment variables)'
    },
    {
        name: 'iam_user',
        label: 'IAM User'
    },
];

const authTypes = {
    blob: [
        {
            name: 'env_auth',
            label: 'ENV Auth (CLI / Environment variables)'
        },
        {
            name: 'account_key',
            label: 'Account Key'
        },
        {
            name: 'sas_token',
            label: 'SAS Token'
        },
        {
            name: 'service_principal',
            label: 'Service Principal'
        }
    ],
    minio: s3AuthTypes,
    gcs: s3AuthTypes,
    aws_s3: s3AuthTypes
};

const authType = ref(authTypes[props.connectionType][0]);

const auth = ref({
    sasToken: '',
    accountKey: '',
    spId: '',
    spSecret: '',
    tenantId: '',
    subscriptionId: '',
    iamAccessKeyId: '',
    iamSecretKey: '',
});

</script>

<style scoped>
.form {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    width: 100%;
    margin: 25px;
}

.form .field {
    display: flex;
    width: 350px;
    flex-direction: column;
    margin: 0 20px 20px 0;
    font-size: inherit;
    align-items: stretch;
}

.actions button {
    margin-right: 10px;
    margin-top: 10px;
    background-color: var(--vscode-button-background);
    color: var(--vscode-button-foreground);
    border: none;
    padding: 6px 12px;
}

.actions button:hover {
    background-color: var(--vscode-button-hoverBackground);
}
</style>