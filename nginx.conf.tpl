proxy_cache_path /var/nginx-cache/board levels=1:2 keys_zone=board:2m max_size=256m inactive=12h use_temp_path=off;

server {
	listen 80 default_server;

	location / {
		root /usr/share/nginx/html;
		index index.html;
	}

	location /jira-api/ {
		proxy_cache board;
		proxy_cache_valid ${CACHE_MINUTES}m;
		proxy_ignore_headers X-Accel-Expires Expires Cache-Control Set-Cookie;  
		proxy_pass ${JIRA_HOST}/rest/;
		proxy_set_header Authorization "Basic ${BASE64_AUTH}";
	}
}
