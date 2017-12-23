FROM nginx:1.13.7

RUN rm /etc/nginx/conf.d/default.conf
ADD nginx.conf /etc/nginx/conf.d/default.conf

ADD dist /usr/share/nginx/html
