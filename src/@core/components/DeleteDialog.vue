<script setup>
  import { defineEmits, defineProps } from 'vue';

  const props = defineProps({
    isDialogVisible: {
      type: Boolean,
      required: true,
    },
    loadingDeleteDialog : {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      default: null,
    },
    text: {
      type: String,
      default: null,
    }
  });

  const emit = defineEmits(['closeDialogDelete', 'handleDelete']);
  const { isDialogVisible } = toRefs(props);
  const { loadingDeleteDialog } = toRefs(props);

  const close = () => {
    emit('closeDialogDelete');
  }

  const deleteHandle = () => {
    emit('handleDelete');
  }
</script>

<template>
  <v-dialog v-model="isDialogVisible" width="auto" :persistent="loadingDeleteDialog">
    <v-card max-width="400" prepend-icon="tabler-alert-triangle" :title="title" :text="text" :disabled="loadingDeleteDialog" :loading="loadingDeleteDialog">
      <VCardText class="d-flex justify-end flex-wrap gap-3">
        <VBtn size="small" variant="tonal" color="secondary" @click="close">
          <VIcon icon="tabler-circle-x" />
          Cancelar
        </VBtn>
        <VBtn size="small" @click="deleteHandle">
          <VIcon icon="tabler-circle-check" />
          Aceptar
        </VBtn>
      </VCardText>
    </v-card>
  </v-dialog>
</template>
