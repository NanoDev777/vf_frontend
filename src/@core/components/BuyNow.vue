<script setup>
const vm = getCurrentInstance()
const buyNowUrl = ref(vm?.appContext.config.globalProperties.buyNowUrl || 'https://1.envato.market/vuexy_admin')

watch(buyNowUrl, val => {
  if (vm)
    vm.appContext.config.globalProperties.buyNowUrl = val
})
</script>

<template>

</template>

<style lang="scss" scoped>
.product-buy-now {
  position: fixed;

  // To keep buy now button on top of v-layout. E.g. Email app
  z-index: 999;
  inset-block-end: 5%;
  inset-inline-end: 79px;

  body &.v-btn.v-btn--elevated {
    box-shadow: 0 1px 20px 1px rgb(var(--v-theme-error)) !important;

    &:hover {
      box-shadow: none !important;
    }
  }
}
</style>
