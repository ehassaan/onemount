<template>
    <form :class="$style.form" @submit.prevent="emit('submit', formData)" @reset.prevent="emit('cancel')">

        <div v-for="(field, index) in fields" :key="field.name">

            <slot :name="`field-${field.type}`" v-bind="{ field, index }">
                <div>
                    <DynamicField :field="field" v-model="formData[field.name]" :class="$style.field"></DynamicField>
                </div>

                <div v-if="(field.type === 'select')">
                    <DynamicField v-for="nested of getNested(field, formData[field.name])" :key="nested.name"
                        :field="nested" v-model="formData[nested.name]" :class="$style.field">
                    </DynamicField>
                </div>

            </slot>
        </div>
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
import { ref } from 'vue';

const props = withDefaults(defineProps<{
    submitText?: string,
    fields: IDynamicField[];
}>(), {
    submitText: 'Create'
});
let emit = defineEmits(['submit', 'cancel']);

const formData: any = defineModel({
    default: {}
});

function getNested(field: IDynamicField, option: DropdownItem) {
    if (!option || !field.options || field.type !== 'select') return [];

    const matches = field.options?.filter(o => o.name === option.name);
    if (matches.length <= 0) return [];

    console.log("Matched: ", matches[0]);
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