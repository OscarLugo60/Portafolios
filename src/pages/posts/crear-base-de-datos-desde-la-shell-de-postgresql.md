---
layout: ../../layouts/MarkdownPostLayout.astro
title: 'Crear base de datos desde la Shell de PostgreSQL'
pubDate: 2024-09-25
description: 'Comandos simples para crear y eliminar una base de datos en PostgreSQL'
author: 'Oscar Lugo'
image: 
    url: 'https://kinsta.com/wp-content/uploads/2022/02/postgres-logo.png'
    alt: 'Logo de PostgreSQL'
tags: ["PostgreSQL","Base de datos",]
slug: 'crear-base-de-datos-desde-la-shell-de-postgresql'
---

En primer lugar, accedemos a la Shell de PostgreSQL:

![Conexión con la shell de PostgreSQL](../../img/posts/post-2/image1.png "shell PostgreSQL")

Luego ejecutarémos el siguiente comando:
```bash
CREATE DATABASE nombredb;
```
Luego es recomendable crear el usuario que tendrá acceso a dicha base de datos:
```bash
CREATE USER nombreuser;
```
Luego de crear el usuario debemos acceder a la base de datos y darle permisos al usuario que acabamos de crear sobre la misma:
```bash
\c nombredb
ALTER ROLE nombreuser WITH PASSWORD ‘password’;
```
Con estos simples pasos ya se ha creado la base de datos y hemos asignado un usuario a la misma, solo con esta configuración podemos realizar nuestras migraciones en django.

***Observación: no olvides los “;” al final de cada comando***

## Eliminar Base de Datos

En caso que necesitemos eliminar nuestra base de datos debemos acceder de igual manera a la **Shell de PostgreSQL** y ejecutar el siguiente comando:
```bash
DROP DATABASE nombredb;
```
Solo así ya habremos eliminado nuestra Base de Datos.
