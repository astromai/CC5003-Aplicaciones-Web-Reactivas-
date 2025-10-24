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
1) cd backend
2) npm install, para descargar las librerías necesarias para el proyecto.
2) npm run dev

Para el frontend deben hacer lo siguiente (en otra terminal).
1) cd frontend 
2) npm install, para descargar las librerías necesarias para el proyecto.
2) npm run dev

Asi podemos conectar adecuadamente el backend con frontend.
