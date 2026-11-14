// How the status of an ADR is shown as a badge, in the sidebar and in its page.
// `rejected` is a full answer, not a failure: it is neutral, never red.
const variants = { accepted: 'success', proposed: 'caution' };

/** A Starlight badge for a status: its text, its variant and its class. */
export const statusBadge = (status) => ({
  text: status,
  variant: variants[status] ?? 'default',
  ...(variants[status] ? {} : { class: 'adr-neutral' }),
});
