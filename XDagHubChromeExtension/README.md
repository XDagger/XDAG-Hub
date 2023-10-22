# XDag Hub

This is a browser extension for XDAG blockchain, aimed at providing APIs for ecosystem application development. It also aims to collect and categorize ecosystem applications related to XDAG, and promote them to XDAG enthusiasts through the community. In short, this is the Hub of XDAG's ecosystem applications.

## Set Up and build for develop mode

**Requirements**: Node 18.15.0 or later.
```
pnpm upgrade
pnpm install
pnpm run dev
```
The output directory is the same [dist/](./dist/), all build artifacts will go there

## Build once in prod mode

```
 pnpm run prod
```

Same as above the output is [dist/](./dist/).

## Install the extension to Chrome

After building the app, the extension needs to be installed to Chrome. Follow the steps to [load an unpacked extension](https://developer.chrome.com/docs/extensions/mv3/getstarted/#unpacked) and install the app from the [dist/](./dist/) directory.
