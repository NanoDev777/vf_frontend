<script setup>
import { useLoaderStore } from '@/stores/loader';
import { storeToRefs } from 'pinia';

const loaderStore = useLoaderStore();
const { isDialogVisible } = storeToRefs(loaderStore);
</script>

<template>
  <VDialog
    v-model="isDialogVisible"
    width="300"
    persistent
  >
    <VCard
      color="indigo"
      width="300"
    >
      <VCardText class="pt-3">
        <v-progress-linear
          color="teal"
          indeterminate
        ></v-progress-linear>
      </VCardText>
    </VCard>
  </VDialog>
</template>
