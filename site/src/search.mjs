// Search ranks the pages written to answer a reader (the tutorial, the
// guides, the reference) before the pages that record how this repository
// decided or is built (the ADRs, the architecture document), for the words
// they share. Pagefind multiplies the weight of a word by the weight of the
// element it is in: 1 by default, 7 in an <h1>.
// ponytail: one constant found by trying the searches of the pull request
// that added them; revisit when a search for a product word lands on an ADR.
const WEIGHT = '0.2';

/** The weight of a page's title and of its text, or none for a page that keeps Pagefind's. */
export function searchWeight({ id, entry }) {
  return entry.data.adr || id.startsWith('architecture/') ? WEIGHT : undefined;
}
