import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useLoaderStore = defineStore('loader', () => {
  const isDialogVisible = ref(false);

  function showLoader() {
    isDialogVisible.value = true;
    setTimeout(() => {
      isDialogVisible.value = false;
    }, 4000);
  }

  function hideLoader() {
    isDialogVisible.value = false;
  }

  return {
    isDialogVisible,
    showLoader,
    hideLoader,
  };
});
