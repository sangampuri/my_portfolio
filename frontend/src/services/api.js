const API = import.meta.env.VITE_API_URL;

export async function getHealth() {
  const res = await fetch(`${API}/health/`);
  if (!res.ok) throw new Error("API error");
  return res.json();
}