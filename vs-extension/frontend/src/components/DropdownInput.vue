<template>
    <div :class="$style.field">
        <label :class="$style.label">{{ label }}{{ required ? ' *' : '' }}</label>
        <select :required="props.required" :class="$style.dropdown" @change="onChange"
            :placeholder="'--' + label + '--'">
            <!-- <option :class="$style.dropdown_option" hidden disabled :value="undefined" :selected="!model">-- {{ label }}
                --</option> -->
            <option :class="$style.dropdown_option" v-for="item in props.items" :key="item.name" :value="item.name">{{
                item.label }}</option>
        </select>
    </div>
</template>

<script setup lang="ts">
import { watch, type PropType } from 'vue';

export interface DropdownItem {
    name: string,
    label: string;
    icon?: string;
}

const props = defineProps({
    label: {
        type: String,
        default: 'Please Select'
    },
    required: {
        type: Boolean,
        default: false
    },
    items: {
        type: Array as PropType<DropdownItem[]>,
        default: () => []
    }
});

// const emit = defineEmits(['update:modelValue']);
const model = defineModel({ type: Object as PropType<DropdownItem>, required: false });


function onChange(val: any) {
    console.log("Changed: ", val.target);
    model.value = props.items.find(item => item.name === val.target.value);
    // emit('update:modelValue', props.items.find(item => item.name === val.target.value));
}

watch(() => props.items, () => {
    // emit('update:modelValue', props.items[0]);
    model.value = undefined;
});

</script>
<style module>
.field {
    margin: 10px;
    display: flex;
    flex-direction: column;
    align-items: stretch;
}

.dropdown {
    color: var(--dl-dropdown-foreground);
    background-color: var(--dl-dropdown-background);
    padding: 3px 7px 3px 7px;
}

.dropdown_option {
    background-color: var(--dl-dropdown-list-background);
}

.label {
    padding: 3px 0px 3px 0px;
}
</style>
