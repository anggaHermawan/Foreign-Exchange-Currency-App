FROM node:8.11.1-alpine

#Set up environment
ENV NODE_ENV production
ENV HOST 0.0.0.0
ENV NUXT_CONFIG_FILE nuxt.config.js

RUN mkdir -p /app
COPY . /app
WORKDIR /app

# Expose the app port
EXPOSE 3000

#install depedency
RUN yarn install

#start application
CMD ["sh", "-c", "npm run build -- --config-file $NUXT_CONFIG_FILE && npm start"]
