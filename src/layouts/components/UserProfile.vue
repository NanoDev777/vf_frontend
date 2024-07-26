<script setup>
import AuthService from '@/services/auth.service';
import { useLoaderStore } from '@/stores/loader';
import { useUserStore } from '@/stores/user';
import { PerfectScrollbar } from 'vue3-perfect-scrollbar';

const loaderStore = useLoaderStore();
const router = useRouter()
const ability = useAbility()

// TODO: Get type from backend
const userData = useCookie('userData')
const userStore = useUserStore();
const avatar = computed(() => userStore.avatar);

const logout = async () => {
  try {
    loaderStore.showLoader();
    const response = await AuthService.logout();
    if (response.status == 200) {
      window.location.href = '/login';
      useCookie('accessToken').value = null
      userStore.clearAvatar();
      userData.value = null
      useCookie('userAbilityRules').value = null
      ability.update([])
      // await router.push('/login')
    }
  } catch (err) {
    loaderStore.hideLoader();
  }
}

const addPrefixToBase64 = (base64String) => {
  return `data:image/png;base64,${base64String}`
}

const userProfileList = [
  { type: 'divider' },
  {
    type: 'navItem',
    icon: 'tabler-user',
    title: 'Perfil',
    to: {
      name: 'user-profile',
      params: { id: 21 },
    },
  },
  { type: 'divider' },
  {
    type: 'navItem',
    icon: 'tabler-logout',
    title: 'Cerrar Sesión',
    onClick: logout,
  },
]
</script>

<template>
  <VBadge
    v-if="userData"
    dot
    bordered
    location="bottom right"
    offset-x="3"
    offset-y="3"
    color="success"
  >
    <VAvatar
      class="cursor-pointer"
      :color="'primary'"
      :variant="'tonal'"
    >
      <VImg
        v-if="userData && avatar"
        :src="addPrefixToBase64(avatar)"
      />
      <VIcon
        v-else
        icon="tabler-user"
      />

      <!-- SECTION Menu -->
      <VMenu
        activator="parent"
        width="230"
        location="bottom end"
        offset="14px"
      >
        <VList>
          <VListItem>
            <template #prepend>
              <VListItemAction start>
                <VBadge
                  dot
                  location="bottom right"
                  offset-x="3"
                  offset-y="3"
                  color="success"
                  bordered
                >
                  <VAvatar
                    :color="!(userData && avatar) ? 'primary' : undefined"
                    :variant="!(userData && avatar) ? 'tonal' : undefined"
                  >
                    <VImg
                      v-if="userData && avatar"
                      :src="addPrefixToBase64(avatar)"
                    />
                    <VIcon
                      v-else
                      icon="tabler-user"
                    />
                  </VAvatar>
                </VBadge>
              </VListItemAction>
            </template>

            <VListItemTitle class="font-weight-medium">
              {{ userData.fullName || userData.username }}
            </VListItemTitle>
            <VListItemSubtitle>{{ userData.role }}</VListItemSubtitle>
          </VListItem>

          <PerfectScrollbar :options="{ wheelPropagation: false }">
            <template
              v-for="item in userProfileList"
              :key="item.title"
            >
              <VListItem
                v-if="item.type === 'navItem'"
                :to="item.to"
                @click="item.onClick && item.onClick()"
              >
                <template #prepend>
                  <VIcon
                    class="me-2"
                    :icon="item.icon"
                    size="22"
                  />
                </template>

                <VListItemTitle>{{ item.title }}</VListItemTitle>

                <template
                  v-if="item.badgeProps"
                  #append
                >
                  <VBadge v-bind="item.badgeProps" />
                </template>
              </VListItem>

              <VDivider
                v-else
                class="my-2"
              />
            </template>
          </PerfectScrollbar>
        </VList>
      </VMenu>
      <!-- !SECTION -->
    </VAvatar>
  </VBadge>
</template>
