# volto-widget-geolocation
[![Releases](https://img.shields.io/github/v/release/eea/volto-widget-geolocation)](https://github.com/eea/volto-widget-geolocation/releases)

[![Pipeline](https://ci.eionet.europa.eu/buildStatus/icon?job=volto-addons%2Fvolto-widget-geolocation%2Fmaster&subject=master)](https://ci.eionet.europa.eu/view/Github/job/volto-addons/job/volto-widget-geolocation/job/master/display/redirect)
[![Lines of Code](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-widget-geolocation-master&metric=ncloc)](https://sonarqube.eea.europa.eu/dashboard?id=volto-widget-geolocation-master)
[![Coverage](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-widget-geolocation-master&metric=coverage)](https://sonarqube.eea.europa.eu/dashboard?id=volto-widget-geolocation-master)
[![Bugs](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-widget-geolocation-master&metric=bugs)](https://sonarqube.eea.europa.eu/dashboard?id=volto-widget-geolocation-master)
[![Duplicated Lines (%)](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-widget-geolocation-master&metric=duplicated_lines_density)](https://sonarqube.eea.europa.eu/dashboard?id=volto-widget-geolocation-master)

[![Pipeline](https://ci.eionet.europa.eu/buildStatus/icon?job=volto-addons%2Fvolto-widget-geolocation%2Fdevelop&subject=develop)](https://ci.eionet.europa.eu/view/Github/job/volto-addons/job/volto-widget-geolocation/job/develop/display/redirect)
[![Lines of Code](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-widget-geolocation-develop&metric=ncloc)](https://sonarqube.eea.europa.eu/dashboard?id=volto-widget-geolocation-develop)
[![Coverage](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-widget-geolocation-develop&metric=coverage)](https://sonarqube.eea.europa.eu/dashboard?id=volto-widget-geolocation-develop)
[![Bugs](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-widget-geolocation-develop&metric=bugs)](https://sonarqube.eea.europa.eu/dashboard?id=volto-widget-geolocation-develop)
[![Duplicated Lines (%)](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-widget-geolocation-develop&metric=duplicated_lines_density)](https://sonarqube.eea.europa.eu/dashboard?id=volto-widget-geolocation-develop)


[Volto](https://github.com/plone/volto) Widget: Geolocation with [GeoNames](https://www.geonames.org/) integration

## Features

### Geolocation Widget with [GeoNames](https://www.geonames.org/) integration

![Widget geolocation](https://github.com/eea/volto-widget-geolocation/raw/docs/docs/volto-widget-geolocation.gif)


## Getting started

1. Create new volto project if you don't already have one:

   ```
   $ npm install -g yo @plone/generator-volto
   $ yo @plone/volto my-volto-project --addon @eeacms/volto-widget-geolocation

   $ cd my-volto-project
   $ yarn add -W @eeacms/volto-widget-geolocation
   ```

1. If you already have a volto project, just update `package.json`:

   ```JSON
   "addons": [
       "@eeacms/volto-widget-geolocation"
   ],

   "dependencies": {
       "@eeacms/volto-widget-geolocation": "^2.0.0"
   }
   ```

1. Install new add-ons and restart Volto:

   ```
   $ yarn
   $ yarn start
   ```

1. Go to http://localhost:3000

1. Happy editing!


## How to contribute

See [DEVELOP.md](https://github.com/eea/volto-widget-geolocation/blob/master/DEVELOP.md2).

## Copyright and license

The Initial Owner of the Original Code is European Environment Agency (EEA).
All Rights Reserved.

See [LICENSE.md](https://github.com/eea/volto-widget-geolocation/blob/master/LICENSE.md) for details.

## Funding

[European Environment Agency (EU)](http://eea.europa.eu)
