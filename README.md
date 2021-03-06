# Molgenis Theme

This is the base SCSS theme for Molgenis. All Molgenis themes
should inherit from this theme. Checkout **themes/molgenis-blue**
for an example.

This repo also provides a Dockerized Nginx proxy that makes it easier
to develop styling against remote Molgenis sites, as well as
against a localized Molgenis stack.

Last, but not least, this repo also provides a Molgenis theme service,
that can be used to generate themes on the fly, based on just some
variables.

## Prerequisites

For the Proxy & Molgenis services:

* [Docker](https://docs.docker.com/docker-for-mac/install/)
* [Docker-compose](https://docs.docker.com/compose/install/)

For theme development:

* [Node.js](https://nodejs.org/dist/v14.9.0/node-v14.9.0.pkg)
* [Yarn](https://classic.yarnpkg.com/en/docs/install/#mac-stable)
* [Visual Studio Code](https://code.visualstudio.com/docs/setup/mac)

## Basic Usage

```bash
git clone git@github.com:molgenis/molgenis-theme.git
cd molgenis-theme
yarn
# Set the default config file
cp docker/.env.default .env
# Build the selected theme (MG_THEME in .env)
yarn build
```

Congratulations! You just generated the default Molgenis theme.

> The CSS files were written to **/theme/molgenis-blue/css**

Build all themes at once, in case the theme directory contains more than one theme:

```bash
yarn build-all
```

> All project directories have their CSS files generated in
their accompanying **theme/theme-dir/css** directory

## Configuration

The configuration for Docker and the SCSS tool are read from **docker/.env**.
It recognizes the following options:

```bash
# No need to change; used to make docker containers unique per project
COMPOSE_PROJECT_NAME=mg_projects
```

```bash
# Determines which services to start; e.g. only the Nginx proxy
COMPOSE_FILE=dc-proxy.yml
# Nginx proxy + molgenis services; use this you need to test changes
# in Molgenis itself from IntelliJ
COMPOSE_FILE=dc-proxy.yml:dc-mg-services.yml
# The whole Molgenis stack; useful to test a deployment locally
COMPOSE_FILE=dc-proxy.yml:dc-mg-services.yml:dc-mg.yml
```

```bash
# URL of running Molgenis instance; use an external Molgenis
# URL when only using the Nginx proxy.
MG_HOST=https://master.dev.molgenis.org
# Using the whole Molgenis stack, you need to use the
# Docker service name here if you want to proxy the
# local instance.
MG_HOST=http://molgenis:8080
```

```bash
# Which theme to watch and/or build from the /projects dir
MG_THEME=default
# In case you want to use molgenis-theme in a third-party repo, with its own
# main directory for themes; e.g. molgenis-projects/projects
MG_THEME_DIR=theme
# The proxied Molgenis CSS file to watch for changes
MG_WATCHFILE=bootstrap-molgenis-blue.min.css
```

```bash
# Static fileserver root directory
MG_PUBLISH_ROOT=/home/molgenis/molgenis/css
# Remote SSH host
MG_PUBLISH_HOST=static.molgenis.org
# Path to your private SSH key
MG_PUBLISH_KEY=/home/user/.ssh/id_rsa
# SSH Daemon port
MG_PUBLISH_PORT=50666
# SSH user to login with
MG_PUBLISH_USER=molgenis
# CSS Versioning directory; use minor semver releases only?
MG_PUBLISH_VERSION=4.5
```

## Structure

Both Bootstrap 3 & 4 CSS is being used in Molgenis, while it transitions to Bootstrap 4.
Make sure you check the current Molgenis page source to verify that the asserted theme
is being used.

* **theme-3.scss** is the root source-file for the generated Molgenis Bootstrap 3 theme
* **theme-4.scss** is the root source-file for the generated Molgenis Bootstrap 4 theme
* Theme variables go in **./theme/myproject/_variables.scss**
* Theme-agnostic fixes should be made in the main theme at **./scss/molgenis**
* Molgenis theme variables start with the **mg-** prefix
* Molgenis theme variables are in **./scss/molgenis/_variables.scss**
* Do not use Bootstrap variables in themes directly if you don't need to;
  use the **mg-** prefixed Molgenis theme variables instead
* Bootstrap-3 variables are in **./node_modules/bootstrap-sass/assets/stylesheets/bootstrap/_variables.scss**
* Bootstrap-4 variables are in **./node_modules/bootstrap-scss/_variables.scss**
* Bootstrap-3 variables are customized in **./scss/molgenis/theme-3/_variables.scss**
* Bootstrap-4 variables are customized in **./scss/molgenis/theme-4/_variables.scss**
* Small theme-agnostic Bootstrap-agnostic selectors are in **scss/molgenis/_custom.scss**
* Extensive theme-agnostic Bootstrap-agnostic selectors are in **scss/molgenis/elements/_some-page-element.scss**

* Small theme-agnostic Bootstrap-3 specific selectors are in **scss/molgenis/theme-3/_custom.scss**
* Extensive theme-agnostic Bootstrap-3 specific selectors are in **scss/molgenis/theme-3/elements/_some-page-element.scss**
* Theme-agnostic Bootstrap-4 specific selectors are in **scss/molgenis/theme-4/_custom.scss**
* Extensive theme-agnostic Bootstrap-4 specific selectors are in **scss/molgenis/theme-4/elements/_some-page-element.scss**

The setup of the themes is such, that the theme in **scss/molgenis** should
provide sane defaults for *all* themes, and that all themes inherit their main
settings from this base set of SCSS files. To keep everything maintainable,
it is __essential__ that each theme has a minimal amount of custom styling.

So, when trying to fit in a new theme, please try to maintain the following workflow order:

1. Change Molgenis variables in the myproject theme
2. Update Bootstrap variables in scss/molgenis
3. Refactor Molgenis variables in scss/molgenis if necessary
4. Add selectors in scss/molgenis (_custom) using Molgenis variables
5. Add Bootstrap variables to custom theme (theme-3.scss/theme-4.scss)
6. Add selectors to custom theme (theme-3.scss/theme-4.scss)

## Development

### Start A New Theme

* Just copy an existing theme to a new directory:

  ```bash
  cp -R theme/molgenis-blue theme/molgenis-red
  ```

* Update the config to use the new theme

  ```bash
  # vim docker/.env
  MG_THEME=molgenis-red
  ```

* Build the theme

  ```bash
  yarn build
  ```

### Working with the livereload proxy

In this example we use a remote Molgenis host, instead of the local Molgenis setup.

* Setup the proxy config in the **.env** file:

  ```bash
  # The proxied host
  MG_HOST=https://master.dev.molgenis.org
  # The theme that is being applied on the proxied host.
  MG_THEME=molgenis-red
  # The current theme that is being used on the proxy - in this example - master.dev.molgenis.org
  # Check view-source:https://master.dev.molgenis.org/ for the current theme in the <head> section
  MG_WATCHFILE=bootstrap-molgenis-blue.min.css
  ```

* Start the Nginx proxy and the dev tool

```bash
docker-compose up
# From another terminal tab
yarn dev
```

* Visit http://localhost; you should see the proxied version of https://master.molgenis.org
  using the *molgenis-red* theme

* Install the Chrome [livereload extension](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei)
  to autoreload on file-change

* Switch livereload on; try changing **$mg-color-primary** in **molgenis-red/_variables.scss**

  > The theme on the webpage should automatically update on save.

## Publishing

This is a Proof-of-Concept workflow for theme updates, using a static fileserver.
Hosting our own static fileserver has several advantages, compared to a service like Unpkg.

* Lower latency
* Flexibility; just host a directory; no API to deal with
* Easier to provide fallback methods, compared to dealing with service-outage of npm/unpkg
* Less pricacy issues

Our CDN requires SSH access in this example:

> ssh2 has a bug in Node 14; use Node < 14 for now

The workflow for publishing changes to themes is:

```bash
# Publish the selected theme
yarn publish
# Publish all themes
yarn publish-all
```

Files are served at *https://static.molgenis.org/<molgenis_version>*, so
the default Bootstrap-4 stylesheet would be served from *https://static.molgenis.org/4.5/default/mg-default-4.css*

Some changes to Molgenis are required:

* Use theme names instead of theme locations -
  Instead of Molgenis serving its own outdated stylesheets, we should only use
  the theme name in the freemarker templates:

  ```html
  <link rel="stylesheet" href="https://static.molgenis.org/${app_settings.molgenisVersionMinor}/mg-${app_settings.bootstrapTheme?html}-4.css" type="text/css">
  ```

* Remove any other CSS reference from Freemarker templates - the theme file
  should handle all styling for consistency's sake

  > There are places where the theme file is not included(login), where apps
  include their own stylesheets and where vanilla Bootstrap is loaded along
  with the themed version

## Dynamic Theme Service

This is a Proof-of-Concept theme service. Instead of requesting CSS files,
a Molgenis instance may just post a set of variables to this service. The
accompanying theme is then returned accordingly. Usage:

* Start the SCSS service

  ```bash
  ./mg-theme.js serve
  ```

* Post a request body to http://localhost:8080/theme with a tool like Postman

  ```json
  {
    "name": "molgenis-red",
    "version": 4,
    "mg-color-primary": "#005c8f",
    "mg-color-primary-light": "#0069a4"
  }
  ```

> Depending on the version (3 or 4), either the generated Bootstrap 3 or Bootstrap 4
  version is returned. Post validation is still a bit flunky, so its easy to break.