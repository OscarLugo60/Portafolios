import { getCollection } from 'astro:content';

export async function getSortedPosts() {
	const posts = await getCollection('posts');
	return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

// "Base de datos" -> "base-de-datos", para tener URLs sin espacios ni acentos
export function tagSlug(tag: string) {
	return tag
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.trim()
		.replace(/\s+/g, '-');
}

export function getUniqueTags(posts: Awaited<ReturnType<typeof getSortedPosts>>) {
	return [...new Set(posts.flatMap((post) => post.data.tags))];
}

export function formatDate(date: Date) {
	return date.toLocaleDateString('es-VE', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
}
