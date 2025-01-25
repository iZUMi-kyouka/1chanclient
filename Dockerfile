# Use a Node.js base image
FROM node:18-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json .env ./

# Install dependencies
RUN npm install

# Copy the entire codebase, including the /src folder
COPY . .

# Set the base directory for Next.js (if required)
ENV NEXT_PUBLIC_BASE_PATH=/src

# Build the Next.js application
RUN npm run build

# Use a lightweight image for production
FROM node:18-alpine AS runner

# Set environment variables
ENV NODE_ENV=production

# Set the working directory
WORKDIR /app

# Copy the production build and dependencies from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/src ./src

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]