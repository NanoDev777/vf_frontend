<script setup>
import { useGenerateImageVariant } from '@core/composable/useGenerateImageVariant';
import miscMaskDark from '@images/pages/misc-mask-dark.png';
import miscMaskLight from '@images/pages/misc-mask-light.png';

definePage({
  alias: '/pages/misc/not-authorized',
  meta: {
    layout: 'blank',
    public: true,
  },
})

const authThemeMask = useGenerateImageVariant(miscMaskLight, miscMaskDark)
</script>

<template>
  <div class="misc-wrapper">
    <ErrorHeader
      status-code="401"
      title="No estas autorizado! 🔐"
      description="No tienes permiso para ver esta página con las credenciales que proporcionaste al iniciar sesión. Ponte en contacto con el administrador del sitio."
    />

    <VBtn
      class="mt-2 mb-10"
      to="/"
    >
      Volver al inicio
    </VBtn>

  </div>
</template>

<style lang="scss">
@use "@core/scss/template/pages/misc.scss";
</style>
