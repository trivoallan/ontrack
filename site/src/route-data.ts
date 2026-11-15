import { spawnSync } from 'node:child_process';
import { defineRouteMiddleware } from '@astrojs/starlight/route-data';

// A reader who finds a mistake can fix it, and sees how old a page is.
// Starlight has both, from the path of the page under site/. That path goes
// through the symbolic link to docs/, where GitHub has nothing to edit and
// git no history: so both are set here, from the path of the file in docs/.
// Rule 5 of ADR-0008: once a release exists, the pages of `main` are served
// under next/, and point whoever lands there to the released ones. A full
// URL: the release is outside this build's base, and its link checker.
const banner = process.env.SITE_CHANNEL === 'next'
  ? { content: 'These pages document <code>main</code>, ahead of the latest release. <a href="https://trivoallan.github.io/ontrack/">Read the documentation of the latest release</a>.' }
  : undefined;

export const onRequest = defineRouteMiddleware((context) => {
  const route = context.locals.starlightRoute;
  if (banner) route.entry.data.banner = banner;
  const file = route.entry.filePath?.replace(/^src\/content\//, '');
  // The home page is not prose to correct. The 404 page is not a file: it
  // takes its path from the missing address, and says `editUrl: false`.
  if (!file?.startsWith('docs/') || route.entry.data.template === 'splash' || route.entry.data.editUrl === false) return;
  // A decided ADR is superseded, not edited, and an imported one is a copy
  // of its track: no edit link on either.
  if (!route.entry.data.adr) route.editUrl = new URL(`https://github.com/trivoallan/ontrack/edit/main/${file}`);
  // The date of the last commit that touched the file. Empty in a shallow
  // clone that never fetched it, hence docs.yml fetches the whole history.
  // ponytail: one `git log` per page; one for all pages if the build slows.
  // `:/` reads the path from the root of the repository, wherever the build runs.
  const seconds = spawnSync('git', ['log', '--format=%ct', '--max-count=1', '--', `:/${file}`], { encoding: 'utf8' }).stdout?.trim();
  if (seconds) route.lastUpdated = new Date(Number(seconds) * 1000);
});
