# Jira Pretty Board [![Build Status](https://travis-ci.org/ajgassner/jira-pretty-board.svg?branch=master)](https://travis-ci.org/ajgassner/jira-pretty-board)

## What is it?

I created this project to teach myself Angular X and Bootstrap 4. The board can be used as an alternative to the built-in Jira board. In my opinion it's a bit clearer than the standard solution. I have tested the functionality with the Jira Cloud API only (https://developer.atlassian.com/cloud/jira/software/rest/). I'm not sure if the board currently works with the on-premise Jira Server edition.

It's not necessary to enable CORS in Jira, the board gets served over a web-server with a built-in HTTP reverse-proxy.

## Usage

### The simple way

There is a Docker image (https://hub.docker.com/r/ajgassner/jira-pretty-board/) for the board, simply run following command to get up and running:

```
docker run -d -p 80:80 \
-e JIRA_HOST="https://yourJiraInstance.atlassian.net" \
-e JIRA_USER="yourJiraUsernameOrEmail" \
-e JIRA_PW="yourJiraPassword" \
-e CACHE_MINUTES=1 \
--name jira-pretty-board \
ajgassner/jira-pretty-board:latest
```

The environment variable `CACHE_MINUTES` defines the time to live (TTL) for the server HTTP cache. Please also notice that's good for security reasons to restrict the API user to read-only access.

Now just enter `http://localhost` in you browser and you should be done.

### The other way

See below how to make a production build of the board. You will get a folder with all required HTML/JS/CSS files to run the app. Important: You will need to setup a HTTP reverse proxy manually in order to make the app happy.

## Development / Contributing

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.5.0. Please install NodeJS 8.x on your system and run `npm install` in the project root directory. Install Angular CLI too: `npm install -g @angular/cli`

### Adapt the Jira config

Edit `proxy.conf.json` and enter your Jira Cloud URL and the authentication credentials.

### Development server

Run `npm start` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use `npm run build` for a production build.

### Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
