# Dirty dockerfile build, uses code from local system instead of pulling from github
# Not usually used unless code needs to be included in build before it is pushed to github

# To build and run the image from this Dockerfile, where x is the name of the worker node's JS file name
# docker build -t mop-api -f ./.Dockerfile .
# docker run -d --rm -p 3000:3000 --name mop-api mop-api
# Alternativly, use docker compose in root to run this service
# 
# Why the server needs to be built first before the image is built:
#   - For performance and image size reasons, the code is built locally first before being sent to the daemon for building the image.
#   - Building can be done on the image but since it will be on top of the image running on the daemon it adds additional performance overhead.
# 
# Why is RUN used and why they are split up:
#   - Use RUN instruction to install packages required by executing commands on top of the current image to create a new layer by committing the results.
#   - The RUN commands are all split them up as different ephemeral intermmediate images to optimize the build process for caching

FROM node:16-alpine

# Install git, as one of our npm dependencies is hosted on a github repo and the alpine image does not have git installed.
RUN apk --no-cache add git

COPY ./appointment-src/ ./appointment-src/

COPY ./pdf/ ./pdf/

# Copy both package.json and package-lock.json in for installing dependencies with "npm ci"
COPY ./api/package*.json ./api/

# Install Node JS dependencies right after dependency file copied in so that changes in the source
# code in the later docker layers at "COPY ./api/src/ ./api/src/" does not invalidate this layer.
WORKDIR /api
RUN npm install

# Reset workdir back to root to copy source files over
WORKDIR /

# Copy source files into current WORKDIR's src/
COPY ./api/src/ ./api/src/

# @todo To remove this eventually to rely on env var instead of keeping the file in the docker image
# Copy the service account key over for now as it is needed for GoogleCalendar utils module
COPY ./api/serviceAccountKey.json ./api/

# Reset workdir back to /api so that the 'entrypoint' command works as that requires current path to be in /api
WORKDIR /api

# Define exposed ports, acting only as documentation. You STILL need to map the ports with -p option with docker run
EXPOSE 3000

# ENTRYPOINT Command ensures this command runs when the container is spun up, and cannot be overwritten with shell arguements like CMD
# Using exec form instead of shell form
ENTRYPOINT ["npm", "run", "start"]
