let token = "";
try {
  token = localStorage.getItem("admin_token") || "";
} catch (e){console.log(e)}

export const getToken = () => token;
export const setToken = (t) => {
  token = t;
  try {
    t ? localStorage.setItem("admin_token", t) : localStorage.removeItem("admin_token");
  } catch(e) {console.log(e)}
};

async function request(url, options = {}) {
  const headers = { ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(url, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401 && token) setToken("");
    throw new Error(data.error || "Erreur serveur");
  }
  return data;
}

const json = (method, body) => ({
  method,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

export const api = {
  login: (password) => request("/api/login", json("POST", { password })),
  me: () => request("/api/me"),
  list: () => request("/api/projects"),
  create: (formData) => request("/api/projects", { method: "POST", body: formData }),
  update: (id, formData) => request(`/api/projects/${id}`, { method: "PUT", body: formData }),
  remove: (id) => request(`/api/projects/${id}`, { method: "DELETE" }),
  reorder: (ids) => request("/api/projects/reorder", json("PUT", { ids })),
};
