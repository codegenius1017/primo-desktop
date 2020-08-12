![primo logo](logo.svg)

![demo](demo.gif)

The desktop app uses NWJS, so it gets built by zipping up all the files in the source directory and placing that file in what is basically an app skeleton. There are two directories because we don't want to include the actual source of the Svelte component (which gets used inside the desktop app).

## TODO*

* remove extreneous modules
* create a watch script
* write basic docs for the extensions API
* Windows/Linux versions

*help appreciated

## App Scripts (/app)

* `npm run build` build and open
* `npm run package` package app

## Source Scripts (/source)

* `npm run dev` build for dev and watch for changes
* `npm run build` build for production

Once you build for production, all you have to do is follow the directions below to package the built app.

### To package binary

1. `cd app`
2. `npm run package`
3. Place `primo.nw` in `Applications/primo.app/Contents/Resources` (i.e. overwrite existing file)
