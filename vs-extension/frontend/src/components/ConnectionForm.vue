<template>
    <div class="container">

        <form :class="$style.form" @submit="onSubmit" @reset="onCancel">

            <InputField v-model="mForm.name" :class="$style.field" label="Name" required class="field"
                placeholder="myconnection">
            </InputField>
            <InputField v-model="mForm.targetUri" :class="$style.field" label="Remote URI" required
                placeholder="https://example.com">
            </InputField>
            <InputField v-model="mForm.localPath" :class="$style.field" label="Local Path" placeholder="./ducklake/">
            </InputField>

            <Dropdown required :class="$style.field" label="Authentication Type" v-model="mAuthType"
                :items="allAuthTypes">
            </Dropdown>

            <InputField required v-if="mAuthType?.name === 'sas_token'" label="SAS Token" type="password"
                v-model="mAuth.sasToken" :class="$style.field">
            </InputField>
            <InputField required v-if="mAuthType?.name === 'account_key'" label="Account Key" type="password"
                :class="$style.field" v-model="mAuth.accountKey"></InputField>

            <template v-if="mAuthType?.name === 'service_principal'">
                <InputField required label="Tenant ID" :class="$style.field" v-model="mAuth.tenantId">
                </InputField>
                <InputField required label="Subscription ID" :class="$style.field" v-model="mAuth.subscriptionId">
                </InputField>
                <InputField required label="Client ID" :class="$style.field" v-model="mAuth.clientId">
                </InputField>
                <InputField required type="password" :class="$style.field" label="Client Secret"
                    v-model="mAuth.clientSecret">
                </InputField>
            </template>

            <template v-if="mAuthType?.name === 'iam_user'">
                <InputField required label="Access Key ID" :class="$style.field" v-model="mAuth.iamAccessKeyId">
                </InputField>
                <InputField required type="password" :class="$style.field" label="Secret Access Key"
                    v-model="mAuth.iamSecretKey">
                </InputField>
            </template>

            <div :class="$style.actions">
                <SimpleButton type="submit" :class="$style.button">Create</SimpleButton>
                <SimpleButton type="reset" color="secondary" :class="$style.button">Cancel</SimpleButton>
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, type PropType } from 'vue';
import Dropdown from './atoms/DropdownInput.vue';
import InputField from './atoms/InputField.vue';
import { type AuthType, authTypes } from '@/entities/authTypes';
import SimpleButton from './atoms/SimpleButton.vue';

const props = defineProps({
    connectionType: {
        type: String as PropType<'blob' | 'minio' | 'gcs' | 'aws_s3'>,
        required: true
    }
});

const emit = defineEmits(['submit', 'cancel']);

const mAuthType = ref<{ name: AuthType, label: string; }>();
const mForm = ref({
    name: '',
    targetUri: '',
    localPath: './ducklake/',
});

const allAuthTypes = computed(() => authTypes[props.connectionType]);

const mAuth = ref({
    sasToken: '',
    accountKey: '',
    clientId: '',
    clientSecret: '',
    tenantId: '',
    subscriptionId: '',
    iamAccessKeyId: '',
    iamSecretKey: '',
});

function onSubmit(event: any) {
    console.log("Submit: ", event.target.checkValidity(), mForm.value, mAuth.value);
    if (!event.target.checkValidity()) return;

    let auth = {};

    if (mAuthType.value?.name === "service_principal") {
        auth = {
            tenantId: mAuth.value.tenantId,
            subscriptionId: mAuth.value.subscriptionId,
            clientId: mAuth.value.clientId,
            clientSecret: mAuth.value.clientSecret,
        };
    }
    else if (mAuthType.value?.name === "iam_user") {
        auth = {
            iamAccessKeyId: mAuth.value.iamAccessKeyId,
            iamSecretKey: mAuth.value.iamSecretKey,
        };
    }
    else if (mAuthType.value?.name === "sas_token") {
        auth = {
            sasToken: mAuth.value.sasToken,
        };
    }
    else if (mAuthType.value?.name === "account_key") {
        auth = {
            accountKey: mAuth.value.accountKey,
        };
    }
    else {
        auth = {};
    }
    emit('submit', { ...mForm.value, auth: { type: mAuthType.value?.name, ...auth } });
    event.preventDefault();
}

function onCancel(event: any) {
    emit('cancel');
    event.preventDefault();
}

</script>

<style module>
.form {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    width: 100%;
}

.field {
    width: 350px;
    margin: 0 20px 20px 0;
}

.actions {
    flex-basis: 100%;
}

.button {
    margin: 5px;
    padding: 6px 35px;
}
</style>