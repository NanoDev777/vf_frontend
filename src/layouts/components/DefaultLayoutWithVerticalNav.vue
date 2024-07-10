<script setup>
import navItems from '@/navigation/vertical'

// Components
import Footer from '@/layouts/components/Footer.vue'
import NavBarNotifications from '@/layouts/components/NavBarNotifications.vue'
import NavbarShortcuts from '@/layouts/components/NavbarShortcuts.vue'
import UserProfile from '@/layouts/components/UserProfile.vue'

// @layouts plugin
import { useConfigStore } from '@core/stores/config'
import { VerticalNavLayout } from '@layouts'
import {
  AppContentLayoutNav
} from '@layouts/enums'

const configStore = useConfigStore()
const currentLayout = ref(configStore.isVerticalNavCollapsed ? 'collapsed' : configStore.appContentLayoutNav)

const setCollapse = () => {
  configStore.isVerticalNavCollapsed = !configStore.isVerticalNavCollapsed
  if(configStore.isVerticalNavCollapsed){
    currentLayout.value = 'collapsed'
  } else {
    currentLayout.value = 'vertical'
  }
}

watch(currentLayout, () => {
  if (currentLayout.value === 'collapsed') {
    configStore.appContentLayoutNav = AppContentLayoutNav.Vertical
  } else {
    configStore.appContentLayoutNav = currentLayout.value
  }
})

// SECTION: Loading Indicator
const isFallbackStateActive = ref(false)
const refLoadingIndicator = ref(null)

watch([
  isFallbackStateActive,
  refLoadingIndicator,
], () => {
  if (isFallbackStateActive.value && refLoadingIndicator.value)
    refLoadingIndicator.value.fallbackHandle()
  if (!isFallbackStateActive.value && refLoadingIndicator.value)
    refLoadingIndicator.value.resolveHandle()
}, { immediate: true })
// !SECTION

// Date and time handling
const currentDate = ref(new Date())

setInterval(() => {
  currentDate.value = new Date()
}, 1000)

const formattedDate = computed(() => {
  return currentDate.value.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
})

const formattedTime = computed(() => {
  return currentDate.value.toLocaleTimeString()
})

const items = [
        {
          title: 'Dashboard',
          disabled: false,
          href: 'breadcrumbs_dashboard',
        },
        {
          title: 'Link 1',
          disabled: false,
          href: 'breadcrumbs_link_1',
        },
        {
          title: 'Link 2',
          disabled: true,
          href: 'breadcrumbs_link_2',
        },
      ];
</script>
<template>
  <VerticalNavLayout :nav-items="navItems">
    <!-- 👉 navbar -->
    <template #navbar="{ toggleVerticalOverlayNavActive }">
      <div class="d-flex h-100 align-center">
        <IconBtn
          id="vertical-nav-toggle-btn"
          class="ms-n3 d-lg-none"
          @click="toggleVerticalOverlayNavActive(true)"
        >
          <VIcon
            size="26"
            icon="tabler-menu-2"
          />
        </IconBtn>

        <IconBtn
          @click="setCollapse"
          class="d-none d-lg-block"
        >
          <VIcon
            v-if="configStore.isVerticalNavCollapsed == false"
            size="26"
            icon="tabler-menu-deep"
          />
          <VIcon
            v-else
            size="26"
            icon="tabler-menu-2"
          />
        </IconBtn>

        <!-- Date and Time Display -->
        <div class="text-center ml-3">
          <div class="text-h5 text-primary fw-bold">{{ formattedDate }}</div>
          <div class="text-h6 text-muted" style="font-size: smaller;">{{ formattedTime }}</div>
        </div>

        <VSpacer />

        <!-- <NavbarThemeSwitcher /> -->
        <NavbarShortcuts />
        <NavBarNotifications class="me-2" />
        <UserProfile />
      </div>
    </template>

    <AppLoadingIndicator ref="refLoadingIndicator" />

    <!-- 👉 Pages -->
    <RouterView v-slot="{ Component }">
      <Suspense
        :timeout="0"
        @fallback="isFallbackStateActive = true"
        @resolve="isFallbackStateActive = false"
      >
        <Component :is="Component" />
      </Suspense>
    </RouterView>

    <!-- 👉 Footer -->
    <template #footer>
      <Footer />
    </template>

    

  </VerticalNavLayout>
</template>
