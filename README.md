# Portafolio de Oscar Lugo

Sitio personal y blog de Oscar Lugo, ingeniero en informática y desarrollador Full Stack.

**Sitio en producción:** https://oscarlugo.codejod.com

## Tecnologías

- [Astro](https://astro.build) 4 para generar el sitio estático
- [Tailwind CSS](https://tailwindcss.com) para los estilos
- Content Collections de Astro para el blog (posts en Markdown)
- [EmailJS](https://www.emailjs.com) para el formulario de contacto
- Sitemap, RSS y `robots.txt` generados en el build

## Estructura

```text
src/
├── components/   Secciones de la página (experiencia, proyectos, contacto...)
├── content/
│   ├── config.ts Esquema de los posts del blog
│   └── posts/    Artículos en Markdown
├── icons/        Iconos SVG como componentes
├── layouts/      Layout general y layout de los posts
├── pages/        Rutas: inicio, blog, tags, posts, RSS y 404
└── utils/        Funciones para ordenar posts y generar URLs de tags
public/img/       Capturas de proyectos, fotos y portadas del blog
```

## Agregar un post

Crea un archivo `.md` en `src/content/posts/` con este encabezado:

```yaml
---
title: 'Título del artículo'
pubDate: 2025-01-31
description: 'Resumen de una línea'
author: 'Oscar Lugo'
image:
    url: '/img/posts/mi-post.svg'
    alt: 'Descripción de la portada'
tags: ["django", "python"]
---
```

El nombre del archivo define la URL: `src/content/posts/mi-post.md` → `/posts/mi-post/`.

## Comandos

| Comando           | Acción                                       |
| :---------------- | :------------------------------------------- |
| `npm install`     | Instala las dependencias                     |
| `npm run dev`     | Servidor de desarrollo en `localhost:4321`   |
| `npm run build`   | Genera el sitio en `./dist/`                 |
| `npm run preview` | Sirve el build localmente antes de publicar  |
