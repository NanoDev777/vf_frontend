<script setup>
import { API_URL } from '@/services/config';
import { useUserStore } from '@/stores/user';
import myUpload from 'vue-image-crop-upload';

const props = defineProps({
  userData: {
    type: Object,
    required: true,
  },
})

defineComponent({
  components: {
    myUpload
  }
});
const token = useCookie('accessToken').value;
const userStore = useUserStore();
const avatar = computed(() => userStore.avatar);
const showAvatar = ref(false);
const url = ref(API_URL);
const isUserInfoEditDialogVisible = ref(false);
const isUpgradePlanDialogVisible = ref(false);
const headers = ref({
  authorization: "Bearer " + token
});

const langExt = ref({
  hint: 'Haga clic o arrastre el archivo aquí para cargarlo.',
  loading: 'Subiendo…',
  noSupported: 'El navegador no es compatible; utilice IE10+ u otros navegadores',
  success: 'Carga Exitosa',
  fail: 'Carga Fallida',
  preview: 'Vista Previa',
  btn: {
    off: 'Cancelar',
    close: 'Cerrar',
    back: 'Volver',
    save: 'Cargar Imagen'
  },
  error: {
    onlyImg: 'Sólo imagen',
    outOfSize: 'La imagen excede el límite de tamaño: ',
    lowestPx: 'El tamaño de la imagen es demasiado bajo. Se espera al menos: '
  }
});

const toggleShowAvatar = () => {
  showAvatar.value = !showAvatar.value;
};

const resolveUserStatusVariant = stat => {
  if (stat === 'Activo')
    return 'success'
  if (stat === 'Inactivo')
    return 'secondary'
}

const resolveUserRoleVariant = role => {
  return {
    color: 'primary',
    icon: 'tabler-user',
  }
}

const addPrefixToBase64 = (base64String) => {
  return `data:image/png;base64,${base64String}`
}

const cropUploadSuccess = (jsonData, field) => {
  userStore.setAvatar(jsonData.data.img);
}

const cropUploadFail = (imgDataUrlValue, field) => {
  imgDataUrl.value = imgDataUrlValue;
}
</script>

<template>
  <VRow v-if="props.userData">
    <my-upload
      field="img"
      @crop-upload-success="cropUploadSuccess"
      @crop-upload-fail="cropUploadFail"
      v-model="showAvatar"
      :width="300"
      :height="300"
      :url="`${url}/upload/avatar`"
      :headers="headers"
      :langExt="langExt"
      img-format="png"
    ></my-upload>
    <!-- SECTION User Details -->
    <VCol cols="12">
      <VCard>
        <VCardText class="text-center pt-15">
          <!-- 👉 Avatar -->
          <VAvatar
            rounded
            :size="100"
            :color="!avatar ? 'primary' : undefined"
            :variant="!avatar ? 'tonal' : undefined"
          >
            <VImg
              v-if="avatar"
              :src="addPrefixToBase64(avatar)"
            />
            <span
              v-else
              class="text-5xl font-weight-medium"
            >
              {{ avatarText(props.userData.fullName) }}
            </span>
          </VAvatar>

          <!-- 👉 User fullName -->
          <h6 class="text-h4 mt-4">
            {{ props.userData.fullName }}
          </h6>

          <!-- 👉 Role chip -->
          <VChip
            label
            :color="resolveUserRoleVariant(props.userData.role).color"
            size="small"
            class="text-capitalize mt-3"
          >
            {{ props.userData.role }}
          </VChip>
        </VCardText>

        <VCardText>
          <div class="d-flex justify-center flex-wrap gap-5">
            <!-- 👉 Done task -->
            <div class="d-flex align-center me-8">
              <VAvatar
                :size="38"
                rounded
                color="primary"
                variant="tonal"
                class="me-3"
              >
                <VIcon
                  icon="tabler-checkbox"
                  size="28"
                />
              </VAvatar>
              <div>
                <div class="text-body-1 font-weight-medium">
                  100
                </div>
                <span class="text-sm">Consultas</span>
              </div>
            </div>

            <!-- 👉 Done Project -->
            <div class="d-flex align-center me-4">
              <VAvatar
                :size="38"
                rounded
                color="primary"
                variant="tonal"
                class="me-3"
              >
                <VIcon
                  icon="tabler-briefcase"
                  size="28"
                />
              </VAvatar>
              <div>
                <div class="font-weight-medium">
                  200
                </div>
                <span class="text-sm">Tratamientos</span>
              </div>
            </div>
          </div>
        </VCardText>

        <VDivider />

        <!-- 👉 Details -->
        <VCardText>
          <p class="text-sm text-uppercase text-disabled">
            Detalles
          </p>

          <!-- 👉 User Details list -->
          <VList class="card-list mt-2">
            <VListItem>
              <VListItemTitle>
                <h6 class="text-h6">
                  Usuario:
                  <span class="text-body-1">
                    {{ props.userData.username }}
                  </span>
                </h6>
              </VListItemTitle>
            </VListItem>

            <VListItem>
              <VListItemTitle>
                <h6 class="text-h6">
                  Correo:
                  <span class="text-body-1">{{ props.userData.email }}</span>
                </h6>
              </VListItemTitle>
            </VListItem>

            <VListItem>
              <VListItemTitle>
                <h6 class="text-h6">
                  Estado:
                  <VChip
                    label
                    size="small"
                    :color="resolveUserStatusVariant(props.userData.status)"
                    class="text-capitalize"
                  >
                    {{ props.userData.status }}
                  </VChip>
                </h6>
              </VListItemTitle>
            </VListItem>

            <VListItem>
              <VListItemTitle>
                <h6 class="text-h6">
                  Rol:
                  <span class="text-capitalize text-body-1">{{ props.userData.role }}</span>
                </h6>
              </VListItemTitle>
            </VListItem>

            <VListItem>
              <VListItemTitle>
                <h6 class="text-h6">
                  Teléfono:
                  <span class="text-body-1">
                    {{ props.userData.phone }}
                  </span>
                </h6>
              </VListItemTitle>
            </VListItem>

            <VListItem>
              <VListItemTitle>
                <h6 class="text-h6">
                  Dirección:
                  <span class="text-body-1">{{ props.userData.address }}</span>
                </h6>
              </VListItemTitle>
            </VListItem>
          </VList>
        </VCardText>

        <!-- 👉 Edit and Suspend button -->
        <VCardText class="d-flex justify-center">
          <VBtn
            variant="elevated"
            class="me-4"
            @click="isUserInfoEditDialogVisible = true"
          >
            Editar
          </VBtn>

          <VBtn
            variant="tonal"
            color="secondary"
            class="me-4"
            @click="toggleShowAvatar"
          >
            Imagen
          </VBtn>

          <VBtn
            variant="tonal"
            color="error"
          >
            Suspender
          </VBtn>
        </VCardText>
      </VCard>
    </VCol>
    <!-- !SECTION -->
  </VRow>

  <!-- 👉 Edit user info dialog -->
  <UserInfoEditDialog
    v-model:isDialogVisible="isUserInfoEditDialogVisible"
    :user-data="props.userData"
  />

  <!-- 👉 Upgrade plan dialog -->
  <UserUpgradePlanDialog v-model:isDialogVisible="isUpgradePlanDialogVisible" />
</template>

<style lang="scss" scoped>
.card-list {
  --v-card-list-gap: 0.75rem;
}

.text-capitalize {
  text-transform: capitalize !important;
}
</style>
