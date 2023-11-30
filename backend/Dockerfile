FROM node:14-alpine

# Set working directory
WORKDIR /backend

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm i

# Copy the rest of the app files
COPY . .

# Expose port 5107 for the backend
EXPOSE 5107

# Start the Node.js server
CMD [ "node", "server.js" ]