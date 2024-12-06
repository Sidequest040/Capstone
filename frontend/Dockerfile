# Use Node.js 18 on Alpine Linux
FROM node:18-alpine

# Create app directory and set permissions
RUN mkdir -p /app && chown -R node:node /app

# Set working directory
WORKDIR /app

# Switch to 'node' user
USER node

# Copy package.json and package-lock.json
COPY --chown=node:node package.json package-lock.json ./

# Install dependencies
RUN npm ci --only=production
# Optional: Attempt to fix vulnerabilities
RUN npm audit fix --force || true

# Copy the rest of your frontend code
COPY --chown=node:node . .

# Expose the port your app runs on
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
