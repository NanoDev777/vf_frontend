<script setup>
import ProfessionService from '@/services/profession.service';
import TherapistService from '@/services/therapist.service';
import { useSnackbarStore } from '@/stores/snackbar';
import { useField, useForm } from 'vee-validate';
import { defineEmits, defineProps, ref, toRefs, watch } from 'vue';

const snackbarStore = useSnackbarStore();

const props = defineProps({
  isDialogTherapistVisible: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  therapist: {
    type: Object,
    default: null,
  }
});

const emit = defineEmits(['update:isDialogTherapistVisible', 'newTherapistRegistered']);
const { isDialogTherapistVisible } = toRefs(props);

const getInitialFormState = () => ({
  names: '',
  surnames: '',
  ci: '',
  phone: '',
  address: '',
  profession_id: null,
});

const initialFormState = getInitialFormState();

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
    ci: (value) => {
      if (!value) {
        return 'El campo ci es obligatorio.';
      }
      return true;
    },
    phone: (value) => {
      if (!value) {
        return 'El campo phone es obligatorio.';
      }
      if (value.length < 6) {
        return 'El teléfono debe tener al menos 6 caracteres';
      }
      return true;
    },
    address: (value) => {
      if (!value) {
        return 'El campo dirección es obligatorio.';
      }
      return true;
    },
    profession_id: (value) => {
      if (!value) {
        return 'El campo especialidad es obligatorio.';
      }
      return true;
    },
  },
  initialValues: initialFormState,
});

const { value: names, errorMessage: namesError } = useField('names');
const { value: surnames, errorMessage: surnamesError } = useField('surnames');
const { value: ci, errorMessage: ciError } = useField('ci');
const { value: phone, errorMessage: phoneError } = useField('phone');
const { value: address, errorMessage: addressError } = useField('address');
const { value: profession_id, errorMessage: profession_idError } = useField('profession_id');

const professionItems = ref([]);
const loadingForm = ref(false);

const closeDialog = () => {
  emit('update:isDialogTherapistVisible', false);
  resetForm();
};

const showSnackbar = (message) => {
  snackbarStore.showSnackbar(message);
};

const loadCities = async () => {
  try {
    loadingForm.value = true
    const response = await ProfessionService.listProfessions();
    if (response.status == 200) {
      professionItems.value = response.data;
      loadingForm.value = false;
    }
  } catch (error) {
    loadingForm.value = false;
  }
};

watch(isDialogTherapistVisible, (newValue) => {
  if (newValue) {
    loadCities();
  }
});

watch(
  () => props.therapist,
  (newTherapist) => {
    if (newTherapist) {
      setValues({
        names: newTherapist.names,
        surnames: newTherapist.surnames,
        ci: newTherapist.ci,
        phone: newTherapist.phone,
        address: newTherapist.address,
        profession_id: newTherapist.profession,
      });
      professionItems.value.push(newTherapist.profession);
    } else {
      resetForm();
    }
  },
  { immediate: true }
);

const createTherapist = async () => {
  try {
    loadingForm.value = true;
    const data = {
      names: names.value,
      surnames: surnames.value,
      ci: ci.value,
      phone: phone.value,
      address: address.value,
      profession_id: profession_id.value ? profession_id.value.id : null
    }
    let response;
    if (props.therapist) {
      response = await TherapistService.updateTherapist(props.therapist.id, data);
      if (response.status == 200) {
        showSnackbar(response.data.message);
      }
    } else {
      response = await TherapistService.storeTherapist(data);
      if (response.status == 201) {
        emit('newTherapistRegistered', response.data.data);
        showSnackbar(response.data.message);
      }
    }
    loadingForm.value = false;
    closeDialog();
  } catch (err) {
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
    :model-value="isDialogTherapistVisible"
    @update:model-value="value => emit('update:isDialogTherapistVisible', value)"
    transition="dialog-bottom-transition"
    :persistent="loadingForm"
    max-width="1000"
  >
    <!-- Dialog Content -->
    <VCard prepend-icon="tabler-user-check" :disabled="loadingForm" :loading="loadingForm" subtitle="Los campos con (*) son obligatorios">
      <template v-slot:title>
        <span class="font-weight-black">{{ props.therapist ? 'Editar Cliente' : title }}</span>
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
            <v-text-field v-model="ci" label="CI *" :error-messages="ciError"></v-text-field>
          </VCol>
          <VCol cols="12" sm="6">
            <v-text-field v-model="phone" label="Teléfono *" :error-messages="phoneError"></v-text-field>
          </VCol>
          <VCol cols="12" sm="6">
            <v-text-field v-model="address" label="Dirección" :error-messages="addressError"></v-text-field>
          </VCol>
          <VCol cols="12" sm="6">
            <v-combobox
              v-model="profession_id"
              :items="professionItems"
              item-title="name"
              item-value="id"
              label="Especialidad *"
              :error-messages="profession_idError"
              clearable
            ></v-combobox>
          </VCol>
        </VRow>
      </VCardText>

      <VCardText class="d-flex justify-end flex-wrap gap-3">
        <VBtn variant="tonal" color="secondary" @click="closeDialog">
          <VIcon icon="tabler-circle-x" />
          Cancelar
        </VBtn>
        <VBtn @click="createTherapist">
          <VIcon icon="tabler-circle-check" />
          {{ props.therapist ? 'Actualizar' : 'Registrar' }}
        </VBtn>
      </VCardText>
    </VCard>
  </VDialog>
</template>
