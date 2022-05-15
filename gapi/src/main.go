package main

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"

	"github.com/gin-gonic/gin"

	firebase "firebase.google.com/go"
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

	// Set to release mode explicitly
	// gin.SetMode(gin.ReleaseMode)
	// Else set using an environment variable
	// GIN_MODE=release

	// Change to remove logger?
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
		// Reject requests if there isn't exactly 1 recaptcha token in the header
		if len(c.Request.Header["X-Recaptcha-Token"]) != 1 {
			c.JSON(403, gin.H{"error": "Invalid num of captcha token in header"})
			return
		}

		// Verify recaptcha before loading dogs from DB to respond to user
		if success, err := verifyRecaptcha(
			httpClient,
			recaptchaURL,
			c.Request.Header["X-Recaptcha-Token"][0],
			c.ClientIP(),
		); success && err == nil {
			c.JSON(200, gin.H{"dogs": getDogs(client)})
		} else {
			c.JSON(403, gin.H{"error": "Bad captcha", "errorMsg": err})
		}

	})

	// listen and serve on 0.0.0.0:8080 (for windows "localhost:8080")
	r.Run()
}
