# To build and run the image from this Dockerfile
# docker build . --tag mop-gapi
# docker run -d --rm -p 3001:3001 --name mop-gapi mop-gapi
# docker run -d -p 3001:3001 --rm --name mop-gapi gcr.io/ministryofpup-ekd/gapi
# 
# gcr.io/ministryofpup-ekd/gapi
# docker push gcr.io/ministryofpup-ekd/gapi
# 
# Why is RUN used and why they are split up:
#   - Use RUN instruction to install packages required by executing commands on top of the current image to create a new layer by committing the results.
#   - The RUN commands are all split them up as different ephemeral intermmediate images to optimize the build process for caching

FROM golang:alpine AS builder

WORKDIR /app

# Copy over dependency specification files
COPY go.mod ./
COPY go.sum ./

# Install dependencies
RUN go mod download

# Create a src directory to copy go source files into
RUN mkdir src
COPY src/* ./src

# Build the executable, name it 'api' and store it in root dir
RUN go build -o /api ./src/main.go


# Base image to build the actual executable container
FROM golang:alpine AS final
# FROM alpine:latest AS final

# Define exposed ports, acting only as documentation. You STILL need to map the ports with -p option with docker run
EXPOSE 8080

WORKDIR /

# Only copy over the executable only from the 'builder' image
COPY --from=builder /api /

# ENTRYPOINT Command ensures this command runs when the container is spun up, and cannot be overwritten with shell arguements like CMD
# Using exec form instead of shell form
ENTRYPOINT ["./api"]