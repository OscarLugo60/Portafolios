---
layout: ../../layouts/MarkdownPostLayout.astro
title: 'Cómo crear un nuevo proyecto en Django'
pubDate: 2024-09-25
description: 'Paso a paso para crear un proyecto en Django, incluyendo la configuración basica de los archivos settings'
author: 'Oscar Lugo'
image: 
    url: 'https://imagedelivery.net/qc7VvyphMGWFiPVvTbB-ww/swapps.com/2016/02/simply-django-announcements.jpg/w=1024,h=576'
    alt: 'Logo de Django sobre codigo python'
tags: ["django", "python",]
slug: 'como-crear-un-nuevo-proyecto-en-django'
---
## Creación del Entorno Virtual

En primer lugar, es necesario crear un entorno virtual donde podamos instalar todos los paquetes de Python que necesitaremos, primero abriremos nuestra consola y nos dirigiremos a la carpeta donde trabajaremos, y ejecutaremos:

```bash
python -m venv nombre_entorno
```
Sustituyendo “nombre_entorno” por el nombre que deseemos colocar.

Ahora podemos activar el entorno virtual de la siguiente manera:
* **Windows:**
```bash
nombre_entorno\Scripts\activate
```
* **Linux/MacOS:** 
```bash
source nombre_entorno/bin/activate
```

## Instalación de Django y Paquetes Adicionales

Con el entorno virtual activo podemos instalar los paquetes que necesitaremos, utilizando el instalador de paquetes pip.
```bash
pip install django
```
Para iniciar un proyecto en Django utilizamos el siguiente comando al estar ubicados en la carpeta donde queremos que se encuentre nuestro código:
```bash
django-admin startproject nombre_proyecto
```
Con estos pasos ya podemos ejecutar nuestro proyecto para comprobar que la instalación se realizó correctamente, para hacerlo debemos acceder a la carpeta que se creó con el comando anterior y ejecutar el siguiente comando:
```bash
python manage.py runserver
```
### **Otros paquetes recomendados:**
* ***django-cors-headers***: permite configurar los CORS para que las API's que creemos puedan ser accedidas por el front.
* ***djangorestframework***: permite usar django como servicio REST.
* ***psycopg2***: permite trabajar con bases de datos PostgreSQL.
* ***pillow***: permite procesar imagenes.

El siguiente paso es dividir el archivo settings, con el objetivo de que las configuraciones se puedan cambiar en la etapa de desarrollo y en la etapa de despliegue y sean más fáciles de manipular.

Debemos crear una carpeta llamada **settings** y dentro de ella crearemos 3 archivos, los cuales serán:
* ***base.py:*** para colocar todas las configuraciones que no cambiarán al estar en producción o en desarrollo.
* ***local.py:*** se colocarán las configuraciones de base de datos y otras.
* ***prod.py:*** se colocarán las mismas configuraciones que contiene el archivo **local.py** pero con los datos que se le implementarán en el servidor donde se ejecute.

Luego de cambiar estos datos, debemos editar el archivo **manage.py** para cambiar la ruta al nuevo archivo **settings**, el cual es **local.py** o **prod.py** según el entorno en el que se encuentre nuestro proyecto.
## Aumentar la seguridad de los settings

Al compartir un proyecto en github es ideal resguardar información que colocamos en los settins que es de vital importancia como lo es la **secret key** que se genera al crear el **proyecto de Django** y los datos de acceso a nuestra base de datos.

Por ende, es recomendable crear un archivo json privado y desde el **código de python** acceder a esa información importante. 

Primero crearémos el archivo, yo le colocaré de nombre **secret.json**, estará en la carpeta raíz de mi proyecto y tendrá la siguiente estructura:
```json
{
    "FILE_NAME": "secret.json",
    "SECRET_KEY": "SECRET_KEY",
    "DB_NAME": "DB_NAME",
    "DB_USER": "DB_USER",
    "DB_PASSWORD": "DB_PASSWORD"
}
```
Luego en el **archivo base.py** deberemos importar:
```python
from django.core.exceptions import ImproperlyConfigured
import json
from unipath import Path
```
Usarémos **unipath** para cambiar la forma en la que funciona **BASE_DIR** para acceder más fácilmente al archivo **secret** por lo que eso será lo primero que harémos:
```python
BASE_DIR = Path(__file__).ancestor(3)
```
Ahora accederémos al archivo secret de la siguiente manera:
```python
with open(BASE_DIR.child('secret.json')) as f:
    secret = json.loads(f.read())
```
Luego creamos una función que obtenga las variables que necesitamos dentro de ese archivo:
```python
def get_secret(secret_name, secrets=secrets):
    try:
        return secrets[secret_name]
    excetp:
    msg: "la varialbre %s no existe" % secret_name
    raise ImproperlyConfigured(msg)
```
Esta función recibe como primer parametro un **"secret_name"** que es el nombre de la variable que necesitamos encontrar dentro del archivo secret, y como segundo parámetro recibe el contenido del archivo que obtuvimos en la instrucción anterior, luego intenta obtener el valor de la variable que estamos solicitando, en caso de que no exista dicha variable retornará un error con el mensaje: ***"la variable 'nombre_variable' no existe"***.

De esta manera, ya podemos obtener los datos que necesitamos, como lo es la secret_key que genera django:
```python
SECRET_KEY = get_secret('SECRET_KEY')
```

## Organizar el resto del archivo base.py

Para llevar un mejor control de nuestro código es ideal modificar algunos aspectos de nuestro archivo de configuración, comenzando por la sección de **INSTALLED_APPS** la cual es recomendable dividir de la siguiente manera:
```python
DJANGO_APPS = (
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
)
LOCAL_APPS = (

)
THIRD_PARTY_APPS = (
    'rest_framework',
    'rest_framework.authtoken',
    'corsheaders'
)

INSTALLED_APPS = DJANGO_APPS + LOCAL_APPS + THIRD_PARTY_APPS
```
Crearemos 3 tuplas, donde separaremos las **aplicaciones originales de django**, las aplicaciones desarrolladas por nosotros y las aplicaciones de terceros que importemos como lo son **django rest framework** y **django cors headers** que deben registrarse como aplicaciones para que funcionen correctamente, luego esas tres tuplas las concatenarémos dentro de la variable **INSTALLED_APPS**, de esta manera seguirá cumpliendo la misma función y tendremos nuestro código más organizado.

### Templates
En la configuración de los templates solo necesitarémos colocar la dirección de la carpeta donde colocarémos nuestros templates: 
```python
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR.child('templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]
```
Lo cual logramos usando la variable **BASE_DIR**, accedemos a su hijo y a la carpeta que creamos con nombre **templates**, la cual coloque a la misma altura del archivo **manage.py**.

### Últimas consideraciones en el archivo base.py

En el archivo **base.py** debemos integrar, en caso de que necesitemos un modelo de base de datos que funcione como autenticación  de usuarios debemos especificarlo con la variable **AUTH_USER_MODEL**.

También, para que funcione la configuración de los CORS debemos integrarla en este archivo sin embargo la configuración varará según las necesidades, se puede obtener más información en la [documentación de django cors headers](https://pypi.org/project/django-cors-headers/).

Por último, se recomienda cambiar la configuración de internacionalización y zona horaria según corresponda.

### Organizar el archivo local.py y prod.py

Luego de tener el **archivo base** organizado podemos empezar a trabajar en los archivos local y prod, los cuales tendrán la misma estructura, pero con diferente información, debido a que en estos se colocarán los datos de acceso a la base de datos y las configuraciones de los archivos estáticos y multimedia, en primer lugar, debemos importar todo el archivo base.py:

```python
from .base import *
```
Luego colocarémos la configuración que activa o desactiva el modo debug, el cual funciona para que los errores se nos muestren de mejor manera para solucionarlos más rápidamente, sin embargo, esta configuración en etapa de producción no se suele activar, porque de esta manera suelen mostrarse partes de nuestro codigo, lo cual no es seguro para nuestros sistemas.
```python
DEBUG = True
```
La siguiente configuración es la variable **ALLOWED_HOST** que son los hosts que se permiten conectarse a nuestro proyecto:
```python
ALLOWED_HOSTS = ["*"]
```
De esta manera se permiten conexiones desde todos los hosts, suele colocarse de esta manera solo en etapa de desarrollo.

Ahora colocarémos la configuración de conexión a la base de datos:
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': get_secret('DB_NAME'),
        'USER': get_secret('USER'),
        'PASSWORD': get_secret('PASSWORD'),
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```
En primer lugar, modificaremos el **ENGINE** en el cual, como trabajaremos con **PostgreSQL** utilizando **psycopg2**, los datos de **NAME, USER, PASSWORD** las extraeremos de nuestro archivo secrets tal como hicimos con la **SECRET_KEY en nuestro archivo base.py**, desde el cual estamos importando la función que obtiene los datos de dicho archivo.

Por último, colocarémos la configuración de los archivos estáticos y multimedia, la cual colocaremos de la siguiente manera en modo de desarrollo en producción cambiará según cómo se haga el despliegue:
```python
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR.child('staticfiles')
STATICFILES_DIRS = [BASE_DIR.child('static')]

MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR.child('media')
```