import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    avatar: ''
  }),
  actions: {
    setAvatar(avatar) {
      this.avatar = avatar;
    },
    clearAvatar() {
      this.avatar = '';
    }
  },
  persist: {
    storage: localStorage,
  },
});
