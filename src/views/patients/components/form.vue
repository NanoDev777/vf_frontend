<script setup>
import PatientService from '@/services/patient.service';
import PeopleService from '@/services/people.service';
import SchoolService from '@/services/school.service';
import { useSnackbarStore } from '@/stores/snackbar';
import FormPeople from '@/views/people/components/form.vue';
import debounce from 'lodash/debounce';
import { useField, useForm } from 'vee-validate';
import { ref, toRefs, watch } from 'vue';

const snackbarStore = useSnackbarStore();

const props = defineProps({
  isDialogVisible: {
    type: Boolean,
    required: true,
  },
  patient: {
    type: Object,
    default: null,
  }
});

const emit = defineEmits(['update:isDialogVisible']);
const { isDialogVisible } = toRefs(props);

// Función para obtener el estado inicial del formulario
const getInitialFormState = () => ({
  names: '',
  surnames: '',
  birthdate: '',
  course: null,
  phone: '',
  email: '',
  people_id: null,
  school_id: null,
});

const initialFormState = getInitialFormState();

// Esquema de validación
const { handleSubmit, handleReset, errors, setErrors, resetForm, setValues } = useForm({
  validationSchema: {
    names: (value) => {
      if (!value) {
        return 'El campo nombre(s) es obligatorio.';
      }
      return true;
    },
    surnames: (value) => {
      if (!value) {
        return 'El campo apellidos es obligatorio.';
      }
      return true;
    },
    birthdate: (value) => {
      if (!value) {
        return 'El campo fecha nacimiento es obligatorio.';
      }
      return true;
    },
    course: (value) => {
      if (!value) {
        return 'El campo curso es obligatorio.';
      }
      return true;
    },
    phone: (value) => {
      if (!value) {
        return 'El campo teléfono es obligatorio.';
      }
      if (value.length < 6) {
        return 'El teléfono debe tener al menos 6 caracteres';
      }
      return true;
    },
    email: (value) => {
      if (!value) {
        return 'El campo correo es obligatorio.';
      }
      return true;
    },
    people_id: (value) => {
      if (!value) {
        return 'El campo tutor es obligatorio.';
      }
      return true;
    },
    school_id: (value) => {
      if (!value) {
        return 'El campo colegio es obligatorio.';
      }
      return true;
    },
  },
  initialValues: initialFormState,
});

const { value: names, errorMessage: namesError } = useField('names');
const { value: surnames, errorMessage: surnamesError } = useField('surnames');
const { value: birthdate, errorMessage: birthdateError } = useField('birthdate');
const { value: course, errorMessage: courseError } = useField('course');
const { value: phone, errorMessage: phoneError } = useField('phone');
const { value: email, errorMessage: emailError } = useField('email');
const { value: people_id, errorMessage: people_idError } = useField('people_id');
const { value: school_id, errorMessage: school_idError } = useField('school_id');

const peopleItems = ref([]);
const schoolItems = ref([]);
const loadingForm = ref(false);
const itemsCourse = ref([
  { title: 'Nidito', value: 1 },
  { title: 'Pre - Kinder', value: 2 },
  { title: 'Kinder', value: 3 },
  { title: '1º Primaria', value: 4 },
  { title: '2º Primaria', value: 5 },
  { title: '3º Primaria', value: 6 },
  { title: '4º Primaria', value: 7 },
  { title: '5º Primaria', value: 8 },
  { title: '6º Primaria', value: 9 },
  { title: '1º Secundaria', value: 10 },
  { title: '2º Secundaria', value: 11 },
  { title: '3º Secundaria', value: 12 },
  { title: '4º Secundaria', value: 13 },
  { title: '5º Secundaria', value: 14 },
  { title: '6º Secundaria', value: 15 },
]);

const searchSchool = ref('');
const loadingSchool = ref(false);
const newSchool = ref('');
const comboSchoolRef = ref(null);
const searchPeople = ref('');
const loadingPeople = ref(false);
const newPeople = ref('');
const comboPeopleRef = ref(null);
const isDialogPeopleVisible = ref(false);

const closeDialog = () => {
  emit('update:isDialogVisible', false);
  peopleItems.value = []
  schoolItems.value = []
  resetForm();
};

const openDialogPeople = () => {
  isDialogPeopleVisible.value = true;
};

const handleDialogPeopleClose = (value) => {
  isDialogPeopleVisible.value = value
}

const handleNewPeopleRegistered = (newPeople) => {
  peopleItems.value.push(newPeople);
  people_id.value = newPeople;
};

const showSnackbar = (message) => {
  snackbarStore.showSnackbar(message);
};

const addSchool = async () => {
  loadingSchool.value = true;
  try {
    const response = await SchoolService.storeSchool({ name: newSchool.value });
    if (response.status == 201) {
      const newSchoolData = response.data.data;
      schoolItems.value.push(newSchoolData);
      school_id.value = newSchoolData;
      newSchool.value = '';
      showSnackbar('Se Registro Correctamente')

      if (comboSchoolRef.value) {
        comboSchoolRef.value.blur();
        setTimeout(() => {
          comboSchoolRef.value.focus();
          comboSchoolRef.value.blur();
        }, 0);
      }
    }
  } catch (error) {
    loadingSchool.value = false;
  } finally {
    loadingSchool.value = false;
  }
};

const debouncedSearchSchools = debounce(async (newSearch) => {
  if (newSearch) {
    newSchool.value = newSearch;
    loadingSchool.value = true;
    try {
      const response = await SchoolService.searchSchools({ column: 'name', value: newSearch });
      schoolItems.value = response.data;
      if (!response.data.length) {
        newSchool.value = newSearch;
      }
    } catch (error) {
      loadingSchool.value = false;
    } finally {
      loadingSchool.value = false;
    }
  } else {
    schoolItems.value = [];
    newSchool.value = '';
  }
}, 300);

const debouncedSearchPeoples = debounce(async (newSearch) => {
  if (newSearch) {
    newPeople.value = newSearch;
    loadingPeople.value = true;
    try {
      const response = await PeopleService.searchPeoples({ column: 'names', value: newSearch });
      peopleItems.value = response.data;
      if (!response.data.length) {
        newPeople.value = newSearch;
      }
    } catch (error) {
      loadingPeople.value = false;
    } finally {
      loadingPeople.value = false;
    }
  } else {
    peopleItems.value = [];
    newPeople.value = '';
  }
}, 300);

watch(searchSchool, (newSearch) => {
  debouncedSearchSchools(newSearch);
});

watch(searchPeople, (newSearch) => {
  debouncedSearchPeoples(newSearch);
});

watch(
  () => props.patient,
  (newPatient) => {
    if (newPatient) {
      setValues({
        names: newPatient.names,
        surnames: newPatient.surnames,
        birthdate: newPatient.birthdate,
        course: itemsCourse.value.find((course) => course.value === newPatient.course),
        phone: newPatient.phone,
        email: newPatient.email,
        people_id: newPatient.people,
        school_id: newPatient.school,
      });
      peopleItems.value.push(newPatient.people);
      schoolItems.value.push(newPatient.school);
    } else {
      resetForm();
    }
  },
  { immediate: true }
);

const createPatient = async () => {
  try {
    loadingForm.value = true;
    const data = {
      names: names.value,
      surnames: surnames.value,
      birthdate: birthdate.value,
      course: course.value ? course.value.value : null,
      phone: phone.value,
      email: email.value,
      people_id: people_id.value ? people_id.value.id : null,
      school_id: school_id.value ? school_id.value.id : null,
    };
    let response;
    if (props.patient) {
      response = await PatientService.updatePatient(props.patient.id, data);
      if (response.status == 200) {
        showSnackbar(response.data.message);
      }
    } else {
      response = await PatientService.storePatient(data);
      if (response.status == 201) {
        showSnackbar(response.data.message);
      }
    }
    loadingForm.value = false;
    closeDialog();
  } catch (err) {
    console.log(err);
    if (err.response.status === 422) {
      const backendErrors = err.response.data.errors;
      setErrors(backendErrors);
    }
    loadingForm.value = false;
  }
};
</script>

<template>
  <VDialog
    :model-value="isDialogVisible"
    @update:model-value="value => emit('update:isDialogVisible', value)"
    transition="dialog-bottom-transition"
    :persistent="loadingForm"
    max-width="1000"
  >
    <!-- Dialog Content -->
    <VCard prepend-icon="tabler-user-check" :disabled="loadingForm" :loading="loadingForm"  subtitle="Los campos con (*) son obligatorios">
      <template v-slot:title>
        <span class="font-weight-black">{{ props.patient ? 'Editar Paciente' : 'Registrar Paciente' }}</span>
      </template>
      <VCardText>
        <VRow>
          <VCol cols="12" sm="6">
            <v-text-field v-model="names" label="Nombre(s) *" :error-messages="namesError"></v-text-field>
          </VCol>
          <VCol cols="12" sm="6">
            <v-text-field v-model="surnames" label="Apellidos *" :error-messages="surnamesError"></v-text-field>
          </VCol>
          <VCol cols="12" sm="6">
            <v-text-field type="date" v-model="birthdate" label="Fecha Nacimiento *" :error-messages="birthdateError"></v-text-field>
          </VCol>
          <VCol cols="12" sm="6">
            <v-text-field v-model="phone" label="Teléfono" :error-messages="phoneError"></v-text-field>
          </VCol>
          <VCol cols="12" sm="6">
            <v-text-field v-model="email" label="Correo" :error-messages="emailError"></v-text-field>
          </VCol>
          <VCol cols="12" sm="6">
            <v-combobox
              ref="comboPeopleRef"
              v-model="people_id"
              :items="peopleItems"
              item-title="fullname"
              item-value="id"
              label="Tutor *"
              clearable
              :loading="loadingPeople"
              v-model:search="searchPeople"
              :hide-no-data="false"
              :error-messages="people_idError"
            >
              <template v-slot:no-data>
                <div v-if="!searchPeople">
                  <v-list-item>
                    <v-list-item-title>
                      Sin resultados
                    </v-list-item-title>
                  </v-list-item>
                </div>
                <div v-else>
                  <v-list-item>
                    <v-list-item-title>
                      No se encontró: <strong>"{{ searchPeople }}"</strong>
                    </v-list-item-title>
                  </v-list-item>
                </div>
              </template>
              <template v-slot:append>
                <VBtn
                  @click="openDialogPeople"
                  density="comfortable"
                  variant="tonal"
                  icon="tabler-user-plus"
                  rounded
                  title="Registrar un nuevo tutor"
                />
              </template>
            </v-combobox>
          </VCol>
          <VCol cols="12" sm="6">
            <v-combobox
              ref="comboSchoolRef"
              v-model="school_id"
              :items="schoolItems"
              item-title="name"
              item-value="id"
              label="Colegio *"
              clearable
              :loading="loadingSchool"
              v-model:search="searchSchool"
              :hide-no-data="false"
              :error-messages="school_idError"
            >
              <template v-slot:no-data>
                <div v-if="!searchSchool">
                  <v-list-item>
                    <v-list-item-title>
                      Sin resultados
                    </v-list-item-title>
                  </v-list-item>
                </div>
                <div v-else>
                  <v-list-item>
                    <v-list-item-title>
                      No se encontró: <strong>"{{ searchSchool }}"</strong>, ¿desea agregarlo?
                      <VBtn
                        density="comfortable"
                        icon="tabler-circle-plus"
                        color="secondary"
                        rounded
                        size="small"
                        :disabled="loadingSchool"
                        @click="addSchool"
                      />
                    </v-list-item-title>
                  </v-list-item>
                </div>
              </template>
            </v-combobox>
          </VCol>
          <VCol cols="12" sm="6">
            <v-combobox
              v-model="course"
              :items="itemsCourse"
              item-title="title"
              item-value="value"
              label="Curso *"
              clearable
              :error-messages="courseError"
            ></v-combobox>
          </VCol>
        </VRow>
      </VCardText>

      <VCardText class="d-flex justify-end flex-wrap gap-3">
        <VBtn variant="tonal" color="secondary" @click="closeDialog">
          <VIcon icon="tabler-circle-x" />
          Cancelar
        </VBtn>
        <VBtn @click="createPatient">
          <VIcon icon="tabler-circle-check" />
          {{ props.patient ? 'Actualizar' : 'Registrar' }}
        </VBtn>
      </VCardText>
    </VCard>
  </VDialog>
  <!-- Componente FormPeople -->
  <FormPeople :isDialogPeopleVisible="isDialogPeopleVisible" :title="'Registrar Tutor'" @update:isDialogPeopleVisible="handleDialogPeopleClose" @newPeopleRegistered="handleNewPeopleRegistered" />
</template>
