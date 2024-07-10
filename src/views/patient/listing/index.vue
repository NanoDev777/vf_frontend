<script setup>
import PatientService from '@/services/patient.service';
import { useLoaderStore } from '@/stores/loader';
import { useSelectedPatientsStore } from '@/stores/patients';
import { useSnackbarStore } from '@/stores/snackbar';
import DeleteDialog from '@core/components/DeleteDialog.vue';
import SelectedTableDialog from '@core/components/SelectedTableDialog.vue';
import { Notification, Notivue, pastelTheme, push } from 'notivue';
import { onMounted, ref, watch } from 'vue';
import FormPatient from '../components/form.vue';

const loaderStore = useLoaderStore();
const snackbarStore = useSnackbarStore();
const selectedPatientsStore = useSelectedPatientsStore();
const router = useRouter();

const itemsPerPage = ref(10);
const headers = ref([
  { title: 'Nombres', key: 'names'},
  { title: 'Apellidos', key: 'surnames'},
  { title: 'F. Nacimiento', key: 'birthdate'},
  { title: 'Colegio', key: 'school'},
  { title: 'Curso', key: 'course'},
  { title: 'Teléfono', key: 'phone'},
  { title: 'Acciones', key: 'actions' },
]);

const search = ref('');
const serverItems = ref([]);
const loading = ref(true);
const totalItems = ref(0);
const selected = ref(selectedPatientsStore.selectedPatients);

const names = ref('');
const surnames = ref('');
const birthdate = ref('');

const isDialogVisible = ref(false);
const isDialogDeleteVisible = ref(false);
const isDialogSelectedVisible = ref(false);
const loadingDeleteDialog = ref(false);
const loadingSelectedDialog = ref(false);
const titleDialodDelete = ref(null);
const textDialogDelete = ref(null);
const idItemDelete = ref(null);
const patientToEdit = ref(null);

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
    
    if (birthdate.value) {
      filter['filter[filters][1][operator]'] = selectedDropdownItem.value;
      filter['filter[filters][1][value]'] = birthdate.value;
      filter['filter[filters][1][field]'] = 'birthdate';
    }

    const response = await PatientService.listPatients({ page, itemsPerPage, sort, filter });

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

const setDateFilter = (item) => {
  selectedDropdownItem.value = item.value
  if(birthdate.value) {
    loadItems({ page: 1, itemsPerPage: itemsPerPage.value, sortBy: [] });
  }
}

const reloadTable = () => {
  names.value = ''
  surnames.value = ''
  birthdate.value = ''
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

watch(birthdate, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    loadItems({ page: 1, itemsPerPage: itemsPerPage.value, sortBy: [] });
  }
});

watch(selected, (newValue) => {
  selectedPatientsStore.setSelectedPatients(newValue);
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
  patientToEdit.value = null;
};

const handleDialogClose = (value) => {
  isDialogVisible.value = value;
  reloadTable();
};

const showEditDialog = async (item) => {
  try {
    loaderStore.showLoader();

    const response = await PatientService.editPatient(`patients/${item.id}/edit`);
    if (response.status == 200) {
      patientToEdit.value = response.data.data;
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
    const response = await PatientService.deletePatient([idItemDelete.value]);
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
    const response = await PatientService.deletePatient(items);
    if (response.status == 200) {
      loadingSelectedDialog.value = false;
      isDialogSelectedVisible.value = false;
      selected.value = [];
      selectedPatientsStore.clearSelectedPatients();
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

const pdfListPatient = async () => {
  loaderStore.showLoader();
  let data = selected.value.map(item => item.id)
  try {
    const response = await PatientService.pdfListPatient({patient: data})
    if (response.status === 200) {
      let file = new Blob([response.data], {type: 'application/pdf'})
      let fileUrl = URL.createObjectURL(file)
      window.open(fileUrl) 
      loaderStore.hideLoader();
    }
  } catch (err) {
    loaderStore.hideLoader();
  }
}

const excelListPatient = async () => {
  loaderStore.showLoader();
  let data = selected.value.map(item => item.id)
  try {
    const response = await PatientService.excelListPatient({patient: data})
    if (response.status === 200) {
      let blob = new Blob([response.data])
      let link = document.createElement("a")
      link.href = window.URL.createObjectURL(blob)
      link.download = `lista-pacientes.xlsx`
      link.click()
      loaderStore.hideLoader();
    }
  } catch (err) {
    loaderStore.hideLoader();
  }
}
   

const clearSelectedPatients = () => {
  selected.value = []
  selectedPatientsStore.clearSelectedPatients();
}

const goToPatientDeatil = (id) => {
  router.push({ name: 'patient-detail', params: { id } })
}
</script>
<template>
  <VCard title="LISTA DE PACIENTES">
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
                    <v-text-field type="date" v-model="birthdate" label="F.Nacimiento" dense hide-details clearable :loading="loading">
                      <template #append-inner>
                        <v-menu>
                          <template #activator="{ props }">
                            <v-btn color="secondary" v-bind="props" size="small" variant="tonal">
                              <VIcon icon="tabler-filter" />
                            </v-btn>
                          </template>
                          <v-list>
                            <v-list-item v-for="(item, index) in items" :key="index" @click="setDateFilter(item)">
                              <v-list-item-title>{{ item.title }}</v-list-item-title>
                            </v-list-item>
                          </v-list>
                        </v-menu>
                      </template>
                    </v-text-field>
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
                <VBtn @click="clearSelectedPatients" title="Quitar Seleccionados" variant="flat" color="secondary">
                  <VIcon
                    icon="tabler-deselect"
                  />
                  <span v-if="selected.length > 0">({{ selected.length }})</span>
                </VBtn>
                <VBtn @click="pdfListPatient" title="Descargar PDF" variant="tonal" color="error">
                  <VIcon
                    icon="tabler-file-type-pdf"
                  />
                  <span v-if="selected.length > 0">({{ selected.length }})</span>
                </VBtn>
                <VBtn @click="excelListPatient" title="Descargar EXCEL" variant="tonal" color="success">
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
              <IconBtn @click="goToPatientDeatil(item.id)">
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

  <!-- Componente FormPatient -->
  <FormPatient :isDialogVisible="isDialogVisible" :patient="patientToEdit" @update:isDialogVisible="handleDialogClose" />

  <!-- Componente DeleteDialog -->
  <DeleteDialog :isDialogVisible="isDialogDeleteVisible" :loadingDeleteDialog="loadingDeleteDialog" :title="titleDialodDelete" :text="textDialogDelete" @closeDialogDelete="closeDialogDelete" @handleDelete="deleteItem" />

  <!-- Componente SelectedTableDialog -->
  <SelectedTableDialog :isDialogVisible="isDialogSelectedVisible" :loadingSelectedDialog="loadingSelectedDialog" :title="'Lista de Seleccionados'" :headerMap="{names: 'Nombre(s)',surnames: 'Apellidos',birthdate: 'F.Nacimiento',school: 'Colegio',course: 'Curso'}" :data="selected" @closeDialogSelected="closeDialogSelected" @handleSelectedDelete="deleteItems" />
</template>
<style scoped>
:deep(.selected-row) {
  background-color: #e6f0ff !important;
}

:deep(.v-data-table__thead) {
  background-color: #e0e0e0 !important;
}
</style>
