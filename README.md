# ESP32 Tour Tracker

> [screenshots / overview](https://github.com/OnlyPain-ctrl/esp32-tour-tracker/blob/main/docs/Esp32-Tour-Tracker_presentation_compressed.pdf)

The written thesis and Presentation can be found at [/docs](https://github.com/OnlyPain-ctrl/esp32-tour-tracker/tree/main/docs). (German)

## Function

This server allows a user to register / login, create an API-Key and connect a Tracker via this Key.<br/>
Data can then be visualized via charts and a map.

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
Didn't really like Auth0, so I would probably use SuperTokens.

### Frontend

Since most of the data rendered on the frontend already comes from the API,<br/>
I would either use  Svelte or React.

- Components are mostly easier to work with than template literals
- easier Reactive Content

## Closing Word

Overall, I'm pretty happy how this project turned out, even tough the code is a bit rough around the edge.
