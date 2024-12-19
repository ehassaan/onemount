<template>
    <div :class="$style.field">
        <label :class="$style.label">{{ label }}{{ required ? ' *' : '' }}</label>
        <input :class="$style.input" :required="props.required" :type="props.type" :placeholder="props.placeholder"
            v-model="vModel">
    </div>
</template>

<script setup lang="ts">
import { type PropType } from 'vue';


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
    type: {
        type: String as PropType<'text' | 'password' | 'number' | 'checkbox'>,
        default: 'text'
    }
});
const vModel = defineModel();

</script>
<style module>
.field {
    margin: 10px;
    display: flex;
    flex-direction: column;
    align-items: stretch;
}

.input {
    color: var(--dl-input-foreground);
    background-color: var(--dl-input-background);
    padding: 3px 7px 3px 7px;
}

.label {
    padding: 3px 0px 3px 0px;
}
</style>