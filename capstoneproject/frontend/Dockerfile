# Use an official Node.js runtime as a parent image
FROM node:16

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Ensure correct permissions for the node_modules/.cache folder
RUN mkdir -p /usr/src/app/node_modules/.cache && chmod -R 777 /usr/src/app/node_modules/.cache

# Copy the rest of the application code
COPY . .

# Expose the port that the frontend will run on
EXPOSE 3000

# Start the React app
CMD ["npm", "start"]
