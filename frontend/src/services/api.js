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