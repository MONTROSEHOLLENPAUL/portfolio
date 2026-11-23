<script setup>
import { ref, onMounted } from "vue";
import { api, getToken, setToken } from "./api";
import ProjectCard from "./components/ProjectCard.vue";
import ProjectForm from "./components/ProjectForm.vue";
import LoginModal from "./components/LoginModal.vue";

//info on me
const profile = {
  name: "Monterose Hollen Paul",
  role: "Développeur web",
  tagline: "Je transforme des idées en applications concrètes sur le web, le bureau et le mobile en combinant Vue.js, Node.js , C++/Qt, Java et des technologies multiplateformes comme Electron et Capacitor.Mon parcours s'appuie sur des bases solides en informatique fondamentale ainsi que sur des certifications en programmation et développement web (OpenClassrooms, freeCodeCamp, grafikart). J'interviens aussi bien sur des interfaces modernes et réactives (HTML/CSS, JavaScript, Vue.js) que sur des backends robustes (Node.js/Express) et des langages système ou applicatifs (C, C++/Qt, Java), avec une maîtrise des bases de données relationnelles et NoSQL (MySQL, SQLite, MongoDB, Firebase).J'aime bâtir des outils concrets, rapides et autonomes : applications de prise de notes avec relais IA local (StackNote), solutions de navigation GPS et suivi d'itinéraires (TravelGuide), tableaux de bord analytiques ou systèmes de gestion de stock. Sensible à l'efficacité et à l'indépendance logicielle, je privilégie les architectures offline-first, les outils open-source et une expérience utilisateur soignée.",
  skills: ["Vue.js","Nuxt.js", "JavaScript", "Node.js", "Express", "HTML / CSS", "API REST", "Git","API GraphQL","MySql","PostgreSql","Oracle","MongoDb"],
  github: "Https://github.com/MONTROSEHOLLENPAUL",
  linkedin: "Https://www.linkedin.com/in/hollen-paul-montrose-40914129a",
  email: "montrosehollenpaul@gmail.com",
  whatsapp:"Https://wa.me/qr/B7JEYSHSVEGUN1",
};

const projects = ref([]);
const loading = ref(true);
const loadError = ref("");
const admin = ref(false);
const showLogin = ref(false);
const formOpen = ref(false);
const editing = ref(null);
const toast = ref("");
const menuOpen = ref(false);

const flash = (msg) => {
  toast.value = msg;
  setTimeout(() => (toast.value = ""), 3000);
};

async function load() {
  try {
    projects.value = await api.list();
  } catch (e) {
    loadError.value = "Impossible de charger les projets.";
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  load();
  if (getToken()) {
    try {
      await api.me();
      admin.value = true;
    } catch {
      setToken("");
    }
  }
});

function onLogin() {
  admin.value = true;
  showLogin.value = false;
  flash("Mode admin activé");
}
function logout() {
  setToken("");
  admin.value = false;
}
function openNew() {
  editing.value = null;
  formOpen.value = true;
}
function openEdit(p) {
  editing.value = p;
  formOpen.value = true;
}
async function onSaved() {
  formOpen.value = false;
  await load();
  flash("Projet enregistré ✓");
}
async function remove(p) {
  if (!confirm(`Supprimer « ${p.title} » ?`)) return;
  try {
    await api.remove(p.id);
    projects.value = projects.value.filter((x) => x.id !== p.id);
    flash("Projet supprimé");
  } catch (e) {
    flash(e.message);
  }
}

// ----- Glisser-déposer pour réordonner -----
const dragId = ref(null);
const overId = ref(null);
function onDragStart(e, p) {
  dragId.value = p.id;
  e.dataTransfer.effectAllowed = "move";
  e.dataTransfer.setData("text/plain", p.id);
}
async function onDropCard(target) {
  const from = projects.value.findIndex((p) => p.id === dragId.value);
  const to = projects.value.findIndex((p) => p.id === target.id);
  dragId.value = overId.value = null;
  if (from < 0 || to < 0 || from === to) return;
  const list = [...projects.value];
  list.splice(to, 0, list.splice(from, 1)[0]);
  projects.value = list;
  try {
    await api.reorder(list.map((p) => p.id));
  } catch (e) {
    flash(e.message);
    load();
  }
}
</script>

<template>
  <header class="nav">
    <div class="container bar">
      <a href="#top" class="brand" style="text-transform:uppercase;">Portfolio<span></span></a>
      <button class="burger" :aria-expanded="menuOpen" aria-label="Menu" @click="menuOpen = !menuOpen">☰</button>
      <nav :class="{ open: menuOpen }" @click="menuOpen = false">
        <a href="#about">À propos</a>
        <a href="#projects">Projets</a>
        <a href="#contact">Contact</a>
      </nav>
    </div>
  </header>

  <main id="top">
    <section class="hero container">
      <p class="eyebrow">{{ profile.role }}</p>
      <h1>Salut, je suis <span class="grad">{{ profile.name }}</span>.</h1>
      <p class="lead">{{ profile.tagline }}</p>
      <div class="cta">
        <a href="#projects" class="btn primary">Voir mes projets</a>
        <a href="#contact" class="btn">Me contacter</a>
      </div>
    </section>

    <section id="about" class="container section">
      <h2>Compétences</h2>
      <ul class="skills">
        <li v-for="s in profile.skills" :key="s">{{ s }}</li>
      </ul>
    </section>

    <section id="projects" class="container section">
      <div class="head">
        <h2>Projets</h2>
        <div v-if="admin" class="admin-bar">
          <button class="btn primary" @click="openNew">＋ Ajouter un projet</button>
          <button class="btn" @click="logout">Se déconnecter</button>
        </div>
      </div>
      <p v-if="admin && projects.length > 1" class="hint">Astuce : glissez les cartes pour changer leur ordre.</p>

      <p v-if="loading" class="state">Chargement…</p>
      <p v-else-if="loadError" class="state error">{{ loadError }}</p>
      <div v-else-if="!projects.length" class="state empty">
        <p>Aucun projet pour l'instant.</p>
        <button v-if="admin" class="btn primary" @click="openNew">Ajouter mon premier projet</button>
      </div>

      <div v-else class="grid">
        <div
          v-for="p in projects"
          :key="p.id"
          :draggable="admin"
          @dragstart="admin && onDragStart($event, p)"
          @dragover.prevent="admin && (overId = p.id)"
          @dragleave="overId === p.id && (overId = null)"
          @drop.prevent="admin && onDropCard(p)"
          @dragend="dragId = overId = null"
        >
          <ProjectCard :project="p" :admin="admin" :drag-over="overId === p.id && dragId !== p.id" @edit="openEdit(p)" @delete="remove(p)" />
        </div>
      </div>
    </section>

    <section id="contact" class="container section contact">
      <h2>Travaillons ensemble</h2>
      <p class="lead">Un projet en tête ? Parlons-en.</p>
      <div class="cta">
        <a v-if="profile.email" class="btn primary" :href="`mailto:${profile.email}`">M'écrire</a>
        <a v-if="profile.github" class="btn" :href="profile.github" target="_blank" rel="noopener noreferrer">GitHub</a>
        <a v-if="profile.linkedin" class="btn" :href="profile.linkedin" target="_blank" rel="noopener noreferrer">LinkedIn</a>
		<a v-if="profile.linkedin" class="btn" :href="profile.whatsapp" target="_blank" rel="noopener noreferrer">Whatsapp</a>
      </div>
    </section>
  </main>

  <footer class="foot container">
    <span>© {{ new Date().getFullYear() }} {{ profile.name }}</span>
    <button v-if="!admin" class="link" @click="showLogin = true">Admin</button>
  </footer>

  <LoginModal v-if="showLogin" @close="showLogin = false" @success="onLogin" />
  <ProjectForm v-if="formOpen" :project="editing" @close="formOpen = false" @saved="onSaved" />
  <div v-if="toast" class="toast" role="status">{{ toast }}</div>
</template>

<style scoped>
.nav { position: sticky; top: 0; z-index: 20; background: color-mix(in srgb, var(--bg) 85%, transparent); backdrop-filter: blur(10px); border-bottom: 1px solid var(--border); }
.bar { display: flex; align-items: center; justify-content: space-between; min-height: 64px; position: relative; }
.brand { font: 700 1.3rem "Space Grotesk", sans-serif; text-decoration: none; }
.brand span { color: var(--accent); }
nav { display: flex; gap: 24px; }
nav a { text-decoration: none; color: var(--muted); font-weight: 500; }
nav a:hover { color: var(--text); }
.burger { display: none; width: 44px; height: 44px; border-radius: 12px; border: 1px solid var(--border); background: var(--surface); color: var(--text); font-size: 1.3rem; cursor: pointer; }

.hero { padding-block: clamp(56px, 12vw, 140px) clamp(40px, 8vw, 80px); }
.eyebrow { color: var(--accent); font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; font-size: 0.85rem; margin: 0 0 16px; }
h1 { font-size: clamp(2.2rem, 7vw, 4.5rem); letter-spacing: -0.02em; max-width: 16ch; }
.grad { background: linear-gradient(90deg, var(--accent), #4cc9f0); -webkit-background-clip: text; background-clip: text; color: transparent; }
.lead { color: var(--muted); font-size: clamp(1rem, 2.5vw, 1.2rem); max-width: 56ch; margin: 20px 0 0; }
.cta { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 28px; }

.section { padding-block: clamp(40px, 7vw, 72px); }
h2 { font-size: clamp(1.6rem, 4vw, 2.2rem); }
.skills { display: flex; flex-wrap: wrap; gap: 10px; list-style: none; padding: 0; margin: 20px 0 0; }
.skills li { padding: 8px 16px; border-radius: 999px; background: var(--surface); border: 1px solid var(--border); font-weight: 500; }

.head { display: flex; flex-wrap: wrap; gap: 16px; align-items: center; justify-content: space-between; margin-bottom: 24px; }
.admin-bar { display: flex; flex-wrap: wrap; gap: 10px; }
.hint { color: var(--muted); font-size: 0.9rem; margin: -8px 0 20px; }
.grid { display: grid; gap: 24px; grid-template-columns: repeat(auto-fill, minmax(min(100%, 320px), 1fr)); }
.state { color: var(--muted); text-align: center; padding: 48px 16px; border: 1px dashed var(--border); border-radius: var(--radius); }
.state p { margin: 0 0 16px; }

.contact { text-align: center; }
.contact .lead, .contact .cta { margin-inline: auto; justify-content: center; }
.foot { display: flex; justify-content: space-between; align-items: center; gap: 12px; padding-block: 28px; border-top: 1px solid var(--border); color: var(--muted); font-size: 0.9rem; }
.link { background: none; border: 0; color: var(--muted); cursor: pointer; font: inherit; text-decoration: underline; padding: 8px; }
.toast { position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); z-index: 60; padding: 12px 20px; border-radius: 999px; background: var(--accent); color: var(--accent-ink); font-weight: 600; box-shadow: 0 8px 30px rgba(0, 0, 0, 0.35); max-width: calc(100% - 32px); }

@media (max-width: 720px) {
  .burger { display: block; }
  nav { display: none; position: absolute; top: 100%; left: 0; right: 0; flex-direction: column; gap: 0; padding: 8px 0; background: var(--surface); border: 1px solid var(--border); border-radius: 0 0 var(--radius) var(--radius); }
  nav.open { display: flex; }
  nav a { padding: 14px 20px; }
  .cta .btn, .admin-bar .btn { flex: 1 1 100%; }
}
</style>
