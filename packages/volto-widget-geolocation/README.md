# @eeacms/volto-widget-geolocation

[![Releases](https://img.shields.io/github/v/release/eea/volto-widget-geolocation)](https://github.com/eea/volto-widget-geolocation/releases)
[![Pipeline](https://ci.eionet.europa.eu/buildStatus/icon?job=volto-addons%2Fvolto-widget-geolocation%2Fmaster&subject=master)](https://ci.eionet.europa.eu/view/Github/job/volto-addons/job/volto-widget-geolocation/job/master/display/redirect)
[![Coverage](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-widget-geolocation&metric=coverage)](https://sonarqube.eea.europa.eu/dashboard?id=volto-widget-geolocation)

[Volto](https://github.com/plone/volto) Widget: Geolocation with [GeoNames](https://www.geonames.org/) integration

## Features

### Geolocation Widget with [GeoNames](https://www.geonames.org/) integration

![Widget geolocation](https://raw.githubusercontent.com/eea/volto-widget-geolocation/master/docs/volto-widget-geolocation.gif)

## Upgrade

### Upgrading to 9.x

> This version requires `Volto 18` or `Volto 19` and Node.js 22.

The widget keeps the same id, the same schema fields and the same stored coordinates, so
geolocation data saved with 8.x keeps rendering unchanged. The release adds Volto 19 support and
moves the repository to the Volto 19 layout, where the published package lives in
`packages/volto-widget-geolocation`. The only source edit since 8.0.1 is a comment on a Redux
selector, which leaves the behaviour untouched.

#### Breaking changes

- **Node.js 22 or newer is required** (`engines.node >= 22`), 8.x declared no engine.
- **React 18 is required.** The package declares `react` and `react-dom` as `^18.2.0` peers, 8.x
  declared no peers.
- **The package no longer ships the repository tooling.** The Cypress specs and the Jest setup are
  gone and the unit tests moved to Vitest next to the add-on, so nothing a site imports was
  removed.

## Requirements

### Backend

- [Plone](https://plone.org/download)
- [plone.restapi](https://pypi.org/project/plone.restapi/)

### Frontend

- Node.js: `>=22.0.0`

## Installation

1. Make sure you have a [Plone backend](https://plone.org/download) up-and-running at http://localhost:8080/Plone

   ```Bash
   docker compose up backend
   ```

1. Start Volto frontend

* If you already have a volto project, just update `package.json`:

   ```JSON
   "dependencies": {
       "@eeacms/volto-widget-geolocation": "*"
   }
   ```

   and `volto.config.js`:

   ```JavaScript
   const addons = ['@eeacms/volto-widget-geolocation'];
   ```

* If not, create one with Cookieplone, as recommended by the official Plone documentation for Volto 18+:

   ```
   uvx cookieplone project
   cd project-title
   ```

1. Install or update dependencies, then start the project:

   ```
   make install
   ```

   For a Cookieplone project, start the backend and frontend in separate terminals:

   ```
   make backend-start
   make frontend-start
   ```

1. Go to http://localhost:3000

1. Happy editing!

## License

See [LICENSE.md](LICENSE.md) for details.

## Funding

[European Environment Agency (EU)](http://eea.europa.eu)
