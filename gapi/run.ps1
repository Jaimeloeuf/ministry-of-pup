docker build . --tag gcr.io/ministryofpup-ekd/gapi;
docker run -p 3001:3001 --rm --name mop-gapi gcr.io/ministryofpup-ekd/gapi;