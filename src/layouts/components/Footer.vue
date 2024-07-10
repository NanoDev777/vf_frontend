<template>
  <div class="h-100 d-flex align-center justify-space-between">
    <!-- 👉 Footer: left content -->
    <span class="d-flex align-center">
      &copy;
      {{ new Date().getFullYear() }}
      <VIcon
        icon="tabler-heart"
        color="error"
        size="1.25rem"
        class="mx-1"
      />
      <strong> Vivir Feliz - Todos los derechos reservados.</strong>
      
    </span>
    <!-- 👉 Footer: right content -->
    <span class="d-md-flex gap-x-4 d-none">
      <strong class="text-primary">V-1.0.0</strong>
      
      <strong>
        Desarrollado por:
        <a
          class="text-primary"
          href="https://1.envato.market/pixinvent_portfolio"
        >F.C.B</a>
      </strong> 
    </span>
  </div>
</template>
