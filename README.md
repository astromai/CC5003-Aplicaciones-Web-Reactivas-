# URamos

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