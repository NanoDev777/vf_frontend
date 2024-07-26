<script setup>
import UserBioPanel from '@/views/apps/user/view/UserBioPanel.vue';
import UserTabAccount from '@/views/apps/user/view/UserTabAccount.vue';
import UserTabNotifications from '@/views/apps/user/view/UserTabNotifications.vue';
import UserTabSecurity from '@/views/apps/user/view/UserTabSecurity.vue';

const route = useRoute('apps-user-view-id')
const userTab = ref(null)
const userData = useCookie('userData')

const tabs = [
  {
    icon: 'tabler-lock',
    title: 'Seguridad',
  },
  {
    icon: 'tabler-bell',
    title: 'Notificaciones',
  },
]

if (userData._value.role != 'Invitado') {
  tabs.unshift({
    icon: 'tabler-user-check',
    title: 'Cuenta',
  });
}

</script>

<template>
  <VRow v-if="userData">
    <VCol
      cols="12"
      md="5"
      lg="4"
    >
      <UserBioPanel :user-data="userData" />
    </VCol>

    <VCol
      cols="12"
      md="7"
      lg="8"
    >
      <VTabs
        v-model="userTab"
      >
        <VTab
          v-for="tab in tabs"
          :key="tab.icon"
        >
          <VIcon
            :size="18"
            :icon="tab.icon"
            class="me-1"
          />
          <span>{{ tab.title }}</span>
        </VTab>
      </VTabs>

      <VWindow
        v-model="userTab"
        class="mt-6 disable-tab-transition"
        :touch="false"
      > 
        <VWindowItem v-if="userData.role != 'Invitado'">
          <UserTabAccount />
        </VWindowItem>

        <VWindowItem>
          <UserTabSecurity />
        </VWindowItem>

        <VWindowItem>
          <UserTabNotifications />
        </VWindowItem>
      </VWindow>
    </VCol>
  </VRow>
  <VCard v-else>
    <VCardTitle class="text-center">
      Usuario no encontrado.
    </VCardTitle>
  </VCard>
</template>
