# ESP32 Tour Tracker

The written thesis and presentation can be found at [/docs](https://github.com/OnlyPain-ctrl/esp32-tour-tracker/tree/main/docs). (German)

## Function

This server allows a user to register / login, create an API-Key and connect a Tracker via this Key.<br/>
Data can then be viewed as charts and on a map.

## Technology's used

### Frontend

- MDBootstrap
- Chart.js
- Google Maps
- SweetAlert2

### Backend

- Docker + Compose
- Prisma & mySQL
- Node.js
- Auth0
- Caddy 2
- Gulp

## Things I would do different

### Backend

Would definitely switch out JavaScript for Typescript.<br/>
Didn't really like Auth0, so I would probably use SuperTokens or Passportjs.

### Frontend

Since most of the data rendered on the frontend already comes from the API,<br/>
I would either use  Svelte or React.

- Components are mostly easier to work with than template literals
- easier Reactive Content

I would also switch out Gulp for either Webpack or Vite / Rollup.

## Closing Word

Overall, I'm pretty happy how this project turned out, even tough the code is a bit rough around the edge.

## Screenshots

![routes](/docs/img/1.jpg)
![api keys](/docs/img/2.jpg)
![notifications](/docs/img/3.jpg)
![nav / upload](/docs/img/4.jpg)
![map](/docs/img/5.jpg)
![charts](/docs/img/6.jpg)
![server](/docs/img/7.jpg)
