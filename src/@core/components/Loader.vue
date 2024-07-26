<script setup>
import { useLoaderStore } from '@/stores/loader';
import { storeToRefs } from 'pinia';

const loaderStore = useLoaderStore();
const { isDialogVisible } = storeToRefs(loaderStore);
</script>

<template>
  <VDialog
    v-model="isDialogVisible"
    width="100"
    persistent
  >
    <v-progress-circular
      :size="70"
      :width="5"
      color="primary"
      indeterminate
    ></v-progress-circular>
  </VDialog>
</template>
