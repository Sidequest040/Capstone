# Use Node.js 18-slim as a base image
FROM node:18-slim

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci --only=production
# Optional: Attempt to fix vulnerabilities
RUN npm audit fix --force || true

# Copy the rest of the backend code
COPY . .

# Expose the port that your app will run on
EXPOSE 3001

# Start the backend
CMD ["npm", "start"]
