<script setup>
import { useGenerateImageVariant } from '@core/composable/useGenerateImageVariant';
import miscMaskDark from '@images/pages/misc-mask-dark.png';
import miscMaskLight from '@images/pages/misc-mask-light.png';

const authThemeMask = useGenerateImageVariant(miscMaskLight, miscMaskDark)

definePage({
  alias: '/pages/misc/not-found/:error(.*)',
  meta: {
    layout: 'blank',
    public: true,
  },
})
</script>

<template>
  <div class="misc-wrapper">
    <ErrorHeader
      status-code="404"
      title="Página No Encontrada ⚠️"
      description="No pudimos encontrar la página que estás buscando."
    />

    <VBtn
      to="/"
      class="mb-12"
    >
      Volver al inicio
    </VBtn>
  </div>
</template>

<style lang="scss">
@use "@core/scss/template/pages/misc.scss";
</style>
