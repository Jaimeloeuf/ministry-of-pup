package main

import (
	"context"
	"log"

	"github.com/gin-gonic/gin"

	"cloud.google.com/go/firestore"
	firebase "firebase.google.com/go"
	"google.golang.org/api/iterator"
)

func main() {
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
	r.GET("/", func(c *gin.Context) {
		// todo verify recaptcha

		c.JSON(200, gin.H{"dogs": getDogs(client)})
	})

	// listen and serve on 0.0.0.0:8080 (for windows "localhost:8080")
	r.Run()
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