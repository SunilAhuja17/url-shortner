# Use Node.js base image
FROM node:23.7.0

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and yarn.lock first (for efficient caching)
COPY package.json yarn.lock ./

# Install dependencies with frozen lockfile
RUN yarn install --frozen-lockfile

# Copy the rest of the application files
COPY . .

# Copy the .env file (ensure this exists in your project root)
COPY .env .env

# Generate Prisma Client
RUN yarn prisma generate

# Build the NestJS application
RUN yarn build

# Expose the application port
EXPOSE 3000

# Command to start the application in production mode
CMD ["node", "dist/main.js"]
