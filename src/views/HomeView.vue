<script setup lang="ts">
import { computed, ref } from "vue";
import NewsList from "../components/NewsList.vue";
import PublicationCard from "../components/PublicationCard.vue";
import QuickLinks from "../components/QuickLinks.vue";
import TimelineColumn from "../components/TimelineColumn.vue";
import type { TabId, TabItem } from "../types";
import { siteData } from "../utils/site-data";
import {
  filterPublications,
  getFeaturedPublications,
  getPublicationTags,
  getPublicationYears,
} from "../utils/publications";

const tabs: TabItem[] = [
  { id: "about", name: "About" },
  { id: "publications", name: "Publications" },
  { id: "experience", name: "Experience" },
  { id: "honors", name: "Honors & Service" },
];

const {
  authorLinks,
  awards,
  education,
  experience,
  newsItems,
  profile,
  publications,
  quickLinks,
  services,
} = siteData;

const activeTab = ref<TabId>("about");
const mobileMenuOpen = ref(false);
const searchQuery = ref("");
const selectedTag = ref("");
const selectedYear = ref("");

const featuredPublications = computed(() =>
  getFeaturedPublications(publications),
);

const featuredPreview = computed(() => featuredPublications.value.slice(0, 5));
const publicationTags = computed(() => getPublicationTags(publications));
const availableYears = computed(() => getPublicationYears(publications));

const filteredPublications = computed(() =>
  filterPublications(publications, featuredPublications.value, {
    searchQuery: searchQuery.value,
    selectedTag: selectedTag.value,
    selectedYear: selectedYear.value,
  }),
);

function selectTab(tab: TabId) {
  activeTab.value = tab;
  mobileMenuOpen.value = false;
}

function showAllPublications() {
  selectedTag.value = "All";
  selectedYear.value = "";
  searchQuery.value = "";
  selectTab("publications");
}
</script>

<template>
  <div class="page">
    <header class="topbar">
      <div class="topbar-inner">
        <button
          class="brand"
          type="button"
          aria-label="Show About section"
          @click="selectTab('about')"
        >
          <span class="brand-bar" aria-hidden="true" />
          <span class="brand-name">{{ profile.name }}</span>
          <span class="brand-cn">{{ profile.cnName }}</span>
        </button>
        <nav class="nav" aria-label="Primary navigation">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            type="button"
            :class="{ active: activeTab === tab.id }"
            @click="selectTab(tab.id)"
          >
            {{ tab.name }}
          </button>
        </nav>
        <button
          class="mobile-toggle"
          type="button"
          :aria-expanded="mobileMenuOpen"
          aria-controls="mobile-menu"
          @click="mobileMenuOpen = !mobileMenuOpen"
        >
          Menu
        </button>
      </div>
      <div
        id="mobile-menu"
        class="mobile-menu"
        :class="{ open: mobileMenuOpen }"
        aria-label="Mobile navigation"
      >
        <button
          v-for="tab in tabs"
          :key="`mobile-${tab.id}`"
          type="button"
          :class="{ active: activeTab === tab.id }"
          @click="selectTab(tab.id)"
        >
          {{ tab.name }}
        </button>
      </div>
    </header>

    <main>
      <div class="main-grid">
        <aside class="sidebar">
          <section class="academic-card profile-card">
            <div class="profile-head">
              <div>
                <h1 class="profile-name">
                  {{ profile.name }}
                  <span>{{ profile.cnName }}</span>
                </h1>
                <a class="profile-email" :href="`mailto:${profile.email}`">
                  {{ profile.email }}
                </a>
                <div class="profile-meta">
                  <p>
                    <strong>{{ profile.title }}</strong>
                  </p>
                  <p>{{ profile.school }}</p>
                  <p>{{ profile.affiliation }}</p>
                </div>
              </div>
              <img
                class="avatar"
                src="/assets/profile_photo_avatar.jpg"
                :alt="`${profile.name} profile photo`"
              >
            </div>
            <div class="action-grid">
              <a
                class="action-link"
                href="/cv/ZixiangWang_CV.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                CV
              </a>
            </div>
          </section>

          <section class="academic-card side-section">
            <h2 class="side-title">Quick Links</h2>
            <QuickLinks :links="quickLinks" />
          </section>

          <section class="academic-card side-section scroll">
            <h2 class="side-title">Recent News</h2>
            <NewsList :items="newsItems" />
          </section>
        </aside>

        <section class="academic-card panel">
          <div v-show="activeTab === 'about'" class="panel-pane">
            <section class="hero">
              <div class="hero-intro">
                <span class="eyebrow">
                  AI for Healthcare · Medical LLMs · EHR Modeling
                </span>
                <p class="bio" v-html="profile.bio" />
              </div>
              <div class="focus-grid">
                <article
                  v-for="interest in profile.interests"
                  :key="interest.uid"
                  class="academic-card focus-card"
                >
                  <h3>{{ interest.title }}</h3>
                  <p>{{ interest.description }}</p>
                </article>
              </div>
            </section>

            <div class="content-grid about-grid">
              <section class="academic-card section">
                <div class="section-title-row">
                  <div>
                    <h2>Featured Publications</h2>
                    <p class="section-subtitle">
                      Representative papers from the publication list.
                    </p>
                  </div>
                  <button class="filter-tab" type="button" @click="showAllPublications">
                    View All
                  </button>
                </div>
                <div class="card-list">
                  <PublicationCard
                    v-for="publication in featuredPreview"
                    :key="publication.uid"
                    :item="publication"
                    :author-links="authorLinks"
                    show-tag
                  />
                </div>
              </section>
            </div>
          </div>

          <div v-show="activeTab === 'publications'" class="panel-pane">
            <div class="section-title-row">
              <div>
                <h2>Publications</h2>
                <p class="section-subtitle">
                  Entries are filtered from the reference site's data by the
                  author name Zixiang Wang.
                </p>
              </div>
            </div>
            <div class="publication-toolbar">
              <div class="filter-row">
                <button
                  class="filter-tab"
                  type="button"
                  :class="{ active: selectedTag === '' }"
                  @click="selectedTag = ''"
                >
                  Featured ({{ featuredPublications.length }})
                </button>
                <button
                  class="filter-tab"
                  type="button"
                  :class="{ active: selectedTag === 'All' }"
                  @click="selectedTag = 'All'"
                >
                  All ({{ publications.length }})
                </button>
                <button
                  v-for="tag in publicationTags"
                  :key="tag.name"
                  class="filter-tab"
                  type="button"
                  :class="{ active: selectedTag === tag.name }"
                  @click="selectedTag = tag.name"
                >
                  {{ tag.name }} ({{ tag.count }})
                </button>
              </div>
              <div class="filter-controls">
                <input
                  v-model="searchQuery"
                  class="search"
                  type="search"
                  placeholder="Search publications"
                >
                <select v-model="selectedYear" class="search">
                  <option value="">All Years</option>
                  <option v-for="year in availableYears" :key="year" :value="year">
                    {{ year }}
                  </option>
                </select>
              </div>
            </div>
            <div class="card-list">
              <PublicationCard
                v-for="publication in filteredPublications"
                :key="publication.uid"
                :item="publication"
                :author-links="authorLinks"
                show-tag
              />
              <p v-if="!filteredPublications.length" class="empty-state">
                No publications match the current filters.
              </p>
            </div>
          </div>

          <div v-show="activeTab === 'experience'" class="panel-pane">
            <div class="content-grid">
              <TimelineColumn title="Education" :items="education" />
              <TimelineColumn title="Research Trajectory" :items="experience" />
            </div>
          </div>

          <div v-show="activeTab === 'honors'" class="panel-pane">
            <div class="content-grid">
              <section class="academic-card section">
                <div class="section-title-row">
                  <div>
                    <h2>Honors & Awards</h2>
                    <p class="section-subtitle">
                      Items retained from the original homepage.
                    </p>
                  </div>
                </div>
                <div class="card-list">
                  <article v-for="award in awards" :key="award.uid" class="mini-card">
                    <span class="time-tag">{{ award.year }}</span>
                    <h3>{{ award.title }}</h3>
                    <p>{{ award.organization }}</p>
                  </article>
                </div>
              </section>

              <section class="academic-card section">
                <div class="section-title-row">
                  <div>
                    <h2>Academic Service</h2>
                    <p class="section-subtitle">
                      Teaching and reviewing activities.
                    </p>
                  </div>
                </div>
                <div class="card-list">
                  <article
                    v-for="service in services"
                    :key="service.uid"
                    class="mini-card"
                  >
                    <span class="time-tag">{{ service.year }}</span>
                    <h3>{{ service.title }}</h3>
                    <p>{{ service.organization }}</p>
                  </article>
                </div>
              </section>
            </div>
          </div>
        </section>
      </div>
    </main>

    <footer class="footer">
      <div class="footer-inner">
        <span>© 2026 {{ profile.name }} · Academic Homepage</span>
        <span>Last updated: 2026-06-26</span>
      </div>
    </footer>
  </div>
</template>
