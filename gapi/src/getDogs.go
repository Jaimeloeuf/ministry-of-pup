package main

import (
	"context"
	"log"

	"cloud.google.com/go/firestore"
	"google.golang.org/api/iterator"
)

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
