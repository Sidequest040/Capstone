# Base image
FROM node:16-alpine

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy rest of the frontend code
COPY . .

# Expose the port React runs on
EXPOSE 3000

# Start the frontend
CMD ["npm", "start"]
