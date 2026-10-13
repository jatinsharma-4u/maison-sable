// Form submission service.
//
// Set VITE_FORM_ENDPOINT (see .env.example) to a form backend that accepts multipart POSTs —
// e.g. Formspree, Getform, Basin, or your own API. Until then, nothing is sent: inquiries are
// kept on this device and the UI tells the customer so (no fake "success" is ever shown).

const ENDPOINT = import.meta.env.VITE_FORM_ENDPOINT;

export const isSubmissionConfigured = () => Boolean(ENDPOINT);

const saveLocally = (form, data) => {
  try {
    const key = 'ms:outbox';
    const list = JSON.parse(localStorage.getItem(key) || '[]');
    list.push({ form, data, at: new Date().toISOString() });
    localStorage.setItem(key, JSON.stringify(list.slice(-20)));
  } catch {
    /* ignore */
  }
};

/**
 * @returns {Promise<{ok: boolean, offline?: boolean, error?: string}>}
 *   ok: true only when the endpoint answered 2xx.
 *   offline: true when no endpoint is configured.
 */
export async function submitForm(form, data, files = []) {
  if (!ENDPOINT) {
    saveLocally(form, data);
    return { ok: false, offline: true };
  }
  const body = new FormData();
  body.append('_form', form);
  Object.entries(data).forEach(([k, v]) => body.append(k, typeof v === 'object' ? JSON.stringify(v) : String(v ?? '')));
  files.forEach((f) => body.append('attachments', f, f.name));
  try {
    const res = await fetch(ENDPOINT, { method: 'POST', body, headers: { Accept: 'application/json' } });
    if (!res.ok) return { ok: false, error: `Server responded ${res.status}` };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e.message || 'Network error' };
  }
}
