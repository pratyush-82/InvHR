# FROM node:16.18.1-alpine
# WORKDIR /frontend
# COPY package*.json ./
# RUN npm i --legacy-peer-deps
# COPY . .
# EXPOSE 3000
# CMD [ "npm", "start" ]

FROM node:alpine as build

WORKDIR /code

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm i --legacy-peer-deps
# COPY all the files from Current Directory into the Container
COPY . .

# Install the Project Dependencies like Express Framework
RUN npm run build

FROM nginx:1.22-alpine as prod

COPY --from=build /code/build /usr/share/nginx/html

# Tell that this image is going to Open a Port 
EXPOSE 80

# Default Command to launch the Application
CMD ["nginx", "-g", "daemon off;"]