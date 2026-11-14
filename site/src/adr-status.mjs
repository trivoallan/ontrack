// How the status of an ADR is shown, in the sidebar and in its page.
// `rejected` is a full answer, not a failure: it is neutral, never red.
const tones = { accepted: 'success', proposed: 'caution' };

/** The colour class of a status, shared by the sidebar dot and the page badge. */
export const statusTone = (status) => tones[status] ?? 'adr-neutral';

/**
 * A Starlight sidebar badge for a status. `adr-dot` draws it as a dot (see
 * adr.css); its text stays in the page for screen readers.
 */
export const statusBadge = (status) => ({
  text: status,
  variant: tones[status] ?? 'default',
  class: tones[status] ? 'adr-dot' : 'adr-dot adr-neutral',
});
