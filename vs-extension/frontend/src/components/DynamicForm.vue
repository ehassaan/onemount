<template>
    <form :class="$style.form" @submit.prevent="() => emit('submit', formData)" @reset.prevent="() => emit('cancel')">

        <template v-for="(field, index) in fields" :key="field.name">

            <slot :name="`field-${field.type}`" v-bind="{ field, index }">
                <DynamicField :field="field" v-model="formData[field.name]" :class="$style.field"></DynamicField>

                <template v-if="(field.type === 'select')">
                    <DynamicField v-for="nested of getNested(field, formData[field.name])" :key="nested.name"
                        :field="nested" v-model="formData[nested.name]" :class="$style.field">
                    </DynamicField>
                </template>

            </slot>
        </template>
        <div :class="$style.actions">
            <SimpleButton type="submit" :class="$style.button">{{ submitText }}</SimpleButton>
            <SimpleButton type="reset" color="secondary" :class="$style.button">Cancel</SimpleButton>
        </div>
    </form>
</template>

<script setup lang="ts">
import type { IDynamicField } from '@/entities/DynamicField';
import { type DropdownItem } from './atoms/DropdownInput.vue';
import SimpleButton from './atoms/SimpleButton.vue';
import DynamicField from './DynamicField.vue';

const props = withDefaults(defineProps<{
    submitText?: string,
    fields: IDynamicField[];
}>(), {
    submitText: 'Create'
});
const emit = defineEmits(['submit', 'cancel']);

const formData = defineModel<any>({
    default: {}
});

function getNested(field: IDynamicField, selection: DropdownItem) {
    if (!selection || !field.options || field.type !== 'select') return [];

    const matches = field.options?.filter(o => o.name === selection.name);
    if (matches.length <= 0) return [];

    return matches[0].nested || [];
}

</script>
<style module scoped>
.form {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    width: 100%;
}

.field {
    width: 350px;
    margin: 0 10px 10px 0;
}

.actions {
    flex-basis: 100%;
}

.button {
    margin: 5px 10px 0 0;
    padding: 6px 35px;
}
</style>