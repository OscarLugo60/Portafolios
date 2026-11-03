---
title: 'Cómo enviar un PDF por Correo Electrónico con Django Rest Framework'
pubDate: 2025-10-07
description: 'Paso a paso para generar un PDF con WeasyPrint y enviarlo por correo electrónico'
author: 'Oscar Lugo'
image: 
    url: '/img/posts/como-enviar-pdf-por-correo-con-django-rest-framework.svg'
    alt: 'Portada: Cómo enviar un PDF por correo con Django REST Framework'
tags: ["django", "pdf", "email"]
slug: 'como-enviar-pdf-por-correo-con-django-rest-framework'
---
## Introducción

Esta guía explica paso a paso cómo crear una vista en Django REST Framework que reciba un ID, consulte un registro en la base de datos, genere un archivo PDF y lo envíe por correo electrónico.

## Prerrequisitos
### Librerías necesarias

```bash
pip install django djangorestframework weasyprint
```

### Estructura del proyecto

```text
mi_proyecto/
├── manage.py
├── mi_app/
│   ├── __init__.py
│   ├── models.py
│   ├── views.py
│   ├── urls.py
│   └── ...
└── mi_proyecto/
    ├── __init__.py
    ├── settings.py
    ├── urls.py
    └── ...
```

## Implementación paso a paso

### 1. Configurar el modelo
Primero, asegúrate de tener un modelo en tu aplicación. Por ejemplo:

```python
# mi_app/models.py
from django.db import models

class TuModelo(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField()
    # Agrega los campos que necesites
    
    def __str__(self):
        return self.nombre
```

### 2. Crear el template HTML para el PDF
Crea un archivo de template en `templates/template_pdf.html`:

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Reporte PDF</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 40px;
            line-height: 1.6;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #333;
            padding-bottom: 20px;
        }
        .info {
            margin-top: 20px;
        }
        .info-item {
            margin: 10px 0;
            padding: 10px;
            background-color: #f9f9f9;
            border-left: 4px solid #007bff;
        }
        .footer {
            margin-top: 50px;
            text-align: center;
            font-size: 12px;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Reporte del Registro</h1>
        <p>Centro Médico Docente el Paso</p>
    </div>
    
    <div class="info">
        <div class="info-item">
            <strong>ID:</strong> {{ registro.id }}
        </div>
        <div class="info-item">
            <strong>Nombre:</strong> {{ registro.nombre }}
        </div>
        <div class="info-item">
            <strong>Descripción:</strong> {{ registro.descripcion }}
        </div>
        <!-- Agrega más campos según necesites -->
    </div>
    
    <div class="footer">
        <p>Generado el {% now "d/m/Y H:i" %}</p>
    </div>
</body>
</html>
```
### 3. Crear la vista

Crea la vista en `mi_app/views.py`:
```python
# mi_app/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.mail import EmailMessage
from django.template.loader import render_to_string
from weasyprint import HTML
from io import BytesIO
from .models import TuModelo  # Importa tu modelo

class GenerarPDFYEnviarCorreo(APIView):
    """
    Vista para generar un PDF y enviarlo por correo electrónico
    """
    
    def get(self, request, id):
        try:
            # 1. Consultar el registro en la base de datos
            registro = TuModelo.objects.get(id=id)
            
        except TuModelo.DoesNotExist:
            return Response(
                {"error": "Registro no encontrado"}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        try:
            # 2. Renderizar el template HTML con los datos del registro
            html_string = render_to_string('template_pdf.html', {'registro': registro})
            
            # 3. Crear un buffer en memoria para el PDF
            pdf_file = BytesIO()
            
            # 4. Generar el PDF usando WeasyPrint
            HTML(string=html_string).write_pdf(pdf_file)
            
            # 5. Obtener el contenido del PDF
            pdf_content = pdf_file.getvalue()
            pdf_file.close()
            
            # 6. Configurar y enviar el correo electrónico
            email = EmailMessage(
                subject='Resultado de examen de laboratorio',  # Asunto del correo
                body='''El laboratorio de Centro Médico Docente el Paso 
                le hace llegar el resultado de su examen de laboratorio.
                                
                Si tiene alguna pregunta, no dude en contactarnos.
                                
                Atentamente,
                El equipo del Centro Médico''',# Cuerpo del correo
                from_email='oscarlugo60@gmail.com',  # Remitente
                to=['oscarlugo60@gmail.com'],  # Destinatario(s)
                # cc=['otro_correo@example.com'],  # Opcional: con copia
            )
            
            # 7. Adjuntar el PDF al correo
            email.attach(
                filename=f'reporte_{registro.id}.pdf',
                content=pdf_content,
                mimetype='application/pdf'
            )
            
            # 8. Enviar el correo
            email.send()
            
            # 9. Retornar respuesta de éxito
            return Response(
                {
                    "mensaje": "PDF generado y enviado por correo correctamente",
                    "id_registro": registro.id
                }, 
                status=status.HTTP_200_OK
            )
            
        except Exception as e:
            # 10. Manejar errores durante el proceso
            return Response(
                {"error": f"Error al procesar la solicitud: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
```

### 4. Configurar las URLs

En `mi_app/urls.py`:
```python
# mi_app/urls.py
from django.urls import path
from .views import GenerarPDFYEnviarCorreo

urlpatterns = [
    path('generar-pdf/<int:id>/', GenerarPDFYEnviarCorreo.as_view(), name='generar-pdf'),
]
```
Y en el `mi_proyecto/urls.py` principal:
```python
# mi_proyecto/urls.py
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('mi_app.urls')),  # Incluye las URLs de tu app
]
```
### 5. Configurar el servicio de correo

En `settings.py`, agrega la configuración del servidor de correo:
```python
# settings.py

# Configuración para Gmail
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'tu_correo@gmail.com'  # Tu correo de Gmail
EMAIL_HOST_PASSWORD = 'tu_contraseña'  # Tu contraseña o contraseña de aplicación

# Configuración alternativa para otros servicios
"""
# Para SendGrid
EMAIL_HOST = 'smtp.sendgrid.net'
EMAIL_HOST_USER = 'apikey'
EMAIL_HOST_PASSWORD = 'tu_api_key_de_sendgrid'

# Para Outlook/Office365
EMAIL_HOST = 'smtp.office365.com'
EMAIL_PORT = 587
"""
```
### 6. Configurar Templates

Asegúrate de que Django pueda encontrar tus templates. En `settings.py`:
```python
# settings.py
import os

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates')],  # Agrega esta línea
        'APP_DIRS': True,
        # ... resto de la configuración
    },
]
```

## Probar la implementación

### 1. Ejecutar las migraciones
```bash
python manage.py makemigrations
python manage.py migrate
```

### 2. Crear un registro de prueba

Puedes crear un registro desde el admin de Django o usando el shell:
```bash
python manage.py shell
```
```python
from mi_app.models import TuModelo
TuModelo.objects.create(nombre="Ejemplo", descripcion="Este es un registro de prueba")
```

### 3. Probar la API

Haz una solicitud GET a la URL:
```bash
http://localhost:8000/api/generar-pdf/1/
```
O usa curl:
```bash
curl http://localhost:8000/api/generar-pdf/1/
```
## Solución de Problemas Comunes


### Error: `ModuleNotFoundError: No module named 'weasyprint'`


```bash
pip install weasyprint
```

### Error: `SMTPAuthenticationError`

-   Verifica usuario y contraseña

-   Para Gmail, usa una [contraseña de aplicación](https://myaccount.google.com/apppasswords)

### Error: `TemplateDoesNotExist`

-   Verifica la ruta del template
    
-   Asegúrate de que la carpeta `templates` esté en el lugar correcto
    

### El PDF no se genera correctamente

-   Verifica que el template HTML sea válido
    
-   Revisa que los datos del registro se estén pasando correctamente al template

## Estructura del Correo Enviado

```text
Asunto: Resultado de examen de laboratorio

De: oscarlugo60@gmail.com
Para: oscarlugo60@gmail.com

El laboratorio de Centro Médico Docente el Paso 
le hace llegar el resultado de su examen de laboratorio.

Si tiene alguna pregunta, no dude en contactarnos.

Atentamente,
El equipo del Centro Médico

[Adjunto: reporte_1.pdf]
```