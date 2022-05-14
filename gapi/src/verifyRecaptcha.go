package main

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

// Type of the JSON response from the recaptcha server
// https://developers.google.com/recaptcha/docs/v3#site_verify_response
type RecaptchaResponse struct {
	Success bool `json:"success,omitempty"`

	// Timestamp of the challenge load (ISO format yyyy-MM-dd'T'HH:mm:ssZZ)
	Challenge_ts string `json:"challenge_ts,omitempty"`

	// Hostname of the site where the reCAPTCHA was solved
	Hostname string `json:"hostname,omitempty"`

	// Score for this request (0.0 - 1.0)
	Score float32 `json:"score,omitempty"`

	// Action name for this request (important to verify)
	Action string `json:"action,omitempty"`

	// Optional errors
	ErrorCodes []string `json:"error-codes,omitempty"`
}

// Function to verify a recaptcha token
func verifyRecaptcha(client *http.Client, recaptchaURL string, token string, remoteip string) (bool, error) {

	// Combine base URL for recaptcha with token and client ip to create final string
	var urlString = fmt.Sprintf(
		"%s&response=%s&remoteip=%s",
		recaptchaURL,
		token,
		remoteip,
	)

	req, err := http.NewRequest(http.MethodPost, urlString, nil)
	if err != nil {
		return false, fmt.Errorf("Error constructing request: %s", err)
	}

	resp, err := client.Do(req)
	if err != nil {
		return false, fmt.Errorf("Error sending request to recaptcha server: %s", err)
	}

	if resp.StatusCode != http.StatusOK {
		return false, fmt.Errorf("Bad StatusCode: %d", resp.StatusCode)
	}

	defer resp.Body.Close()
	responseBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return false, fmt.Errorf("Error reading response JSON: %s", err)
	}

	var rbody RecaptchaResponse
	json.Unmarshal(responseBody, &rbody)

	if !rbody.Success {
		return false, fmt.Errorf("Error: %s", rbody.ErrorCodes)
	}

	// only this action
	if rbody.Action != "loadDogs" {
		return false, fmt.Errorf("Invalid action: %s", rbody.Action)
	}

	// check the score over here
	if rbody.Score < 0.7 {
		return false, fmt.Errorf("Score too low: %f", rbody.Score)
	}

	// Return true if all the tests passed
	return true, nil
}
