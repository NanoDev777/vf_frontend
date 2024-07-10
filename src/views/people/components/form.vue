<script setup>
import CityService from '@/services/city.service';
import PeopleService from '@/services/people.service';
import { useSnackbarStore } from '@/stores/snackbar';
import { useField, useForm } from 'vee-validate';
import { defineEmits, defineProps, ref, toRefs, watch } from 'vue';

const snackbarStore = useSnackbarStore();

const props = defineProps({
  isDialogPeopleVisible: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  people: {
    type: Object,
    default: null,
  }
});

const emit = defineEmits(['update:isDialogPeopleVisible', 'newPeopleRegistered']);
const { isDialogPeopleVisible } = toRefs(props);

const getInitialFormState = () => ({
  names: '',
  surnames: '',
  ci: '',
  phone: '',
  address: '',
  email: '',
  city_id: null,
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
    email: (value) => {
      if (!value) {
        return 'El campo correo es obligatorio.';
      }
      return true;
    },
    city_id: (value) => {
      if (!value) {
        return 'El campo ciudad es obligatorio.';
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
const { value: email, errorMessage: emailError } = useField('email');
const { value: city_id, errorMessage: city_idError } = useField('city_id');

const cityItems = ref([]);
const loadingForm = ref(false);

const closeDialog = () => {
  emit('update:isDialogPeopleVisible', false);
  resetForm();
};

const showSnackbar = (message) => {
  snackbarStore.showSnackbar(message);
};

const loadCities = async () => {
  try {
    loadingForm.value = true
    const response = await CityService.listCities();
    if (response.status == 200) {
      cityItems.value = response.data;
      loadingForm.value = false;
    }
  } catch (error) {
    loadingForm.value = false;
  }
};

watch(isDialogPeopleVisible, (newValue) => {
  if (newValue) {
    loadCities();
  }
});

watch(
  () => props.people,
  (newPeople) => {
    if (newPeople) {
      setValues({
        names: newPeople.names,
        surnames: newPeople.surnames,
        ci: newPeople.ci,
        phone: newPeople.phone,
        address: newPeople.address,
        email: newPeople.email,
        city_id: newPeople.city,
      });
      cityItems.value.push(newPeople.city);
    } else {
      resetForm();
    }
  },
  { immediate: true }
);

const createPeople = async () => {
  try {
    loadingForm.value = true;
    const data = {
      names: names.value,
      surnames: surnames.value,
      ci: ci.value,
      phone: phone.value,
      address: address.value,
      email: email.value,
      city_id: city_id.value ? city_id.value.id : null
    }
    let response;
    if (props.people) {
      response = await PeopleService.updatePeople(props.people.id, data);
      if (response.status == 200) {
        showSnackbar(response.data.message);
      }
    } else {
      response = await PeopleService.storePeople(data);
      if (response.status == 201) {
        emit('newPeopleRegistered', response.data.data);
        showSnackbar(response.data.message);
      }
    }
    loadingForm.value = false;
    closeDialog();
    // const response = await PeopleService.storePeople(data);
    // if (response.status == 201) {
    //   loadingForm.value = false
    //   emit('newPeopleRegistered', response.data.data);
    //   closeDialog();
    //   showSnackbar(response.data.message);
    // }
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
    :model-value="isDialogPeopleVisible"
    @update:model-value="value => emit('update:isDialogPeopleVisible', value)"
    transition="dialog-bottom-transition"
    :persistent="loadingForm"
    max-width="1000"
  >
    <!-- Dialog Content -->
    <VCard prepend-icon="tabler-user-check" :disabled="loadingForm" :loading="loadingForm" subtitle="Los campos con (*) son obligatorios">
      <template v-slot:title>
        <span class="font-weight-black">{{ props.people ? 'Editar Cliente' : title }}</span>
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
            <v-text-field v-model="email" label="Correo *" :error-messages="emailError"></v-text-field>
          </VCol>
          <VCol cols="12" sm="6">
            <v-combobox
              v-model="city_id"
              :items="cityItems"
              item-title="description"
              item-value="id"
              label="Ciudad *"
              :error-messages="city_idError"
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
        <VBtn @click="createPeople">
          <VIcon icon="tabler-circle-check" />
          {{ props.people ? 'Actualizar' : 'Registrar' }}
        </VBtn>
      </VCardText>
    </VCard>
  </VDialog>
</template>
