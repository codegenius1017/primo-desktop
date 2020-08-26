<p align="center">
  <img src="logo.svg" alt="primo logo"/>
</p>

![demo](demo.gif)

# primo is a visual, integrated, delightful code editor and content management system

The desktop app uses NWJS, so it gets built by zipping up all the files in the source directory and placing that file in what is basically an app skeleton. There are two directories because we don't want to include the actual source of the Svelte component (which gets used inside the desktop app).

## TODO*

* remove extreneous modules
* write basic docs for the extensions API
* Windows/Linux versions

*help appreciated

## App Scripts

* `npm run dev` build for dev and watch for changes
* `npm run build` build for production

### To package binary

Place `app.nw` in `primo.app/Contents/Resources` (i.e. overwrite existing file)
