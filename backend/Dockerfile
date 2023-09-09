# Use an official Node runtime as base image
FROM node:14

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install project dependencies
RUN npm install

# Bundle app source
COPY . .

# Expose port
EXPOSE 3000

# Run app.js when the container launches
CMD ["node", "App.js"]
