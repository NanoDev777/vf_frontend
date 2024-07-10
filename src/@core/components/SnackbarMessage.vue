<script setup>
import { useSnackbarStore } from '@/stores/snackbar';
import { computed, watch } from 'vue';

const snackbarStore = useSnackbarStore();

const isSnackbarVisible = computed({
  get: () => snackbarStore.isSnackbarVisible,
  set: (value) => snackbarStore.isSnackbarVisible = value,
});

const message = computed(() => snackbarStore.message);

watch(isSnackbarVisible, (newVal) => {
  if (!newVal) {
    snackbarStore.hideSnackbar();
  }
});
</script>

<template>
  <VSnackbar
    v-model="isSnackbarVisible"
    :timeout="5000"
    location="top"
  >
    {{ message }}
  </VSnackbar>
</template>
