<script setup>
import { ref } from "vue";
import { api, setToken } from "../api";

const emit = defineEmits(["close", "success"]);
const password = ref("");
const error = ref("");
const loading = ref(false);

async function submit() {
  loading.value = true;
  error.value = "";
  try {
    const { token } = await api.login(password.value);
    setToken(token);
    emit("success");
  } catch (e) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="overlay" @click.self="emit('close')">
    <form class="modal" @submit.prevent="submit">
      <h2 style="text-align:center;">Connexion admin</h2>
      <p class="hint">Pour ajouter et gérer vos projets.</p>
      <div class="field">
        <label for="pwd">Mot de passe</label>
        <input id="pwd" v-model="password" type="password" autocomplete="current-password" autofocus required />
      </div>
      <p v-if="error" class="error">{{ error }}</p>
      <div class="actions">
        <button type="button" class="btn" @click="emit('close')">Annuler</button>
        <button class="btn primary" :disabled="loading">{{ loading ? "…" : "Se connecter" }}</button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.overlay {
  position: fixed; inset: 0; z-index: 50; display: grid; place-items: center;
  padding: 16px; background: rgba(5, 8, 14, 0.7); backdrop-filter: blur(4px);
}
.modal {
  width: min(420px, 100%); display: grid; gap: 16px; padding: 24px;
  background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius);
}
.hint { margin: -8px 0 0; color: var(--muted); font-size: 0.9rem; }
.actions { display: flex; gap: 10px; justify-content: flex-end; flex-wrap: wrap; }
</style>
