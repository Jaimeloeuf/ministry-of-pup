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

#[launch]
fn rocket() -> _ {
    rocket::build()
        .mount("/", routes![index, health, version])
}
