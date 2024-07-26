<script setup>
const notifications = ref([
  {
    type: 'New for you',
    email: true,
    browser: false,
    app: false,
  },
  {
    type: 'Account activity',
    email: false,
    browser: true,
    app: true,
  },
  {
    type: 'A new browser used to sign in',
    email: true,
    browser: true,
    app: true,
  },
  {
    type: 'A new device is linked',
    email: false,
    browser: true,
    app: false,
  },
])
</script>

<template>
  <VCard class="user-tab-notification">
    <VCardItem>
      <VCardTitle>Notificaciones</VCardTitle>
      <p class="text-base mt-2 mb-0">
        Recibirá una notificación sobre los artículos seleccionados a continuación.
      </p>
    </VCardItem>
    <VCardText>
      <VTable class="border rounded text-no-wrap">
        <thead>
          <tr>
            <th scope="col">
              TIPO
            </th>
            <th scope="col">
              CORREO
            </th>
            <th scope="col">
              WHATSAPP
            </th>
            <th scope="col">
              WEB
            </th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="notification in notifications"
            :key="notification.type"
          >
            <td>{{ notification.type }}</td>
            <td>
              <VCheckbox v-model="notification.email" />
            </td>
            <td>
              <VCheckbox v-model="notification.browser" />
            </td>
            <td>
              <VCheckbox v-model="notification.app" />
            </td>
          </tr>
        </tbody>
      </VTable>
    </VCardText>

    <VCardText class="d-flex flex-wrap gap-4">
      <VBtn>Guardar Cambios</VBtn>
      <VBtn
        color="secondary"
        variant="tonal"
      >
        Cancelar
      </VBtn>
    </VCardText>
  </VCard>
</template>
