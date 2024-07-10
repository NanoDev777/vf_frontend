import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSnackbarStore = defineStore('snackbar', () => {
  const isSnackbarVisible = ref(false);
  const message = ref('');

  function showSnackbar(newMessage) {
    message.value = newMessage;
    isSnackbarVisible.value = true;
  }

  function hideSnackbar() {
    isSnackbarVisible.value = false;
  }

  return {
    isSnackbarVisible,
    message,
    showSnackbar,
    hideSnackbar,
  };
});
