import rss from '@astrojs/rss';
import { getSortedPosts } from '../utils/posts';

export async function GET(context) {
  const posts = await getSortedPosts();
  return rss({
    title: 'Oscar Lugo | Blog',
    description: 'Blog de desarrollo de Oscar Lugo',
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/posts/${post.slug}/`,
    })),
    customData: `<language>es-ve</language>`,
  });
}
