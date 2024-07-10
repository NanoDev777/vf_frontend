import { defineStore } from 'pinia';

export const useSelectedTherapistStore = defineStore('selectedTherapist', {
  state: () => ({
    selectedTherapist: [],
  }),
  actions: {
    setSelectedTherapist(therapist) {
      this.selectedTherapist = therapist;
    },

    clearSelectedTherapist() {
      this.selectedTherapist = [];
    },
  },
  persist: {
    storage: localStorage,
  },
});
