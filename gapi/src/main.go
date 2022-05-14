package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/joho/godotenv"

	"github.com/gin-gonic/gin"

	"cloud.google.com/go/firestore"
	firebase "firebase.google.com/go"
	"google.golang.org/api/iterator"
)

func main() {

	// ===================== Setup recaptcha stuff =====================

	err := godotenv.Load()
	if err != nil {
		// Not a fatal error as env values might be set manually instead of using .env file
		fmt.Printf("Error loading .env file\n")
	}

	// Get recaptcha secret from env var to setup base API URL
	recaptchaSecret := os.Getenv("recaptchaSecret")
	recaptchaURL := fmt.Sprintf(
		"https://www.google.com/recaptcha/api/siteverify?secret=%s",
		recaptchaSecret,
	)

	// Create a single reusable HTTP client for calling the verification API
	httpClient := createHttpClient()

	// ================== Initialize the firebase stuff ==================

	// Create firebase app
	app, err := firebase.NewApp(context.Background(), nil)
	if err != nil {
		log.Fatalf("Error initializing app: %v\n", err)
	}

	// Create firestore client
	client, err := app.Firestore(context.Background())
	if err != nil {
		log.Fatalf("Error initializing firestore client: %v\n", err)
	}

	// ================== Initialize the gin HTTP server ==================

	r := gin.Default()

	// Add a global middleware to handle CORS
	r.Use(func(c *gin.Context) {
		// Set CORS header for all types of requests so that only requests from ministryofpup.com is allowed
		c.Writer.Header().Set("Access-Control-Allow-Origin", "https://ministryofpup.com")

		// For development use when on different localhost ports
		// c.Writer.Header().Set("Access-Control-Allow-Origin", "*")

		// Set headers for CORS preflight request
		if c.Request.Method == "OPTIONS" {
			// Cache the response of this preflight request for 2 hours (Chromium max only 2 hours)
			c.Writer.Header().Set("Access-Control-Max-Age", "7200")
			c.Writer.Header().Set("Access-Control-Allow-Methods", "GET")
			c.Writer.Header().Set("Access-Control-Allow-Headers", "x-recaptcha-token")

			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})

	r.GET("/", func(c *gin.Context) {

		// Verify recaptcha before loading dogs from DB to respond to user
		if verifyRecaptcha(
			httpClient,
			recaptchaURL,
			c.Request.Header["X-Recaptcha-Token"][0],
			c.ClientIP(),
		) {
			c.JSON(200, gin.H{"dogs": getDogs(client)})
		} else {
			c.JSON(403, gin.H{"error": "Bad captcha"})
		}

	})

	// listen and serve on 0.0.0.0:8080 (for windows "localhost:8080")
	r.Run()
}

// Creates a reusable HTTP client with a 10 second timeout for making API calls to verify recaptcha token
func createHttpClient() *http.Client {
	return &http.Client{Timeout: 10 * time.Second}
}

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
func verifyRecaptcha(client *http.Client, recaptchaURL string, token string, remoteip string) bool {

	// Combine base URL for recaptcha with token and client ip to create final string
	var urlString = fmt.Sprintf(
		"%s&response=%s&remoteip=%s",
		recaptchaURL,
		token,
		remoteip,
	)

	req, err := http.NewRequest(http.MethodPost, urlString, nil)
	if err != nil {
		fmt.Println(err)
		return false
	}

	resp, err := client.Do(req)
	if err != nil {
		fmt.Println("Error sending request to recaptcha server")
		return false
	}

	if resp.StatusCode != http.StatusOK {
		fmt.Printf("Bad StatusCode: %d", resp.StatusCode)
		return false
	}

	defer resp.Body.Close()
	responseBody, err := io.ReadAll(resp.Body)
	if err != nil {
		fmt.Printf("err: %s", err)
		return false
	}

	var rbody RecaptchaResponse
	json.Unmarshal(responseBody, &rbody)

	fmt.Printf("Values: %+v", rbody)
	fmt.Println(string(responseBody))

	if !rbody.Success {
		fmt.Printf("Error: %s", rbody.ErrorCodes)
		return false
	}

	// only this action
	if rbody.Action != "loadDogs" {
		fmt.Printf("Invalid action: %s", rbody.Action)
		return false
	}

	// check the score over here
	if rbody.Score < 0.7 {
		fmt.Printf("Score too low: %f", rbody.Score)
		return false
	}

	// Return true if all the tests passed
	return true
}

// Empty map type for dog document data
type keyvalue map[string]interface{}

// Function to read all dogs document to show from firestore
func getDogs(client *firestore.Client) []keyvalue {
	var dogs []keyvalue

	// Create iterator for the query
	iter := client.Collection("dogs").Where("show", "==", true).Documents(context.Background())
	defer iter.Stop()
	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			log.Fatalf("Error reading document: %v\n", err)
		}

		dogs = append(dogs, doc.Data())
	}

	return dogs
}
