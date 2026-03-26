FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Ensure data and uploads directories exist
RUN mkdir -p data uploads

EXPOSE 5000

# Start server
CMD ["npm", "start"]
