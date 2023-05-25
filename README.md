# Intel Hex Explorer

## Displays a map of the memory occupied by data blocks described in an Intel Hex formatted file.

Try it out! https://eanders-ms.github.io/mb-hex-explorer/


Tested with
* [micro:bit universal hex](https://tech.microbit.org/software/spec-universal-hex/)
* A few samples of generic [Intel hex](https://en.wikipedia.org/wiki/Intel_HEX)
* [MakeCode for micro:bit's](https://makecode.microbit.org) cached hex files (pulled from browser local storage)


### Developing

* `git clone https://github.com/eanders-ms/mb-hex-explorer`
* `cd mb-hex-explorer`
* `npm install`
* `echo "PUBLIC_URL=http://localhost:3000" > .env.development.local`
* `npm run start`

