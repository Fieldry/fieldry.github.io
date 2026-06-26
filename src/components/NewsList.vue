<script setup lang="ts">
import { computed } from "vue";
import type { NewsItem } from "../types";

const props = defineProps<{
  items: NewsItem[];
  limit?: number;
}>();

const visibleItems = computed(() =>
  props.limit ? props.items.slice(0, props.limit) : props.items,
);
</script>

<template>
  <div class="news-list">
    <article v-for="item in visibleItems" :key="item.uid" class="news-item">
      <div class="news-content" v-html="item.content" />
      <span class="time-tag">{{ item.date }}</span>
    </article>
  </div>
</template>
