# URamos

Nuestro proyecto es *U-Ramos*, una página web para estudiantes de ingeniería, con el fin de ver y gestionar sus mallas académicas. Esto nace de una dificultad que existe ahora mismo para alumnos de la universidad: donde ver y gestionar los ramos obligatorios, ramos electivos que se quieran tomar de una forma más cómoda y no solamente una vez al inicio de semestre en la Inscripción Académica vía U-Campus.

Dado esto, con nuestro proyecto buscamos crear una página que sea cómoda de usar, sea eficiente para gestionar y planificar los ramos de cada persona y ayude a los alumnos a tener una mejor plataforma para visualizar los ramos de su malla académica.

## Estructura del Estado Global

Esta store centraliza toda la lógica relacionada con las mallas curriculares, incluyendo su obtención, creación, edición y eliminación.


Este proyecto utiliza la librería **Zustand** para la gestión del estado global, permitiendo una arquitectura más limpia, reactiva y desacoplada.  
El estado global está dividido en dos grandes áreas, ambas con su propio store:

- Estado Global para Mallas Curriculares
- Estado Global para Autenticación de Usuario

## 1. Estado Global de Mallas (`useMallaStore`)

La store `useMallaStore` centraliza toda la lógica relacionada con la gestión de mallas curriculares, tales como su obtención, creación, eliminación y modificación.

### Estado manejado

- `mallas`: lista completa de mallas del usuario.
- `mallaActual`: malla seleccionada actualmente.
- `isLoading`: indicador de carga para operaciones asíncronas.
- `error`: mensajes de error.

### Funciones principales

#### **`fetchMallasUser()`**
Obtiene todas las mallas del usuario desde el backend.

#### **`fetchMallaById(mallaId)`**
Obtiene una malla específica y la asigna a `mallaActual`.

#### **`createMalla(nombre, numSemestres, usarBase)`**
Crea una nueva malla y la añade al estado global.

#### **`deleteMalla(mallaId)`**
Elimina una malla del backend y del estado local.

#### **`updateRamoEstado(mallaId, ramoId, nuevoEstado)`**
Actualiza el estado de un ramo dentro de la malla.

#### **`removeRamoFromSemestre(mallaId, semestreNumero, ramoId)`**
Elimina un ramo de un semestre específico.

## 2. Estado Global de Autenticación (`useUserStore`)

La store `useUserStore` gestiona todo lo relacionado con la autenticación del usuario: login, registro, logout y restauración de sesión.

### Estado manejado

- `user`: información del usuario logueado.
- `isAuthenticated`: booleano que indica sesión activa.
- `isLoading`: estado de carga para operaciones async.
- `error`: mensajes de error para mostrar al usuario.

### Funciones principales

#### **`login(credentials)`**
Realiza el inicio de sesión con credenciales y actualiza el estado.

#### **`register(credentials)`**
Registra un nuevo usuario y luego inicia sesión automáticamente.

#### **`logout()`**
Cierra la sesión y limpia todos los datos del usuario.

#### **`restoreSession()`**
Restaura la sesión previa al cargar la aplicación (ideal para recordar al usuario).

## Mapa de Rutas

### 1. Rutas para el Manejo de las Mallas

#### **POST /**  
Crea una nueva malla.

#### **GET /**  
Obtiene todas las mallas del usuario autenticado.

#### **GET /:mallaId**  
Obtiene una malla específica por ID.

#### **DELETE /:mallaId**  
Elimina una malla por su ID.

#### **POST /:mallaId/semestres/:numero/ramos**  
Agrega un ramo a un semestre específico dentro de la malla.

#### **DELETE /:mallaId/semestres/:numero/ramos/:ramoId**  
Elimina un ramo de un semestre de la malla.

#### **PATCH /:mallaId/ramos/:ramoId**  
Actualiza el estado de un ramo (Aprobado, Reprobado, Pendiente).

### 2. Rutas para el Manejo de Ramos

#### **GET /ramos/**  
Obtiene la lista completa de ramos.

#### **GET /ramos/filters**  
Obtiene los filtros disponibles para ramos (por ejemplo: área, tipo, requisitos, créditos, etc.).

#### **GET /ramos/:id**  
Obtiene un ramo específico por su ID.

### 3. Rutas para el Sistema (Reset)

#### **POST /reset**  
Reinicia o restablece información del sistema según lo definido en el backend.

### 4. Rutas de Autenticación

#### **POST /login**  
Inicia sesión con credenciales y devuelve un token/cookie de sesión.

#### **POST /register**  
Registra un nuevo usuario en el sistema.

#### **POST /logout**  
Cierra la sesión del usuario autenticado.

#### **GET /me**  
Obtiene la información del usuario autenticado.






Versión dirigida al hito 2: Backend real + Autenticación + 2 vistas completas adicionales



## Integrantes
- Daniel Ávila 
- Guillermo Garda
- Sebastian Gonzalez
- Tomas Ubilla

## Variables de entorno requeridas.
Antes de correr nuestra aplicación, se necesita las siguientes variables de entorno para su correcto funcionamiento.

PORT=3001
HOST=localhost
MONGODB_URI=mongodb://localhost:27017/uramos
MONGODB_DBNAME=uramos
JWT_SECRET=miclavesecreta

## ¿Como correr nuestra aplicación?
Para el backend deben hacer lo siguiente.
1) Tener abierto una base de datos local MongoDB
2) cd backend
3) npx ts-node Scripts/seed.ts para poblar la base de datos
4) npm install, para descargar las librerías necesarias para el proyecto.
5) npm run dev

Para el frontend deben hacer lo siguiente (en otra terminal).
1) cd frontend 
2) npm install, para descargar las librerías necesarias para el proyecto.
3) npm run dev

Asi podemos conectar adecuadamente el backend con frontend.


VERSION TAILWINDS: npm install -D tailwindcss@3.4.17 postcss autoprefixer