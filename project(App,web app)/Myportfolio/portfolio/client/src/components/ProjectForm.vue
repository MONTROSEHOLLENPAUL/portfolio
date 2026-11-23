<script setup>
import { ref, computed, onBeforeUnmount } from "vue";
import { api } from "../api";

const props = defineProps({ project: { type: Object, default: null } });
const emit = defineEmits(["close", "saved"]);

const isEdit = computed(() => !!props.project);
const form = ref({
  title: props.project?.title || "",
  description: props.project?.description || "",
  link: props.project?.link || "",
  repo: props.project?.repo || "",
  tags: props.project?.tags?.join(", ") || "",
});
const file = ref(null);
const preview = ref(props.project?.image || "");
const removeImage = ref(false);
const dragging = ref(false);
const error = ref("");
const loading = ref(false);
const fileInput = ref(null);
let objectUrl = "";

function setFile(f) {
  if (!f) return;
  if (!f.type.startsWith("image/")) return (error.value = "Déposez un fichier image (png, jpg, webp, gif)");
  if (f.size > 5 * 1024 * 1024) return (error.value = "Image trop lourde (5 Mo max)");
  error.value = "";
  if (objectUrl) URL.revokeObjectURL(objectUrl);
  objectUrl = URL.createObjectURL(f);
  file.value = f;
  preview.value = objectUrl;
  removeImage.value = false;
}
const onDrop = (e) => {
  dragging.value = false;
  setFile(e.dataTransfer.files?.[0]);
};
const clearImage = () => {
  file.value = null;
  preview.value = "";
  removeImage.value = true;
  if (fileInput.value) fileInput.value.value = "";
};

async function submit() {
  loading.value = true;
  error.value = "";
  const fd = new FormData();
  Object.entries(form.value).forEach(([k, v]) => fd.append(k, v));
  if (file.value) fd.append("image", file.value);
  if (removeImage.value) fd.append("removeImage", "true");
  try {
    const saved = isEdit.value ? await api.update(props.project.id, fd) : await api.create(fd);
    emit("saved", saved);
  } catch (e) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
}

onBeforeUnmount(() => objectUrl && URL.revokeObjectURL(objectUrl));
</script>

<template>
  <div class="overlay" @click.self="emit('close')">
    <form class="modal" @submit.prevent="submit">
      <h2>{{ isEdit ? "Modifier le projet" : "Nouveau projet" }}</h2>

      <div
        class="drop"
        :class="{ over: dragging, has: preview }"
        @dragover.prevent="dragging = true"
        @dragleave.prevent="dragging = false"
        @drop.prevent="onDrop"
        @click="fileInput.click()"
        @keydown.enter.prevent="fileInput.click()"
        tabindex="0"
        role="button"
        aria-label="Ajouter une image du projet"
      >
        <img v-if="preview" :src="preview" alt="Aperçu du projet" />
        <div v-else class="placeholder">
          <strong>Glissez-déposez une image ici</strong>
          <span>ou cliquez pour parcourir · 5 Mo max</span>
        </div>
        <input ref="fileInput" type="file" accept="image/*" hidden @change="setFile($event.target.files[0])" />
      </div>
      <button v-if="preview" type="button" class="btn sm danger" @click="clearImage">Retirer l'image</button>

      <div class="field">
        <label for="t">Titre *</label>
        <input id="t" v-model="form.title" required maxlength="120" />
      </div>
      <div class="field">
        <label for="d">Description</label>
        <textarea id="d" v-model="form.description" maxlength="2000" placeholder="Ce que fait le projet, votre rôle, les défis…"></textarea>
      </div>
      <div class="row">
        <div class="field">
          <label for="l">Lien du site / démo</label>
          <input id="l" v-model="form.link" type="url" placeholder="https://…" />
        </div>
        <div class="field">
          <label for="r">Lien du code (GitHub)</label>
          <input id="r" v-model="form.repo" type="url" placeholder="https://github.com/…" />
        </div>
      </div>
      <div class="field">
        <label for="g">Technologies (séparées par des virgules)</label>
        <input id="g" v-model="form.tags" placeholder="Vue.js, Node.js, Express" />
      </div>

      <p v-if="error" class="error">{{ error }}</p>
      <div class="actions">
        <button type="button" class="btn" @click="emit('close')">Annuler</button>
        <button class="btn primary" :disabled="loading">{{ loading ? "Envoi…" : isEdit ? "Enregistrer" : "Publier le projet" }}</button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.overlay {
  position: fixed; inset: 0; z-index: 50; display: grid; place-items: start center;
  padding: 16px; overflow-y: auto; background: rgba(5, 8, 14, 0.7); backdrop-filter: blur(4px);
}
.modal {
  width: min(640px, 100%); display: grid; gap: 16px; padding: clamp(16px, 4vw, 28px); margin-block: auto;
  background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius);
}
.drop {
  display: grid; place-items: center; min-height: 160px; overflow: hidden; cursor: pointer;
  border: 2px dashed var(--border); border-radius: 14px; background: var(--surface-2);
  transition: border-color 0.15s, background 0.15s;
}
.drop.over, .drop:focus-visible { border-color: var(--accent); background: color-mix(in srgb, var(--accent) 10%, var(--surface-2)); outline: none; }
.drop.has { border-style: solid; }
.drop img { width: 100%; max-height: 260px; object-fit: cover; }
.placeholder { display: grid; gap: 4px; text-align: center; padding: 24px; color: var(--muted); font-size: 0.9rem; }
.placeholder strong { color: var(--text); }
.row { display: grid; gap: 16px; grid-template-columns: 1fr 1fr; }
.actions { display: flex; gap: 10px; justify-content: flex-end; flex-wrap: wrap; }
.btn.sm { justify-self: start; }
@media (max-width: 560px) {
  .row { grid-template-columns: 1fr; }
  .actions .btn { flex: 1; }
}
</style>
