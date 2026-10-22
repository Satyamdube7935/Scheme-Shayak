const API = "/api";

export function getToken() {
  return localStorage.getItem("ss_token");
}

export async function api(path, { method = "GET", body, form } = {}) {
  const headers = {};
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  let payload;
  if (form) {
    payload = { method, headers, body: form };
  } else {
    headers["Content-Type"] = "application/json";
    payload = { method, headers, body: body ? JSON.stringify(body) : undefined };
  }
  const res = await fetch(`${API}${path}`, payload);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}
