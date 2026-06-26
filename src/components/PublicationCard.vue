<script setup lang="ts">
import { computed } from "vue";
import type { Project, Publication } from "../types";
import {
  formatAuthorsHtml,
  getPublicationAuthorFields,
} from "../utils/publications";

const props = defineProps<{
  item: Publication | Project;
  authorLinks: Record<string, string>;
  showTag?: boolean;
}>();

const authorsHtml = computed(() => {
  const authorFields = getPublicationAuthorFields(props.item);

  return formatAuthorsHtml({
    authors: props.item.authors,
    firstAuthors: authorFields.firstAuthors,
    correspondingAuthors: authorFields.correspondingAuthors,
    authorLinks: props.authorLinks,
  });
});
</script>

<template>
  <article class="publication-card">
    <div class="publication-main">
      <h3>{{ item.title }}</h3>
      <p class="authors" v-html="authorsHtml" />
      <p class="venue">{{ item.venue }}</p>
      <div v-if="item.links?.length" class="pub-links">
        <a
          v-for="link in item.links"
          :key="`${item.uid}-${link.type}`"
          :href="link.url"
          target="_blank"
          rel="noopener noreferrer"
          class="pub-link"
        >
          {{ link.type }}
        </a>
      </div>
    </div>
    <div class="publication-meta">
      <span class="time-tag">{{ item.year }}</span>
      <span v-if="showTag && 'tag' in item" class="tag-chip">
        {{ item.tag }}
      </span>
      <span v-if="'featured' in item && item.featured" class="tag-chip red">
        Featured
      </span>
    </div>
  </article>
</template>
