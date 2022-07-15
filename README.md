# Ministry Of Pup (MOP) monorepo
Code base for all the software written for [Ministry Of Pup](https://ministryofpup.com/)


## Subrepos
- [admin](./admin)
    - Admin portal for use on the store's ipad
- [api](./api)
    - Monolithic API backend for all logic
    - Backend build on top of the Firestore database
- [appointment-src](./appointment-src)
    - Shared JS package to map appointment abbrevations to their full names
- [booking](./booking)
    - Booking system's frontend booking app for users to book appointments
- [landing](./landing)
    - Landing page of [Ministry Of Pup](https://ministryofpup.com/)
- [pdf](./pdf)
    - Utility library for handling PDF generations for the API
- [gapi](./gapi)
    - Go API server with super low cold start time for the landing page get dogs API.
- [functions (abandoned)](./.archive/functions)
    - Firebase cloud functions
    - Abandoned as the cold start time for this cloud function is just too high peaking at over 6 seconds!
    - See [gapi](./gapi) instead where cold start time is much lower by using Go lang
- [rapi-getdogs (abandoned)](./.archive/rapi-getdogs)
    - Rust API server with super low cold start time for the landing page get dogs API.
    - Abandoned as interfacing with Firestore DB in Rust is very difficult and does not offer much advantage over the Go API service
    - See [gapi](./gapi) instead


## License, Author and Contributing
This project is developed and made available under the [AGPL v3 License](./LICENSE)  
If you have any questions, contact us via [email](mailto:developer@enkeldigital.com)  
Author: [JJ](https://github.com/Jaimeloeuf)
