# Utiliza una imagen base de Node.js
FROM node:latest as build

# Establece el directorio de trabajo
WORKDIR /app

# Copia el archivo de configuración del proyecto
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia los archivos de la aplicación
COPY . .

# Compila la aplicación Angular
RUN npm run build --prod

# Utiliza una imagen base de Nginx
FROM nginx:latest

# Copia los archivos compilados de Angular al directorio de alojamiento de Nginx
COPY --from=build /app/dist/ /usr/share/nginx/html

# Expone el puerto 8001 para acceder a la aplicación desde el navegador
EXPOSE 8001
