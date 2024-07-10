<script setup>
  import { computed } from 'vue';

  const props = defineProps({
    isDialogVisible: {
      type: Boolean,
      required: true,
    },
    loadingSelectedDialog : {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      default: null,
    },
    data: {
      type: Array,
      default: [],
    },
    headerMap: {
      type: Object,
      default: {}
    }
  });

  const items = computed(() => {
    return props.data.map(item => {
      const newItem = {};
      for (const key in props.headerMap) {
        if (item.hasOwnProperty(key)) {
          newItem[props.headerMap[key]] = item[key];
        }
      }
      return newItem;
    });
  });

  const keyItems = computed(() => {
    if (items.value.length) {
      return Object.keys(items.value[0]);
    }
    return [];
  });

  const emit = defineEmits(['closeDialogSelected']);
  const { isDialogVisible } = toRefs(props);

  const close = () => {
    emit('closeDialogSelected');
  }

  const deleteSelectedHandle = () => {
    emit('handleSelectedDelete');
  }
</script>

<template>
  <v-dialog v-model="isDialogVisible" width="auto">
    <DialogCloseBtn @click="close" />
    <v-card max-width="1000" :title="title" :loading="loadingSelectedDialog" :disabled="loadingSelectedDialog">
      <VCardText class="d-flex justify-end flex-wrap gap-3">
        <strong>Total registros: ({{ items.length }})</strong>
        <table class="table-scroll small-first-col">
          <thead>
            <tr>
              <th scope="col" v-for="(column, index) in keyItems" :key="index">{{column}}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in items" :key="index">
              <td :data-label="column" v-for="(column, indexColumn) in keyItems" :key="indexColumn">{{item[column]}}</td>
            </tr>
          </tbody>
        </table>
        <VBtn size="small" variant="tonal" color="secondary" @click="close">
          <VIcon icon="tabler-circle-x" />
          Cancelar
        </VBtn>
        <VBtn size="small" @click="deleteSelectedHandle">
          <VIcon icon="tabler-trash-x" />
          Eliminar todos ({{ items.length }})
        </VBtn>
      </VCardText>
    </v-card>
  </v-dialog>
</template>
<style scoped lang="css">
table {
  padding: 0;
  border: 1px solid #ccc;
  margin: 0;
  border-collapse: collapse;
  font-family: Roboto, sans-serif;
  inline-size: 100%;
  table-layout: fixed;
}

table thead tr {
  background-color: #04438c;
  color: white;
}

table tbody tr {
  padding: 0.35em;
  border: 1px solid #ddd;
  background-color: #ededed;
}

table th,
table td {
  padding: 0.625em;
  font-size: 0.80em;
  font-weight: bold;
  text-align: center;
}

table th {
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

@media screen and (max-width: 600px) {
  table {
    border: 0;
  }
  
  table thead {
    position: absolute;
    overflow: hidden;
    padding: 0;
    border: none;
    margin: -1px;
    block-size: 1px;
    clip: rect(0 0 0 0);
    inline-size: 1px;
  }

  table tr {
    display: block;
    border-block-end: 3px solid #ddd;
    margin-block-end: 0.625em;
  }

  table td {
    display: block;
    border-block-end: 1px solid #ddd;
    font-size: 0.8em;
    text-align: end;
  }

  table td::before {
    content: attr(data-label);
    float: inline-start;
    font-weight: bold;
    text-transform: uppercase;
  }

  table td:last-child {
    border-block-end: 0;
  }
}
</style>
