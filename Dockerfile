# Use an official Node.js image as the base
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire application directory to the container
COPY . .

# Build the Next.js app
RUN npm run build

# Expose port 3000 to make the app accessible
EXPOSE 3000

# Start the Next.js application
CMD ["npm", "start"]
