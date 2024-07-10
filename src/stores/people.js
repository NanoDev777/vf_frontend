import { defineStore } from 'pinia';

export const useSelectedPeopleStore = defineStore('selectedPeople', {
  state: () => ({
    selectedPeople: [],
  }),
  actions: {
    setSelectedPeople(people) {
      this.selectedPeople = people;
    },

    clearSelectedPeople() {
      this.selectedPeople = [];
    },
  },
  persist: {
    storage: localStorage,
  },
});
