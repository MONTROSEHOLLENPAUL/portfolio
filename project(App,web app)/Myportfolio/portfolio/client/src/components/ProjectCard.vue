<script setup>
defineProps({ project: Object, admin: Boolean, dragOver: Boolean });
defineEmits(["edit", "delete"]);
</script>

<template>
  <article class="card" :class="{ admin, over: dragOver }">
    <div class="thumb">
      <img v-if="project.image" :src="project.image" :alt="`Aperçu de ${project.title}`" loading="lazy" />
      <div v-else class="noimg" aria-hidden="true">{{ project.title.slice(0, 1) }}</div>
      <span v-if="admin" class="grip" title="Glissez pour réordonner">⠿</span>
    </div>
    <div class="body">
      <h3>{{ project.title }}</h3>
      <p v-if="project.description" class="desc">{{ project.description }}</p>
      <ul v-if="project.tags.length" class="tags">
        <li v-for="t in project.tags" :key="t">{{ t }}</li>
      </ul>
      <div class="links">
        <a v-if="project.link" class="btn sm primary" :href="project.link" target="_blank" rel="noopener noreferrer">Voir le projet ↗</a>
        <a v-if="project.repo" class="btn sm" :href="project.repo" target="_blank" rel="noopener noreferrer">Code</a>
      </div>
      <div v-if="admin" class="links admin-actions">
        <button class="btn sm" @click="$emit('edit')">Modifier</button>
        <button class="btn sm danger" @click="$emit('delete')">Supprimer</button>
      </div>
    </div>
  </article>
</template>

<style scoped>
.card {
  display: flex; flex-direction: column; overflow: hidden; height: 100%;
  background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius);
  transition: transform 0.2s, border-color 0.2s;
}
.card:hover { transform: translateY(-3px); border-color: var(--accent); }
.card.admin { cursor: grab; }
.card.over { border-color: var(--accent); outline: 2px dashed var(--accent); outline-offset: 3px; }
.thumb { position: relative; aspect-ratio: 16 / 10; background: var(--surface-2); }
.thumb img { width: 100%; height: 100%; object-fit: cover; }
.noimg {
  width: 100%; height: 100%; display: grid; place-items: center;
  font: 700 4rem "Space Grotesk", sans-serif; color: var(--accent);
  background: linear-gradient(135deg, var(--surface-2), color-mix(in srgb, var(--accent) 18%, var(--surface-2)));
}
.grip {
  position: absolute; top: 10px; right: 10px; width: 34px; height: 34px; display: grid; place-items: center;
  border-radius: 10px; background: rgba(0, 0, 0, 0.55); color: #fff; font-size: 1.2rem;
}
.body { display: flex; flex-direction: column; gap: 12px; padding: 18px; flex: 1; }
h3 { font-size: 1.25rem; }
.desc { margin: 0; color: var(--muted); font-size: 0.95rem; display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; overflow: hidden; }
.tags { display: flex; flex-wrap: wrap; gap: 6px; list-style: none; margin: 0; padding: 0; }
.tags li { padding: 3px 10px; border-radius: 999px; font-size: 0.78rem; background: var(--surface-2); border: 1px solid var(--border); color: var(--muted); }
.links { display: flex; flex-wrap: wrap; gap: 8px; margin-top: auto; }
.admin-actions { margin-top: 0; padding-top: 12px; border-top: 1px solid var(--border); }
</style>
