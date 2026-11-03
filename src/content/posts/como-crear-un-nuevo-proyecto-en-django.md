---
title: 'Cómo crear un nuevo proyecto en Django'
pubDate: 2024-09-25
description: 'Paso a paso para crear un proyecto en Django, incluyendo la configuración básica de los archivos settings'
author: 'Oscar Lugo'
image: 
    url: '/img/posts/como-crear-un-nuevo-proyecto-en-django.svg'
    alt: 'Portada: Cómo crear un nuevo proyecto en Django'
tags: ["django", "python"]
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
* ***django-environ***: permite leer la configuración sensible desde variables de entorno o un archivo `.env`.
* ***django-cors-headers***: permite configurar los CORS para que las API que creemos puedan ser accedidas por el front.
* ***djangorestframework***: permite usar Django como servicio REST.
* ***psycopg***: permite trabajar con bases de datos PostgreSQL (se instala con `pip install "psycopg[binary]"`).
* ***pillow***: permite procesar imágenes.

El siguiente paso es dividir el archivo settings, con el objetivo de que las configuraciones se puedan cambiar en la etapa de desarrollo y en la etapa de despliegue y sean más fáciles de manipular.

Debemos crear una carpeta llamada **settings** y dentro de ella crearemos 3 archivos, los cuales serán:
* ***base.py:*** para colocar todas las configuraciones que no cambiarán al estar en producción o en desarrollo.
* ***local.py:*** se colocarán las configuraciones de base de datos y otras.
* ***prod.py:*** se colocarán las mismas configuraciones que contiene el archivo **local.py** pero con los datos que se le implementarán en el servidor donde se ejecute.

Luego de crear estos archivos, debemos editar **manage.py** (y también **wsgi.py** y **asgi.py**) para que apunten al nuevo archivo de settings según el entorno:
```python
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'nombre_proyecto.settings.local')
```
En el servidor de producción usaremos `nombre_proyecto.settings.prod`.

## Aumentar la seguridad de los settings

Al compartir un proyecto en GitHub es importante no publicar información sensible que colocamos en los settings, como la **secret key** que se genera al crear el **proyecto de Django** y los datos de acceso a nuestra base de datos.

La práctica recomendada es guardar esos datos en **variables de entorno**. En desarrollo es más cómodo tenerlas en un archivo **.env** en la raíz del proyecto, que leeremos con **django-environ**:
```bash
pip install django-environ
```
El archivo **.env** tendrá la siguiente estructura:
```bash
SECRET_KEY=tu_secret_key
DEBUG=True
DB_NAME=nombredb
DB_USER=nombreuser
DB_PASSWORD=password
```
Es muy importante agregar **.env** al archivo **.gitignore** para que nunca se suba al repositorio. Si quieres que otras personas sepan qué variables necesita el proyecto, puedes subir un archivo **.env.example** con los mismos nombres pero sin los valores reales.

Luego en el **archivo base.py** definimos **BASE_DIR** con **pathlib**, que ya viene incluido en Python. Como ahora settings está dentro de una carpeta, debemos subir tres niveles para llegar a la raíz del proyecto:
```python
from pathlib import Path
import environ

BASE_DIR = Path(__file__).resolve().parent.parent.parent

env = environ.Env()
environ.Env.read_env(BASE_DIR / '.env')
```
**read_env** carga las variables del archivo **.env** si existe. En producción podemos definir las variables directamente en el servidor y el código seguirá funcionando igual.

De esta manera, ya podemos obtener los datos que necesitamos, como la secret key que genera Django:
```python
SECRET_KEY = env('SECRET_KEY')
```
Si la variable no existe, **django-environ** lanza un error **ImproperlyConfigured** que indica cuál falta, así que no necesitamos escribir esa validación nosotros.

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
Crearemos 3 tuplas, donde separaremos las **aplicaciones originales de django**, las aplicaciones desarrolladas por nosotros y las aplicaciones de terceros que importemos como lo son **django rest framework** y **django cors headers** que deben registrarse como aplicaciones para que funcionen correctamente, luego esas tres tuplas las concatenaremos dentro de la variable **INSTALLED_APPS**, de esta manera seguirá cumpliendo la misma función y tendremos nuestro código más organizado.

### Templates
En la configuración de los templates solo necesitaremos colocar la dirección de la carpeta donde colocaremos nuestros templates: 
```python
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
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
Lo cual logramos usando la variable **BASE_DIR** y el operador **/** de pathlib para apuntar a la carpeta que creamos con nombre **templates**, la cual coloqué a la misma altura del archivo **manage.py**.

### Últimas consideraciones en el archivo base.py

En el archivo **base.py** debemos integrar, en caso de que necesitemos un modelo de base de datos que funcione como autenticación de usuarios debemos especificarlo con la variable **AUTH_USER_MODEL**.

También, para que funcione la configuración de los CORS debemos integrarla en este archivo sin embargo la configuración variará según las necesidades, se puede obtener más información en la [documentación de django cors headers](https://pypi.org/project/django-cors-headers/).

Por último, se recomienda cambiar la configuración de internacionalización y zona horaria según corresponda.

### Organizar el archivo local.py y prod.py

Luego de tener el **archivo base** organizado podemos empezar a trabajar en los archivos local y prod, los cuales tendrán la misma estructura, pero con diferente información, debido a que en estos se colocarán los datos de acceso a la base de datos y las configuraciones de los archivos estáticos y multimedia, en primer lugar, debemos importar todo el archivo base.py:

```python
from .base import *
```
Luego colocaremos la configuración que activa o desactiva el modo debug, el cual funciona para que los errores se nos muestren de mejor manera para solucionarlos más rápidamente, sin embargo, esta configuración en etapa de producción no se suele activar, porque de esta manera suelen mostrarse partes de nuestro código, lo cual no es seguro para nuestros sistemas.
```python
DEBUG = env.bool('DEBUG', default=False)
```
La siguiente configuración es la variable **ALLOWED_HOSTS**, que son los hosts que se permiten conectarse a nuestro proyecto:
```python
ALLOWED_HOSTS = ["*"]
```
De esta manera se permiten conexiones desde todos los hosts, suele colocarse de esta manera solo en etapa de desarrollo.

Ahora colocaremos la configuración de conexión a la base de datos:
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': env('DB_NAME'),
        'USER': env('DB_USER'),
        'PASSWORD': env('DB_PASSWORD'),
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```
En primer lugar, modificaremos el **ENGINE**: como trabajaremos con **PostgreSQL** usamos `django.db.backends.postgresql`, que funciona con **psycopg**. Los datos de **NAME, USER y PASSWORD** los leemos de las variables de entorno con **env**, igual que hicimos con la **SECRET_KEY** en **base.py**; el objeto **env** está disponible porque importamos todo desde ese archivo.

Por último, colocaremos la configuración de los archivos estáticos y multimedia, la cual colocaremos de la siguiente manera en modo de desarrollo en producción cambiará según cómo se haga el despliegue:
```python
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_DIRS = [BASE_DIR / 'static']

MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'
```