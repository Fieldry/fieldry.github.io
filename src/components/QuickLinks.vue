<script setup lang="ts">
import type { QuickLink } from "../types";

defineProps<{
  links: QuickLink[];
}>();
</script>

<template>
  <div class="quick-links">
    <a
      v-for="link in links"
      :key="link.name"
      :href="link.url"
      target="_blank"
      rel="noopener noreferrer"
      class="quick-link"
    >
      {{ link.name }}
    </a>
  </div>
</template>
