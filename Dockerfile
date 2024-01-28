# Use an official Node.js runtime as a base image with Node.js version 16.4
FROM node:16.4

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Expose the port your app runs on
EXPOSE 31337

# Command to run your application in development mode
CMD ["npm", "run", "start:dev"]
