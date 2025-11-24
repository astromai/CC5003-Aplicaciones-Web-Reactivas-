# **U-Ramos**

## **Integrantes del Equipo**

- Daniel Ávila 
- Guillermo Garda
- Sebastian Gonzalez
- Tomas Ubilla

## **Descripción del Proyecto**
Nuestro proyecto es *U-Ramos*, una página web para estudiantes de ingeniería, con el fin de ver y gestionar sus mallas académicas. Esto nace de una dificultad que existe ahora mismo para alumnos de la universidad: donde ver y gestionar los ramos obligatorios, ramos electivos que se quieran tomar de una forma más cómoda y no solamente una vez al inicio de semestre en la Inscripción Académica vía U-Campus.

Dado esto, con nuestro proyecto buscamos crear una página que sea cómoda de usar, sea eficiente para gestionar y planificar los ramos de cada persona y ayude a los alumnos a tener una mejor plataforma para visualizar los ramos de su malla académica.

A rasgos generales, esta se compone de vistas para login y register de usuarios, lista de mallas del usuario, mallas particulares, y descripciones de ramos. Se pueden crear mallas con cantidades de semestres personalizado, escoger ramos tanto de Plan Común como de especialidad (para efecto de este proyecto, solo ramos DCC), barra de progreso y de colores sobre los ramos (para ver si un ramo está aprobado, reprobado o en progreso, dependiendo de como lo maneje el usuario), al igual de poder quitar ramos o eliminar mallas. Y por supuesto, login, register y logout para los usuarios de la aplicación web.

## **Estructura del Estado Global**

Esta store centraliza toda la lógica relacionada con las mallas curriculares, incluyendo su obtención, creación, edición y eliminación.

Este proyecto utiliza la librería **Zustand** para la gestión del estado global, permitiendo una arquitectura más limpia, reactiva y desacoplada.  
El estado global está dividido en dos grandes áreas, ambas con su propio store:

- Estado Global para Mallas Curriculares
- Estado Global para Autenticación de Usuario

## 1. Estado Global de Mallas (`useMallaStore`)

La store `useMallaStore` centraliza toda la lógica relacionada con la gestión de **mallas curriculares**, tales como su obtención, creación, eliminación y modificación.

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

La store `useUserStore` gestiona todo lo relacionado con la **autenticación del usuario**: login, registro, logout y restauración de sesión.

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

## **Mapa de Rutas**

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

# **Flujo de Autenticación del Sistema**

El sistema utiliza **JWT en cookies HttpOnly**, junto con un **token CSRF**, para manejar sesiones seguras entre el cliente y el servidor. A continuación se describe el flujo completo basado en los archivos `config.ts`, `middleware.ts`, `userController.ts`, `User.ts` y `user.ts`.

## 1. Configuración del Sistema (`config.ts`)

El archivo `config.ts` centraliza las variables sensibles y de entorno necesarias para la autenticación:

- **JWT_SECRET**: clave usada para firmar y verificar tokens JWT.
- **MONGODB_URI** y **MONGODB_DBNAME**: configuración de la base de datos.
- **PORT** y **HOST**: configuración del servidor.
- Diferencia automáticamente entornos: `test`, `development`, `production`.

Este archivo asegura que la autenticación utilice siempre el secreto y la configuración correctos.

## 2. Middleware de Autenticación (`withUser`)

El middleware `withUser` se aplica a todas las rutas protegidas.

### **Responsabilidades**
1. Leer la cookie `token` enviada por el cliente.
2. Verificar y decodificar el JWT usando `JWT_SECRET`.
3. Validar el token anti-CSRF:
   - El token decodificado contiene `csrf`.
   - El cliente debe enviarlo en el header `X-CSRF-Token`.
   - Si no coinciden, tira error **401 Unauthorized**.
4. Si es válido:
   - Agrega `req.user = { id, csrf }`
   - Continúa hacia la ruta protegida.

Este middleware asegura que cada request sea autenticada antes de tocar datos del usuario.

## 3. Modelo de Usuario (`User.ts`)

El modelo define:

- `username` (único)
- `passwordHash` (contraseña cifrada con bcrypt)

Además, se configura `.toJSON()` para eliminar:
- `_id`
- `__v`
- `passwordHash`

Garantizando que nunca se exponga la contraseña del usuario.

## 4. Inicio de Sesión — `POST /login` (`userController.ts`)

### **Flujo**
1. El usuario envía `username` y `password`.
2. Se busca al usuario en MongoDB.
3. Se compara la contraseña usando **bcrypt.compare**.
4. Si es válida:
   - Se genera un objeto `userForToken`:
     ```json
     {
       "username": "...",
       "csrf": "<uuid>",
       "id": "<mongo-id>"
     }
     ```
   - Se firma un JWT con `jwt.sign(...)`.
   - Se devuelve al cliente:
     - Cookie `token` (HttpOnly, no accesible desde JS)
     - Header `X-CSRF-Token` con el token CSRF
     - Respuesta JSON con datos básicos del usuario.

Si la contraseña es incorrecta, devuelve error **401**.

### **Seguridad incluida**
- Cookie HttpOnly → No se puede leer con JS (evita XSS).
- Token CSRF → Previene ataques CSRF.
- Expiración del token → 1 hora.

## 5. Registro de Usuario — `POST /register`

### **Flujo**
1. El usuario envía `username` y `password`.
2. Se genera el hash seguro de la contraseña (`bcrypt.hash`).
3. Se guarda el usuario en MongoDB.
4. Se devuelve el usuario creado (sin passwordHash).

## 6. Restaurar Sesión — `GET /me`

Ruta protegida mediante `withUser`.

### **Flujo**
1. El middleware valida el JWT y el CSRF.
2. Se obtiene la `id` del usuario desde el token decodificado.
3. Se busca el usuario en MongoDB.
4. Se devuelven únicamente:
   ```json
   { "username": "...", "id": "..." }

Se usa para restaurar sesión tras recargar la página o volver a entrar a la app.

## 7. Cierre de Sesión — `POST /logout`

El cierre de sesión borra completamente la sesión del usuario desde el servidor.

### **Flujo**
1. El cliente envía una petición `POST /logout`.
2. El controlador ejecuta:
   ```ts
   res.clearCookie("token");

Esto elimina la cookie que contiene el JWT.

## 8. Registradores y Manejo de Errores

El sistema incorpora middlewares adicionales que aseguran un funcionamiento consistente, permiten depuración y garantizan respuestas claras durante el flujo de autenticación.

### **8.1 requestLogger**

Middleware definido en `middleware.ts`.  
Registra cada request entrante mostrando:

- Método HTTP
- Ruta solicitada
- Cuerpo del request
- Separadores para lectura clara

### **8.1 unknownEndpoint**

Middleware definido en `middleware.ts`.  
Controla toda petición a rutas inexistentes.
Esto evita comportamientos inesperados cuando el cliente consulta rutas mal escritas o inexistentes.

### **8.3 unknownEndpoint**

Middleware definido en `middleware.ts`.  
Middleware central de manejo de errores.
Captura excepciones producidas durante la autenticación y el acceso a datos.

Tipos de errores manejados:

CastError → ID malformado

ValidationError → Error de validación de Mongoose

MongoServerError (duplicate key) → username duplicado

JsonWebTokenError → Token inválido

TokenExpiredError → Token expirado

# **Descripción de los tests E2E**

## Herramienta utilizada: Playwright

Los tests E2E se desarrollan con **Playwright Test**, que permite:

- Automatizar navegadores reales.
- Interactuar con elementos usando selectores accesibles (roles ARIA).
- Simular interacciones de usuario.
- Reiniciar el backend para aislar escenarios.
- Usar helpers personalizados para login y registro.

Helpers utilizados:

- `loginWith(page, username, password)`
- `registerWith(page, username, password)`

Ambos están en helper.ts

## Flujos Cubiertos por los Tests

### 1. Login y Registro

#### Archivo: `loginRegister.spec.ts`

#### Flujos probados:

#### Login con credenciales inválidas
- Intento de login con usuario inexistente.
- Se verifica mensaje: *"Error al hacer login. Revisa tus credenciales."*

#### Registro de usuario y ciclo completo
- Navegar a “Regístrate aquí”.
- Completar formulario con `registerWith`.
- Ver aparición de *"Mis Mallas"*.
- Cerrar sesión y verificar retorno a pantalla inicial.

#### Login con usuario existente
- Login exitoso usando `loginWith`.
- Se verifica que se muestre *"Mis Mallas"*.

### 2. Gestión de Mallas

#### Archivo: `malla.spec.ts`

### 2.1 Creación de Mallas

#### No se puede crear una malla sin nombre
- Crear nueva Malla dejando nombre vacío.
- Validación esperada: *"El nombre de la malla es requerido"*.

#### Crear una Malla correctamente
- Completar nombre y créditos.
- Confirmar creación.
- Ver la nueva malla visible en pantalla.

#### Crear Malla usando plan base sugerido
- Marcar *"Iniciar con malla ideal (plan base sugerido)"*.
- Crear y verificar que aparece correctamente.

## 2.2 Eliminación de una Malla

#### Eliminar Malla existente
- Hover sobre la malla.
- Clic en “Eliminar” y aceptar el diálogo.
- Verificar que ya no existe en la lista.

### 2.3 Agregar Ramos a una Malla

#### Flujos cubiertos por categoría:

##### Agregar Ramo de Plan Común
- Abrir “Agregar Ramo”.
- Categoría: Plan Común → CC.
- Selección de estado (Aprobado).
- Agregar “Herramientas Computacionales”.

##### Agregar Electivo de Especialidad
- Categoría: Especialidad → Electivo.
- Área: Ciberseguridad.
- Estado: Reprobado.
- Agregar “Introducción a la Criptografía Moderna”.

##### Agregar Ramo de Núcleo Gestión
- Categoría: Especialidad → Núcleo Gestión.
- Área: Todos.
- Estado: Aprobado.
- Agregar “Gestión Informática”.

Se valida que los 3 ramos están visibles.

### 2.4 Eliminación de Ramo

- Agregar un Ramo.
- Ubicar contenedor y su botón “×”.
- Aceptar confirmación.
- Validar que el ramo ya no aparece.

### 3. Visualización de Detalles de un Ramo

#### Archivo: `malla.spec.ts`

#### Flujos probados:

Al hacer clic en un ramo, se muestran sus detalles:

- **Nombre**
- **Código**
- **Créditos**
- **Porcentaje de Aprobación**
- **Descripción**

Ejemplo verificado para “Herramientas Computacionales”:

- Código: `CC1000`
- Créditos: `3`
- % de Aprobación: `80%`
- Descripción: *"Introducción a herramientas computacionales para ingeniería"*

## Resumen General

| Módulo | Flujos Verificados |
|--------|---------------------|
| **Autenticación** | Login inválido, registro, logout, login exitoso |
| **Mallas** | Crear con y sin plan base, validar campos, eliminar |
| **Ramos** | Agregar por distintas categorías, eliminar |
| **Detalles** | Ver información completa de un ramo |

Los tests aseguran que un usuario puede:

- Administrar sus Mallas.
- Agregar y eliminar Ramos.
- Consultar información detallada.
- Usar el sistema de autenticación.


# **Decisiones de Diseño** 

Se implementó un diseño moderno basado en capas semitransparentes con desenfoque (backdrop-blur), simulando paneles de vidrio flotantes sobre un fondo oscuro dinámico.

La aplicación utiliza una paleta de colores oscuros (slate-900) para reducir la fatiga visual, con acentos en colores neón (Cyan, Emerald, Purple) para destacar acciones y estados.

Los ramos utilizan códigos de color automáticos para indicar su estado académico:

 Verde/Emerald: Aprobado.

 Azul: Cursando (con animación de pulso).

 Gris: Pendiente.

 Rojo: Reprobado.

 Uso de Grid y Flexbox de Tailwind para adaptar la visualización de las mallas tipo "Pizarra Kanban" (scroll horizontal) y listas de tarjetas.

# **URL de la aplicación desplegada** 

Para el momento de hacer el deploy, hubo muchos problemas debido al servidor. Así que tuvimos que probarlo en los 4 puertos disponibles para nosotros.

URL de la aplicación desplegada en fullstack.dcc.uchile.cl:7128
URL de la aplicación desplegada en fullstack.dcc.uchile.cl:7141
URL de la aplicación desplegada en fullstack.dcc.uchile.cl:7177
URL de la aplicación desplegada en fullstack.dcc.uchile.cl:7185

En alguno de los 4 estará deployado al momento de presentar este proyecto.

## Variables de entorno requeridas.
Antes de correr nuestra aplicación, se necesita las siguientes variables de entorno para su correcto funcionamiento.

### Para desarrollo
PORT=3001
HOST=localhost
MONGODB_URI=mongodb://localhost:27017/uramos
MONGODB_DBNAME=uramos
JWT_SECRET=miclavesecreta

### Para producción

PORT=7177
HOST=0.0.0.0
MONGODB_URI=mongodb://fulls:fulls@fullstack.dcc.uchile.cl:27019
MONGODB_DBNAME=fullstack
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


**IMPORTANTE**: 
VERSION TAILWINDS se debe instalar con: npm install -D tailwindcss@3.4.17 postcss autoprefixer