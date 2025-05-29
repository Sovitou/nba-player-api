# Use official Node.js image with Alpine for minimal size
FROM node:22.14.0-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install all dependencies (include dev if needed)
RUN npm install 

# Copy Prisma files
COPY prisma ./prisma

# Copy rest of the app
COPY . .

# Generate Prisma client
RUN npx prisma generate

# If using SQLite and you have pre-filled DB, copy it
# Otherwise, optionally run migrations instead of copy
# COPY prisma/database.sqlite ./prisma/database.sqlite

# Expose application port
EXPOSE 5000

# Start the app
CMD ["npm", "run", "dev"]
