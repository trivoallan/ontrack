// /llms.txt (https://llmstxt.org/): the pages of the site, for a coding agent
// that has an address and no sidebar. It links to the Markdown files under
// docs/, which are written to be read as they are, and whose links to each
// other hold there.
import { getCollection } from 'astro:content';

const raw = 'https://raw.githubusercontent.com/trivoallan/ontrack/main/';

export async function GET() {
  const pages = (await getCollection('docs')).sort((a, b) => a.id.localeCompare(b.id));
  const home = pages.find((page) => page.id === 'index')!;
  const line = (page: (typeof pages)[number]) => {
    const { title, description, adr, status } = page.data;
    // An ADR has no description: its number and its status say what it is.
    const about = description ?? (adr && status);
    return `- [${adr ? `${adr} ` : ''}${title}](${raw}${page.filePath!.replace(/^src\/content\//, '')})${about ? `: ${about}` : ''}`;
  };
  // What ontrack is for: every page but this repository's own decisions and
  // architecture, the tutorial first.
  const guides = pages.filter((page) => page !== home && !/^(adr|architecture)\//.test(page.id));
  guides.sort((a, b) => (a.data.sidebar.order ?? Infinity) - (b.data.sidebar.order ?? Infinity));
  const section = (prefix: string) => pages.filter((page) => page.id.startsWith(prefix)).map(line);

  const text = [
    '# ontrack',
    '',
    `> ${home.data.description}`,
    '',
    '## Docs',
    '',
    ...guides.map(line),
    '',
    // The section an agent short of context may skip: how ontrack itself is
    // made, not how to use it.
    '## Optional',
    '',
    ...section('architecture/'),
    ...section('adr/'),
    '',
  ].join('\n');
  return new Response(text, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
