FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npm run build
COPY .next .
EXPOSE 3000
CMD ["npm", "start"]