# Use an official Node runtime as a parent image
FROM node:14

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install any needed packages
RUN npm install

# Bundle app source inside Docker image
COPY . .
RUN npm run build

# Make port available to the world outside this container
EXPOSE 8000

# Define the command to run your app
CMD npm run start:prod
