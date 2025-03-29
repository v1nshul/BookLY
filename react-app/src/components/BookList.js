import React, { useEffect, useState } from "react";

const BookList = ({ auth }) => {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({ title: "", author: "" });
  const [searchQuery, setSearchQuery] = useState(""); 
  const [searchResults, setSearchResults] = useState([]); 
  const [errorMessage, setErrorMessage] = useState(""); 

  useEffect(() => {
    if (!auth) {
      console.error("No authentication found!");
      return;
    }

    fetch("https://radiusironic-historyharlem-3000.codio-box.uk/api/home/books", {
      headers: { Authorization: `Basic ${auth}` },
    })
      .then((res) => res.json())
      .then((data) => setBooks(data.data || []))
      .catch((err) => console.error("Error fetching books:", err));
  }, [auth]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      const response = await fetch(
        `https://radiusironic-historyharlem-3000.codio-box.uk/api/home/books/search?query=${searchQuery}`,
        { headers: { Authorization: `Basic ${auth}` } }
      );

      const data = await response.json();
      if (response.ok) {
        setSearchResults(data.data);
      } else {
        setErrorMessage("Error searching books: " + data.error);
      }
    } catch (error) {
      console.error("Error searching books:", error);
      setErrorMessage("An error occurred while searching.");
    }
  };

  const addBookFromSearch = async (book) => {
    setErrorMessage("");

    const bookExists = books.some((b) => b.title === book.title && b.author === book.author);
    if (bookExists) {
      setErrorMessage("This book is already in your list!");
      return;
    }

    try {
      const response = await fetch("https://radiusironic-historyharlem-3000.codio-box.uk/api/home/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${auth}`,
        },
        body: JSON.stringify({ title: book.title, author: book.author }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.message === "Book already in your list!") {
          setErrorMessage("This book is already in your list!");
        } else {
          setBooks([...books, { ...book, id: data.bookID }]);
        }
      } else {
        setErrorMessage("Error adding book: " + data.error);
      }
    } catch (error) {
      console.error("Error adding book:", error);
      setErrorMessage("An error occurred while adding the book.");
    }
  };

  const handleDeleteBook = async (title, author) => {
    try {
      console.log("Authorization Header:", `Basic ${auth}`);  
      
      const response = await fetch(
        "https://radiusironic-historyharlem-3000.codio-box.uk/api/home/books/remove",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${auth}`, 
          },
          body: JSON.stringify({ title, author }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setBooks((prevBooks) => prevBooks.filter((book) => !(book.title === title && book.author === author)));
        console.log('book removed');
      } else {
        console.error("Error deleting book:", data.error);
      }
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };




  return (
    <div>
      <h2>Your Book List</h2>
      <ul>
        {books.length > 0 ? (
          books.map((book) => (
            <li key={book.id}>
              {book.title} by {book.author}{" "}
              <button onClick={() => handleDeleteBook(book.title, book.author)}>Remove</button>
            </li>
          ))
        ) : (
          <p>No books added yet.</p>
        )}
      </ul>

      <h3>Search for a Book</h3>
      <input
        type="text"
        placeholder="Search by title or author"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>

      {searchResults.length > 0 && (
        <div>
          <h3>Search Results</h3>
          <ul>
            {searchResults.map((book, index) => (
              <li key={index}>
                {book.title} by {book.author}{" "}
                <button onClick={() => addBookFromSearch(book)}>Add to My List</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      <h3>Add a New Book</h3>
      <form onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          placeholder="Book Title"
          value={newBook.title}
          onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Author"
          value={newBook.author}
          onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
          required
        />
        <button onClick={() => addBookFromSearch(newBook)}>Add Book</button>
      </form>
    </div>
  );
};

export default BookList;
