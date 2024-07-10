<script setup>
import FeedbackMessage from '@core/components/FeedbackMessage.vue'
import Loader from '@core/components/Loader.vue'
import ScrollToTop from '@core/components/ScrollToTop.vue'
import SnackbarMessage from '@core/components/SnackbarMessage.vue'
import initCore from '@core/initCore'
import {
  initConfigStore,
  useConfigStore,
} from '@core/stores/config'
import { hexToRgb } from '@layouts/utils'
import { useRouter } from 'vue-router'
import { useTheme } from 'vuetify'
import { setupInterceptors } from './services/http'
import { useLoaderStore } from './stores/loader'
import { useMessageStore } from './stores/message'
const { global } = useTheme()

// ℹ️ Sync current theme with initial loader theme
initCore()
initConfigStore()
const router = useRouter()
const messageStore = useMessageStore()
setupInterceptors(messageStore, router)
const loaderStore = useLoaderStore()
const configStore = useConfigStore()
</script>

<template>
  <VLocaleProvider :rtl="configStore.isAppRTL">
    <!-- ℹ️ This is required to set the background color of active nav link based on currently active global theme's primary -->
    <VApp :style="`--v-global-theme-primary: ${hexToRgb(global.current.value.colors.primary)}`">
      <RouterView />
      <Loader />
      <SnackbarMessage />
      <FeedbackMessage />
      <ScrollToTop />
    </VApp>
  </VLocaleProvider>
</template>
