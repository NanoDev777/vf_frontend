import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

// Define el store
export const useMessageStore = defineStore('message', () => {
  // State
  const type = ref('');
  const title = ref('');
  const text = ref('');
  const modal = ref(false);
  const show = ref(false);

  // Mutations y Actions combinados como methods
  const responseMessage = (payload) => {
    type.value = payload.type || '';
    title.value = payload.title || '';
    text.value = payload.text || '';
    modal.value = payload.modal || false;
    show.value = true;

    if (!modal.value) {
      setTimeout(() => {
        clearMessage();
      }, 10000);
    }
  };

  const clearMessage = () => {
    modal.value = false;
    show.value = false;
  };

  // Getters
  const responseMessageGetter = computed(() => {
    return {
      type: type.value,
      title: title.value,
      text: text.value,
      modal: modal.value,
      show: show.value,
    };
  });

  return {
    type,
    title,
    text,
    modal,
    show,
    responseMessage,
    clearMessage,
    responseMessageGetter,
  };
});
