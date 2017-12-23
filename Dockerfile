FROM nginx:1.13.7

RUN rm /etc/nginx/conf.d/default.conf
ADD nginx.conf.tpl /

ADD dist /usr/share/nginx/html

RUN mkdir -p /var/nginx-cache/board

CMD /bin/bash -c "export BASE64_AUTH=`echo -n ${JIRA_USER}:${JIRA_PW} | base64` && envsubst < /nginx.conf.tpl > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'" 

