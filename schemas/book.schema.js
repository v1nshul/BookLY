module.exports = {
  "$schema": "http://json-schema.org/draft-04/schema#",
  "id": "/book",
  "title": "A book",
  "description": "Represents a book in the book API",
  "type": "object",
  "properties": {
    "title": {
      "description": "The title of the book",
      "type": "string"
    },
    "description": {
      "description": "A detailed description of the book",
      "type": "string"
    },
    "summary": {
      "description": "Optional short summary of the book",
      "type": "string"
    },
    "genre": {
      "description": "The genre of the book",
      "type": "string"
    },
    "coverImageURL": {
      "description": "URL for the book's cover image",
      "type": "string",
      "format": "uri"
    },
    "isPublished": {
      "description": "Is the book published or not",
      "type": "boolean"
    },
    "author": {
      "description": "the book's author",
      "type": "string",
      "minimum": 0
    },
    "datePublished": {
      "description": "The date the book was published",
      "type": "string",
      "format": "date"
    }
  },
  "required": ["title", "description", "author"]
}
