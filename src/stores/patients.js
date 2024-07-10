import { defineStore } from 'pinia';

export const useSelectedPatientsStore = defineStore('selectedPatients', {
  state: () => ({
    selectedPatients: [],
  }),
  actions: {
    setSelectedPatients(patients) {
      this.selectedPatients = patients;
    },

    clearSelectedPatients() {
      this.selectedPatients = [];
    },
  },
  persist: {
    storage: localStorage,
  },
});
