<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  id: {
    type: String,
    required: true
  }
})
</script>
<template>
  <div>
    <h1>Target Page</h1>
    <p>ID: {{ id }}</p>
  </div>
</template>
