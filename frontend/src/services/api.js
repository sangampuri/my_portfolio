export async function sendContact(data) {
  const res = await fetch(`${API}/contact/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error("Request failed");
    err.status = res.status;
    err.fields = body;
    throw err;
  }
  return body;
}

async function getJSON(path, signal) {
  const res = await fetch(`${API}${path}`, { signal });
  if (!res.ok) throw new Error(String(res.status));
  return res.json();
}

export const getProfile = (s) => getJSON("/profile/", s);
export const getSkills = (s) => getJSON("/skills/", s);
export const getProjects = (s) => getJSON("/projects/", s);
export const getExperience = (s) => getJSON("/experience/", s);