# Hyperapp
This is the original implementation of the booking app made using Hyperapp and Bulma.

A problem with this is that the toolchain using esbuild (the build tool) does not split up asynchronously loaded modules into seperate build output files and instead bundle thems all up. This problem does not exist when using Vite for the Vue3 version as Vite uses esbuild for fast development cycles and switches to rollup for the production build to split up the bundle.