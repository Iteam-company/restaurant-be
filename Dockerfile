# Use the Node.js image as the base
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project
COPY . .

# Build the NestJS project
RUN npm run build

# Expose the application port
EXPOSE 3000

# Run the application
CMD ["npm", "run", "start:prod"]