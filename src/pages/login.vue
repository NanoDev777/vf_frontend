<script setup>
import { useUserStore } from '@/stores/user';
import imgUrl from '@images/logo.png';
import authV1BottomShape from '@images/svg/auth-v1-bottom-shape.svg?raw';
import authV1TopShape from '@images/svg/auth-v1-top-shape.svg?raw';
import { VNodeRenderer } from '@layouts/components/VNodeRenderer';
import { useField, useForm } from 'vee-validate';

definePage({ meta: { layout: 'blank', unauthenticatedOnly: true, } });
const userStore = useUserStore();
const isPasswordVisible = ref(false);
const loading = ref(false);
const route = useRoute();
const router = useRouter();
const ability = useAbility();
const message = ref(null);

// Esquema de validación
const { handleSubmit, handleReset, errors, setErrors } = useForm({
  validationSchema: {
    username: (value) => {
      if (!value) {
        return 'El campo nombre usuario es obligatorio.';
      }
      return true;
    },
    password: (value) => {
      if (!value) {
        return 'El campo contraseña es obligatorio.';
      }
      if (value.length < 8) {
        return 'La contraseña debe tener al menos 8 caracteres';
      }
      return true;
    }
  }
});

// Definir los campos usando useField
const { value: username, errorMessage: usernameError } = useField('username');
const { value: password, errorMessage: passwordError } = useField('password');
const rememberMe = ref(false);

// Función de login
const login = async (values) => {
  try {
    loading.value = true;
    const res = await $api('/login', {
      method: 'POST',
      body: {
        username: values.username,
        password: values.password,
      },
      onResponseError({ response }) {
        message.value = response._data.message;
        if (response.status === 422 && response._data.errors) {
          const backendErrors = response._data.errors;
          setErrors(backendErrors);
        }
      },
    });

    if (res.success) {
      loading.value = false;
    }

    const { accessToken, userData, avatar, userAbilityRules } = res;
    userStore.setAvatar(avatar);
    useCookie('userAbilityRules').value = userAbilityRules;
    ability.update(userAbilityRules);
    useCookie('userData').value = userData;
    useCookie('accessToken').value = accessToken;
    await nextTick(() => {
      router.replace(route.query.to ? String(route.query.to) : '/');
    });
  } catch (err) {
    loading.value = false;
  }
};

const onSubmit = handleSubmit((values) => {
  message.value = null;
  login(values);
});
</script>

<template>
  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <div class="position-relative my-sm-16">
      <!-- 👉 Top shape -->
      <VNodeRenderer
        :nodes="h('div', { innerHTML: authV1TopShape })"
        class="text-primary auth-v1-top-shape d-none d-sm-block"
      />

      <!-- 👉 Bottom shape -->
      <VNodeRenderer
        :nodes="h('div', { innerHTML: authV1BottomShape })"
        class="text-primary auth-v1-bottom-shape d-none d-sm-block"
      />

      <!-- 👉 Auth Card -->
      <VCard
        class="auth-card pa-4"
        max-width="448"
      >
        <VCardItem class="justify-center">
          <template #prepend>
            <div class="d-flex">
              <img width="200" :src="imgUrl" />
            </div>
          </template>
        </VCardItem>

        <VCardText class="pt-1">
          <h4 class="text-h4 mb-1">
            Bienvenido! 👋🏻
          </h4>
          <p class="mb-0">
            Inicie sesión para ingresar al sistema.
          </p>
        </VCardText>

        <VCardText>
          <VForm @submit.prevent="onSubmit">
            <VRow>
              <VCol cols="12">
                <v-alert
                  v-if="message"
                  border="top"
                  type="warning"
                  prominent
                  variant="outlined"
                  closable
                  class="mb-4"
                >
                  {{ message }}
                </v-alert>
                <v-text-field 
                  v-model="username"
                  autofocus
                  label="Usuario"
                  type="text"
                  :error-messages="usernameError"
                ></v-text-field>
              </VCol>

              <!-- password -->
              <VCol cols="12">
                <v-text-field 
                  v-model="password"
                  label="Contraseña"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                  @click:append-inner="isPasswordVisible = !isPasswordVisible"
                  :error-messages="passwordError"
                ></v-text-field>

                <!-- remember me checkbox -->
                <div class="d-flex align-center justify-space-between flex-wrap mt-2 mb-4">
                  <VCheckbox
                    v-model="rememberMe"
                    label="Recordarme"
                  />

                  <RouterLink
                    class="text-primary ms-2 mb-1"
                    :to="{ name: 'pages-authentication-forgot-password-v1' }"
                  >
                    ¿Has olvidado tu contraseña?
                  </RouterLink>
                </div>

                <!-- login button -->
                <VBtn
                  block
                  type="submit"
                  :disabled="loading"
                >
                <v-progress-circular
                    v-if="loading"
                    indeterminate
                    :width="4"
                    :size="25"
                    color="green"
                  ></v-progress-circular>
                  <span v-else>INGRESAR</span> 
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </div>
  </div>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";
</style>
