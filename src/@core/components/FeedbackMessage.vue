<script setup>
import { useMessageStore } from '@/stores/message';
const messageStore = useMessageStore();

const close = () => {
  messageStore.clearMessage();
};
</script>

<template>
  <v-dialog v-model="messageStore.show" width="auto">
    <v-card max-width="400" prepend-icon="tabler-alert-triangle" :text="messageStore.text" :title="messageStore.title">
      <template v-slot:actions>
        <v-btn class="ms-auto" text="Aceptar" @click="close"></v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>
