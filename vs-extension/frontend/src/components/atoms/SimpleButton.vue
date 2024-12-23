<template>
    <button :type="props.type" :class="{ [$style.button]: true, [$style.secondary]: props.color == 'secondary' }"
        @click="onClick">
        <slot>Click</slot>
    </button>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';


const props = defineProps({
    color: {
        type: String as PropType<'primary' | 'secondary'>,
        default: 'primary'
    },
    type: {
        type: String as PropType<'button' | 'submit' | 'reset'>,
        default: 'button'
    }
});

const emit = defineEmits(['click']);

function onClick(ev: MouseEvent) {
    emit('click', ev);
}

</script>
<style module>
.button {
    margin: 5px;
    padding: 5px 25px;
    color: var(--dl-button-foreground);
    background-color: var(--dl-button-background);
    border: 1px solid var(--dl-button-border);
}

.botton:hover {
    background-color: var(--dl-button-hoverBackground);
}

.secondary {
    background-color: var(--dl-button-secondaryForeground);
    color: var(--dl-button-secondaryBackground);
}

.secondary:hover {
    background-color: var(--dl-button-secondaryHoverBackground);
}
</style>