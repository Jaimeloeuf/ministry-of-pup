package main

import (
	"context"
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"

	"cloud.google.com/go/firestore"
	firebase "firebase.google.com/go"
	"google.golang.org/api/iterator"
)

func main() {

	// ============ Create HTTP client for verifying recaptcha ============

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
		// todo verify recaptcha

		c.JSON(200, gin.H{"dogs": getDogs(client)})
	})

	// listen and serve on 0.0.0.0:8080 (for windows "localhost:8080")
	r.Run()
}

// Creates a reusable HTTP client with a 10 second timeout for making API calls to verify recaptcha token
func createHttpClient() *http.Client {
	return &http.Client{Timeout: 10 * time.Second}
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
