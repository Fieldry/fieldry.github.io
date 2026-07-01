<script setup lang="ts">
import type { TimelineItem } from "../types";

defineProps<{
  title: string;
  items: TimelineItem[];
}>();
</script>

<template>
  <section class="academic-card section">
    <div class="section-title-row">
      <div>
        <h2>{{ title }}</h2>
      </div>
    </div>
    <div class="timeline">
      <article v-for="item in items" :key="item.uid" class="timeline-item">
        <span class="time-tag">{{ item.period }}</span>
        <h3>{{ item.title }}</h3>
        <p class="timeline-subtitle">{{ item.subtitle }}</p>
        <p v-html="item.details" />
      </article>
    </div>
  </section>
</template>
