<template>
    <div class="field">
        <label>{{ label }}{{ required ? ' *' : '' }}</label>
        <select v-model="selected" class="dropdown" @change="onChange">
            <option :value="undefined" selected disabled hidden>{{ label }}</option>
            <option v-for="item in props.items" :key="item.name" :value="item.name">{{ item.label }}</option>
        </select>
    </div>
</template>

<script setup lang="ts">
import { ref, type PropType } from 'vue';

const props = defineProps({
    label: {
        type: String,
        default: 'Select'
    },
    required: {
        type: Boolean,
        default: false  
    },
    items: {
        type: Array as PropType<{ name: string, label: string; }[]>,
        default: () => []
    },
    modelValue: {
        type: Object as PropType<{ name: string, label: string; icon?: string; }>,
        default: null,
    }
});

function onChange() {
    emit('update:modelValue', props.items.find(item => item.name === selected.value));
}

const selected = ref(props.modelValue?.name);
const emit = defineEmits(['update:modelValue']);

</script>
<style lang="css" scoped>
.field {
    margin: 5px;
    display: flex;
    flex-direction: column;
}

.dropdown {
    color: var(--dl-input-foreground);
    background-color: var(--dl-input-background);
    padding: 3px 7px 3px 7px;
}

label {
    padding: 3px 0px 3px 0px;
    /* color: var(--dl-editor-foreground); */
}
</style>