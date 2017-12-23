# Jira Pretty Board

![Screenshot](https://github.com/ajgassner/jira-pretty-board/blob/master/doc/screenshot.png)

## What is it?

I created this project to teach myself Angular X and Bootstrap 4. The board can be used as an alternative to the built-in Jira board. In my opinion it's a bit clearer than the standard solution. I have tested the functionality with the Jira Cloud API only (https://developer.atlassian.com/cloud/jira/software/rest/). I'm not sure if the board currently works with the on-premise Jira Server edition.

It's not necessary to enable CORS in Jira, the board gets served over a web-server with a built-in HTTP reverse-proxy.

## Development / Contributing

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.5.0. Please install NodeJS 8.x on your system and run `npm install` in the project root directory. Install Angular CLI too: `npm install -g @angular/cli`

### Adapt the Jira config

Edit `proxy.conf.json` and enter your Jira Cloud URL and the authentication credentials.

### Development server

Run `npm start` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use `npm run-script build` for a production build.

### Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
