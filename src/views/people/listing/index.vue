<script setup>
import PeopleService from '@/services/people.service';
import { useLoaderStore } from '@/stores/loader';
import { useSelectedPeopleStore } from '@/stores/people';
import { useSnackbarStore } from '@/stores/snackbar';
import DeleteDialog from '@core/components/DeleteDialog.vue';
import SelectedTableDialog from '@core/components/SelectedTableDialog.vue';
import { Notification, Notivue, pastelTheme, push } from 'notivue';
import { onMounted, ref, watch } from 'vue';
import FormPeople from '../components/form.vue';

const loaderStore = useLoaderStore();
const snackbarStore = useSnackbarStore();
const selectedPeopleStore = useSelectedPeopleStore();
const router = useRouter();

const itemsPerPage = ref(10);
const headers = ref([
  { title: 'Nombres', key: 'names'},
  { title: 'Apellidos', key: 'surnames'},
  { title: 'CI', key: 'ci'},
  { title: 'Correo', key: 'email'},
  { title: 'Teléfono', key: 'phone'},
  { title: 'Ciudad', key: 'city'},
  { title: 'Acciones', key: 'actions' },
]);

const search = ref('');
const serverItems = ref([]);
const loading = ref(true);
const totalItems = ref(0);
const selected = ref(selectedPeopleStore.selectedPeople);

const names = ref('');
const surnames = ref('');
const ci = ref('');

const isDialogVisible = ref(false);
const isDialogDeleteVisible = ref(false);
const isDialogSelectedVisible = ref(false);
const loadingDeleteDialog = ref(false);
const loadingSelectedDialog = ref(false);
const titleDialodDelete = ref(null);
const textDialogDelete = ref(null);
const idItemDelete = ref(null);
const peopleToEdit = ref(null);

const items = [
  { title: 'Anterior o igual a', value: 'lte' },
  { title: 'Posterior o igual a', value: 'gte' },
];

const selectedDropdownItem = ref('lte');

const loadItems = async ({ page, itemsPerPage, sortBy }) => {
  loading.value = true;

  try {
    let sort = null;
    if (sortBy.length > 0) {
      sort = sortBy.map(sortItem => ({
        field: sortItem.key,
        dir: sortItem.order,
      }));
    }

    const filter = {};
    if (names.value) {
      filter['filter[filters][0][operator]'] = 'contains';
      filter['filter[filters][0][value]'] = names.value;
      filter['filter[filters][0][field]'] = 'names';
    }

    if (surnames.value) {
      filter['filter[filters][1][operator]'] = 'contains';
      filter['filter[filters][1][value]'] = surnames.value;
      filter['filter[filters][1][field]'] = 'surnames';
    }
    
    if (ci.value) {
      filter['filter[filters][2][operator]'] = 'contains';
      filter['filter[filters][2][value]'] = ci.value;
      filter['filter[filters][2][field]'] = 'ci';
    }

    const response = await PeopleService.listPeople({ page, itemsPerPage, sort, filter });

    if (response.status === 200) {
      const { data, meta } = response.data;
      serverItems.value = data;
      totalItems.value = meta.total;
    } else {
      loading.value = false;
    }
  } catch (error) {
    loading.value = false;
  } finally {
    loading.value = false;
  }
};

const reloadTable = () => {
  names.value = ''
  surnames.value = ''
  ci.value = ''
  loadItems({ page: 1, itemsPerPage: itemsPerPage.value, sortBy: [] });
}

loadItems({ page: 1, itemsPerPage: itemsPerPage.value, sortBy: [] });

watch(names, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    loadItems({ page: 1, itemsPerPage: itemsPerPage.value, sortBy: [] });
  }
});

watch(surnames, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    loadItems({ page: 1, itemsPerPage: itemsPerPage.value, sortBy: [] });
  }
});

watch(ci, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    loadItems({ page: 1, itemsPerPage: itemsPerPage.value, sortBy: [] });
  }
});

watch(selected, (newValue) => {
  selectedPeopleStore.setSelectedPeople(newValue);
  nextTick(() => {
    updateRowStyles();
  });
}, { deep: true });

const updateRowStyles = () => {
  const rows = document.querySelectorAll('.v-data-table__tr');
  rows.forEach(row => {
    const item = row.__vueParentComponent.ctx.item;
    if (selected.value.includes(item.value)) {
      row.classList.add('selected-row');
    } else {
      row.classList.remove('selected-row');
    }
  });
};

const dataTable = ref(null);

onMounted(() => {
  nextTick(() => {
    watch(serverItems, async () => {
      await nextTick();
      const rows = dataTable.value?.$el.querySelectorAll('.v-data-table__tr');
      rows.forEach(row => {
        const item = row.__vueParentComponent.ctx.item;
        if (selected.value.some(selectedItem => selectedItem.id == item.value.id)) {
          row.classList.add('selected-row');
        } else {
          row.classList.remove('selected-row');
        }
      });
    }, { immediate: true });
  });
});

const showStoreDialog = () => {
  isDialogVisible.value = true;
  peopleToEdit.value = null;
};

const handleDialogClose = (value) => {
  isDialogVisible.value = value;
  reloadTable();
};

const showEditDialog = async (item) => {
  try {
    loaderStore.showLoader();

    const response = await PeopleService.editPeople(`people/${item.id}/edit`);
    if (response.status == 200) {
      peopleToEdit.value = response.data.data;
      loaderStore.hideLoader();
      isDialogVisible.value = true;
    }

  } catch (err) {
    loaderStore.hideLoader();
  }
}

const showDeleteDialog = (item) => {
  idItemDelete.value = item.id;
  titleDialodDelete.value = 'Eliminar Registro';
  textDialogDelete.value = 'Realmente desea elimnar los datos del registro?';
  isDialogDeleteVisible.value = true
}

const showSelectedDialog = () => {
  isDialogSelectedVisible.value = true
}

const closeDialogDelete = () => {
  idItemDelete.value = null;
  titleDialodDelete.value = null;
  textDialogDelete.value = null;
  isDialogDeleteVisible.value = false
}

const closeDialogSelected = () => {
  isDialogSelectedVisible.value = false
}

const deleteItem = async () => {
  try {
    loadingDeleteDialog.value = true
    const response = await PeopleService.deletePeople([idItemDelete.value]);
    if (response.status == 200) {
      loadingDeleteDialog.value = false;
      idItemDelete.value = null;
      titleDialodDelete.value = null;
      textDialogDelete.value = null;
      isDialogDeleteVisible.value = false;
      snackbarStore.showSnackbar(response.data.message);
      reloadTable();
      if (response.data.data.length > 0) {
        push.info('Algunos resgistros no se eliminaron');
      }
    }
  } catch (err) {
    loadingDeleteDialog.value = false
  }
}

const deleteItems = async () => {
  try {
    loadingSelectedDialog.value = true
    let items = selected.value.map((i) => i.id)
    const response = await PeopleService.deletePeople(items);
    if (response.status == 200) {
      loadingSelectedDialog.value = false;
      isDialogSelectedVisible.value = false;
      selected.value = [];
      selectedPeopleStore.clearSelectedPeople();
      snackbarStore.showSnackbar(response.data.message);
      reloadTable();
      if (response.data.data.length > 0) {
        push.info('Algunos resgistros no se eliminaron');
      }
    }
  } catch (err) {
    loadingSelectedDialog.value = false
  }
}

const clearSelectedPeople = () => {
  selected.value = []
  selectedPeopleStore.clearSelectedPeople();
}

const goToPeopleDeatil = (id) => {
  router.push({ name: 'people-detail', params: { id } })
}
</script>
<template>
  <VCard title="LISTA DE CLIENTES">
    <template #append>
      <div class="pr-2">
        <VBtn variant="tonal" @click="showStoreDialog">
          Registrar Nuevo
          <VIcon end icon="tabler-circle-plus" />
        </VBtn>
      </div>
    </template>
    <Notivue v-slot="item">
      <Notification :item="item" :theme="pastelTheme" />
    </Notivue>
    <VCardText>
      <VList class="card-list">
        <VDataTableServer
          v-model:items-per-page="itemsPerPage"
          v-model="selected"
          :headers="headers"
          :items="serverItems"
          :items-length="totalItems"
          :loading="loading"
          :search="search"
          item-value="names"
          @update:options="loadItems"
          loading-text="Cargando..."
          no-data-text="No hay datos disponibles"
          return-object
          show-select
          ref="dataTable"
        >
          <template #top>
            <v-sheet elevation="1" color="#F7F7F7">
              <v-container fluid>
                <p class="d-block text-primary font-weight-medium">Filtros de Busqueda:</p>
                <v-row>
                  <v-col cols="12" md="4">
                    <v-text-field v-model="names" label="Nombres" dense hide-details clearable :loading="loading"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field v-model="surnames" label="Apellidos" dense hide-details clearable :loading="loading"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field v-model="ci" label="CI" dense hide-details clearable :loading="loading"></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-sheet>
            <v-sheet class="pa-2 mb-2" elevation="1" color="#F4F6FF">
              <div class="demo-space-x">
                <VBtn v-if="selected.length > 0" variant="tonal" @click="showSelectedDialog">
                  <VIcon
                    icon="tabler-select"
                  />
                  Seleccionados ({{ selected.length }}) 
                </VBtn>
                <VBtn @click="clearSelectedPeople" title="Quitar Seleccionados" variant="flat" color="secondary">
                  <VIcon
                    icon="tabler-deselect"
                  />
                  <span v-if="selected.length > 0">({{ selected.length }})</span>
                </VBtn>
                <VBtn title="Descargar PDF" variant="tonal" color="error">
                  <VIcon
                    icon="tabler-file-type-pdf"
                  />
                  <span v-if="selected.length > 0">({{ selected.length }})</span>
                </VBtn>
                <VBtn title="Descargar EXCEL" variant="tonal" color="success">
                  <VIcon
                    icon="tabler-file-spreadsheet"
                  />
                  <span v-if="selected.length > 0">({{ selected.length }})</span>
                </VBtn>
                <VSpacer />
                <VBtn icon color="secondary" density="comfortable" @click="reloadTable">
                  <VIcon icon="tabler-refresh" size="20" />
                </VBtn>
              </div>
            </v-sheet>
          </template>

          <template #item.actions="{ item }">
            <div class="d-flex gap-1">
              <IconBtn @click="goToPeopleDeatil(item.id)">
                <VIcon icon="tabler-clipboard-data" />
              </IconBtn>
              <IconBtn @click="showEditDialog(item)">
                <VIcon icon="tabler-edit" />
              </IconBtn>
              <IconBtn @click="showDeleteDialog(item)">
                <VIcon icon="tabler-trash" />
              </IconBtn>
            </div>
          </template>
        </VDataTableServer>
      </VList>
    </VCardText>
  </VCard>

  <!-- Componente FormPeople -->
  <FormPeople :isDialogPeopleVisible="isDialogVisible" :people="peopleToEdit" :title="'Registrar Cliente'" @update:isDialogPeopleVisible="handleDialogClose" />

  <!-- Componente DeleteDialog -->
  <DeleteDialog :isDialogVisible="isDialogDeleteVisible" :loadingDeleteDialog="loadingDeleteDialog" :title="titleDialodDelete" :text="textDialogDelete" @closeDialogDelete="closeDialogDelete" @handleDelete="deleteItem" />

  <!-- Componente SelectedTableDialog -->
  <SelectedTableDialog :isDialogVisible="isDialogSelectedVisible" :loadingSelectedDialog="loadingSelectedDialog" :title="'Lista de Seleccionados'" :headerMap="{names: 'Nombre(s)',surnames: 'Apellidos',ci: 'CI',email: 'Correo',phone: 'Teléfono'}" :data="selected" @closeDialogSelected="closeDialogSelected" @handleSelectedDelete="deleteItems" />
</template>
<style scoped>
:deep(.selected-row) {
  background-color: #e6f0ff !important;
}

:deep(.v-data-table__thead) {
  background-color: #e0e0e0 !important;
}
</style>
