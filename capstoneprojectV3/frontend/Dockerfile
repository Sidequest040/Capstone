# Use Node.js 16 on Alpine Linux
FROM node:16-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies as root
RUN npm install

# Copy the rest of your frontend code
COPY . .

# Change ownership of the /app directory to the 'node' user
RUN chown -R node:node /app

# Switch to 'node' user
USER node

# Expose the port your app runs on
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
