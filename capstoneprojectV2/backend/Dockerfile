# Base image
FROM node:16-slim

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy rest of the backend code
COPY . .

# Expose the port that your app will run on
EXPOSE 3001

# Start the backend
CMD ["npm", "start"]
