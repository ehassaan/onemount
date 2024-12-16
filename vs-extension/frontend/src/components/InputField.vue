<template>
    <div class="field">
        <label>{{ label }}{{ required ? ' *' : '' }}</label>
        <input :type="type" :placeholder="placeholder" v-model="vModel" @change="onChange">
    </div>
</template>

<script setup lang="ts">
import { ref, type PropType } from 'vue';


const props = defineProps({
    label: {
        type: String,
        default: 'Input'
    },
    placeholder: {
        type: String,
        default: ''
    },
    required: {
        type: Boolean,
        default: false
    },
    modelValue: {
        type: String,
        default: null,
    },
    type: {
        type: String as PropType<'text' | 'password' | 'number' | 'checkbox'>,
        default: 'text'
    }
});
const vModel = ref(props.modelValue);


function onChange() {
    emit('update:modelValue', vModel.value);
}

const emit = defineEmits(['update:modelValue']);

</script>
<style lang="css" scoped>
.field {
    margin: 5px;
    display: flex;
    flex-direction: column;
}

input {
    color: var(--dl-input-foreground);
    background-color: var(--dl-input-background);
    padding: 3px 7px 3px 7px;
}

label {
    padding: 3px 0px 3px 0px;
    /* color: var(--dl-editor-foreground); */
}
</style>