###################
# BUILD FOR PRODUCTION
###################

FROM node:18-alpine3.17 as builder

ARG NODE_ENV
ARG REACT_APP_BASE_URL

ENV NODE_ENV=$NODE_ENV
ENV REACT_APP_BASE_URL=$REACT_APP_BASE_URL

WORKDIR /app

COPY . .

RUN npm install
RUN npm run build

###################
# PRODUCTION
###################

FROM nginx:alpine as production

COPY --from=builder /app/build /usr/share/nginx/html
COPY ./Docker/nginx/nginx.template.conf /etc/nginx/conf.d/default.conf

CMD [ "nginx", "-g", "daemon off;" ]

EXPOSE 80
