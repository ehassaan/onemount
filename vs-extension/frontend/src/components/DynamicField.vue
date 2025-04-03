<template>
    <DropdownInput v-if="field.type === 'select'" v-model="model" :label="field.label" :items="field.options"
        item-title="title" item-value="value" :rules="field.rules" :required="field.required">
    </DropdownInput>

    <InputField class="$style.field" :placeholder="(field.placeholder as any)" v-else-if="field.type === 'password'"
        v-model="model" :label="field.label" :rules="field.rules" type="password" :required="field.required">
    </InputField>

    <InputField :class="$style.field" :placeholder="(field.placeholder as any)" v-else-if="field.type === 'number'"
        v-model.number="model" :label="field.label" :rules="field.rules" type="number" :required="field.required">
    </InputField>

    <InputField v-else :class="$style.field" :placeholder="(field.placeholder as any)" v-model="model"
        :label="field.label" :rules="field.rules" :required="field.required">
    </InputField>
</template>

<script setup lang="ts">
import type { IDynamicField } from '../entities/DynamicField';
import DropdownInput from './atoms/DropdownInput.vue';
import InputField from './atoms/InputField.vue';

const props = defineProps<{
    field: IDynamicField;
}>();

const model = defineModel<any>();

</script>
<style module scoped>
.field {
    
}
</style>