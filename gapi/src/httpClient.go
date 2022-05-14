package main

import (
	"net/http"
	"time"
)

// Creates a reusable HTTP client with a 10 second timeout for making API calls to verify recaptcha token
func createHttpClient() *http.Client {
	return &http.Client{Timeout: 10 * time.Second}
}
