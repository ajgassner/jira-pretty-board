# Jira Pretty Board

![Screenshot](https://github.com/ajgassner/jira-pretty-board/blob/master/doc/screenshot.png)

## TODOs
* Dockerize (nginx proxy + server cache + env vars)
* CI builds and push to Docker Hub

## Development / Contributing

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.5.0.

### First of all adapt the Jira config

Edit `proxy.conf.json` and enter your Jira Cloud URL and the authentication credentials.

### Development server

Run `npm start` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use `npm build` for a production build.

### Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
