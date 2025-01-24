# Web Sport Data Overlay

Supports FIT, GPX, TCX files for creating dashboard videos with filterable background colors.
The frame rate of the data depends on the interval between timing points.
The current version is an initial release.

Fully built with JavaScript.

## Runtime Environment Requirements
Browsers that support the WebCodecs API; Chrome 94 and later versions support the WebCodecs API. Microsoft Edge and Google Chrome browsers are compatible. If not supported, please upgrade your browser engine.

This translation maintains a professional tone and accurately conveys the requirements for the runtime environment, specifying the necessary browser support for the WebCodecs API and the action to take if the current browser does not meet the requirements.

## Web Demo Address
https://overlay.data4u.vip/

## Principle

![Example image](./doc/20250124091311.png)

## Web Interface

![Example image](./doc/20250124095403.png)

## Supported Components

![Example image](./doc/20250124102407.png)

## Usage

Copy the ./pages directory to your server directory and access index.html.
The server requires HTTPS support.

## Referenced Support Libraries

- [mp4-muxer](https://github.com/Vanilagy/mp4-muxer)
- [layui](https://github.com/layui/layui)
- [leafer-ui](https://github.com/leaferjs/leafer-ui)
- [jQuery](https://github.com/jquery/jquery)
- [GPXParser.js](https://github.com/Luuka/GPXParser.js)
- [BackFitClientSide](https://github.com/gfmoore/BackFitClientSide)
