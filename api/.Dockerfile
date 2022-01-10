# To build and run the image from this Dockerfile, where x is the name of the worker node's JS file name
# docker build -t mop-api -f ./.Dockerfile .
# docker run -d --rm -p 3000:3000 --name mop-api mop-api
# Alternativly, use docker compose in root to run this service
# 
# Multi-Stage build pattern, to use remote git repo as the build context,
# so that the build is clean and no dirty files from local build context is used,
# and so that the final output image contains only items needed to run the program.
# 
# Why is RUN used and why they are split up:
#   - Use RUN instruction to install packages required by executing commands on top of the current image to create a new layer by committing the results.
#   - The RUN commands are all split them up as different ephemeral intermmediate images to optimize the build process for caching

FROM node:16-alpine AS builder

# Install git, as one of our npm dependencies is hosted on a github repo and the alpine image does not have git installed.
RUN apk --no-cache add git

# Set the working directory of . from here on to be /app
WORKDIR /app

# Use API to get commit version help with docker image layer cache invalidation
# https://stackoverflow.com/questions/36996046/how-to-prevent-dockerfile-caching-git-clone
ADD https://api.github.com/repos/Enkel-Digital/mop-api/git/refs/heads/master ../version.json

# Clone source code from Github for a clean build only if there is a new commit, and only clone the last commit
RUN git clone --depth 1 https://github.com/Enkel-Digital/mop-api .

# @todo Install dependencies with "npm ci" instead?
# Install Node JS dependencies
RUN npm install

# Inject git commit hash as API version into the source file directly
# https://askubuntu.com/questions/76808/how-do-i-use-variables-in-a-sed-command
RUN export version=$(git rev-parse HEAD) && \
    sed -i "s/process.env.version/'$version'/g" ./src/routes/default.js


################################### Final image built from builder image ###################################

FROM node:16-alpine AS final

# Set the working directory of . from here on to be /app
WORKDIR /app

# Only copy over the files needed to run the program from 'builder' image
COPY --from=builder /app/src ./src
COPY --from=builder /app/node_modules ./node_modules

# @todo Tmp copy the service account key over for now as it is needed for GoogleCalendar utils module
COPY serviceAccountKey.json ./

# Define exposed ports, acting only as documentation. You STILL need to map the ports with -p option with docker run
EXPOSE 3000

# ENTRYPOINT Command ensures this command runs when the container is spun up, and cannot be overwritten with shell arguements like CMD
# Using exec form instead of shell form
ENTRYPOINT ["node", "./src/index.js"]
