# Security Cast - Prueba Técnica Fullstack

Este repositorio contiene una solución integral para la gestión de usuarios desarrollada para el proceso de selección de Security CAST S.A.S. El proyecto implementa una arquitectura desacoplada con un backend en Django y un frontend en React.

## Tecnologías Utilizadas

* **Backend**: Python 3, Django 6.0 y Django REST Framework (DRF).
* **Frontend**: React con Vite y Tailwind CSS.
* **Base de Datos**: MySQL 8.0.
* **Autenticación**: JSON Web Tokens (JWT) mediante Simple JWT.
* **Servicios Externos**: SMTP de Gmail para la recuperación de contraseñas.

## Características Técnicas

* **Seguridad**: Implementación de autenticación Bearer Token para la protección de endpoints.
* **CRUD de Usuarios**: Gestión completa de registros con validaciones en el lado del servidor.
* **Recuperación de Credenciales**: Flujo seguro de restablecimiento de contraseña mediante UID y Token criptográfico con envío de correos electrónicos.
* **Panel de Control**: Interfaz administrativa para la visualización y gestión del estado de usuarios (Activo/Inactivo).
* **Documentación**: API documentada y testeable mediante Swagger.

---

## Instrucciones de Instalación

### 1. Base de Datos (Docker)
Levante el servidor de base de datos MySQL con el siguiente comando:

```bash
docker run --name security_cast_db -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=security_cast -p 3306:3306 -d mysql:8.0
```

### 2. Configuración del Backend
Acceda al directorio del backend y configure el entorno de Python:

```bash
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
```

Poblar la base de datos con usuarios de prueba (Seeder):
```bash
python manage.py seed_users
```

Iniciar el servidor de desarrollo:
```bash
python manage.py runserver
```

*Usuarios generados por defecto:*
- Admin: admin@securitycast.com (Clave: AdminPassword123!)
- Usuario: juan.perez@test.com (Clave: UserPassword123!)

### 3. Configuración del Frontend
En una terminal independiente, configure el entorno de Node.js:

```bash
cd frontend
npm install
npm run dev
```

---

## Documentación de la API

La documentación interactiva de los endpoints se encuentra disponible en la siguiente dirección una vez que el servidor backend esté activo:

http://127.0.0.1:8000/swagger/

## Autor
Jostin Castillo