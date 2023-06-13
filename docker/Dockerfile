FROM node:16.20-alpine as builder

WORKDIR /app
COPY package.json ./
RUN npm install
COPY . ./
RUN npm run build

ARG API_URL='http://localhost:8575'
ENV REACT_APP_API_URL=${API_URL}
RUN echo REACT_APP_API_URL=${API_URL} >> .env

ARG RAPID_API_KEY='a55d5e893fmsh0fd95b8d27c9424p14d7c7jsn6b1449cfae02'
ENV REACT_APP_RapidAPI_Key=${RAPID_API_KEY}
RUN echo REACT_APP_RapidAPI_Key=${RAPID_API_KEY} >> .env

ARG TRANSLATE_URL='https://microsoft-translator-text.p.rapidapi.com/'
ENV REACT_APP_TRANSLATE_URL=${TRANSLATE_URL}
RUN echo REACT_APP_TRANSLATE_URL=${TRANSLATE_URL} >> .env

FROM nginx:1.25
COPY --from=builder /app/build /app/www
COPY --from=builder /app/etc/nginx.conf /etc/nginx/conf.d/default.conf
CMD ["nginx", "-g", "daemon off;"]