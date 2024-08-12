# GridXXX-App

Template app that bootstraps the creation of GridSuite apps.
This template setup the authentication mechanism and provides a configured empty application.

To customize this repository for an app, search and replace the string `XXX` with the name of the app. For example, GridXXX -> GridFoo, gridXXX-app -> gridfoo-app.

Create a new view in study-server and replace `yyy` with the new token in rest api `src/services/index.ts`.

## Typescript config

Files tsconfig.json and src/react-app-env.d.ts both results from create-react-app typescript template (version 5).
Some property values have been changed to meet the project needs (ex: target, baseUrl, ...).

#### License Headers and dependencies checking

To check dependencies license compatibility with this project one locally, please run the following command :

```
npm run licenses-check
```

Notes :
* Check [license-checker-config.json](license-checker-config.json) for license white list and exclusion.
If you need to update this list, please inform organization's owners.
* Excluded dependencies :
    * esprima@1.2.2 : old version of a dependency which doesn't have a recognized license identifier on https://spdx.org/licenses/ (BSD)
    * jackspeak@2.3.6 and path-scurry@1.10.2 : dependencies to be removed once Vite migration done
