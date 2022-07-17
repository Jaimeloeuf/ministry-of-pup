#[macro_use]
extern crate rocket;

#[get("/")]
fn index() -> &'static str {
    "'Ministry Of Pup' API Service"
}

// Use this for both Kubernetes Liveness and Readiness probe.
#[get("/health")]
fn health() -> &'static str {
    "Ok"
}

// Get API version, aka the latest git commit's hash injected by the docker build process
#[get("/version")]
fn version() -> &'static str {
    "process.env.version" // @todo
}

// Using a simple custom handler instead of the default one to prevent exposing server built with Rocket to minimize data exposure
#[catch(404)]
fn not_found() -> &'static str {
    "404"
}

#[launch]
fn rocket() -> _ {
    rocket::build()
        .mount("/", routes![index, health, version])
        .register("/", catchers![not_found])
}
