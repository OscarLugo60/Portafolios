import rss, { pagesGlobToRssItems } from '@astrojs/rss';

export async function GET(context) {
  return rss({
    title: 'Oscar Lugo | Blog',
    description: 'Blog de desarrollo de Oscar Lugo',
    site: context.site,
    items: await pagesGlobToRssItems(import.meta.glob('./**/*.md')),
    customData: `<language>es-ve</language>`,
  });
}