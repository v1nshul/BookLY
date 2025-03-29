// BookList.js
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
          setNewBook({ title: "", author: "" });
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
      } else {
        console.error("Error deleting book:", data.error);
      }
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Your Book List</h2>
        {books.length > 0 ? (
          <ul className="space-y-3">
            {books.map((book) => (
              <li
                key={book.id}
                className="flex justify-between items-center p-3 bg-light-card dark:bg-dark-card rounded-md shadow-sm"
              >
                <span>{book.title} by {book.author}</span>
                <button
                  onClick={() => handleDeleteBook(book.title, book.author)}
                  className="px-3 py-1 border border-red-500 hover:bg-red-500 hover:text-white transition-colors duration-200 bg-transparent text-red-500 rounded-md text-sm"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-light-text dark:text-dark-text opacity-75">No books added yet.</p>
        )}
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-3">Search for a Book</h3>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search by title or author"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-3 py-2 border border-light-border dark:border-dark-border rounded-md bg-light-card dark:bg-dark-card text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 border border-blue-500 hover:bg-blue-500 hover:text-white transition-colors duration-200 bg-transparent text-blue-500 rounded-md"
          >
            Search
          </button>
        </div>

        {searchResults.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-medium mb-2">Search Results</h3>
            <ul className="space-y-3">
              {searchResults.map((book, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center p-3 bg-light-card dark:bg-dark-card rounded-md shadow-sm"
                >
                  <span>{book.title} by {book.author}</span>
                  <button
                    onClick={() => addBookFromSearch(book)}
                    className="px-3 py-1 border border-green-500 hover:bg-green-500 hover:text-white transition-colors duration-200 bg-transparent text-green-500 rounded-md text-sm"
                  >
                    Add to My List
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {errorMessage && (
        <p className="text-red-500 text-center">{errorMessage}</p>
      )}

      <div>
        <h3 className="text-xl font-semibold mb-3">Add a New Book</h3>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <input
            type="text"
            placeholder="Book Title"
            value={newBook.title}
            onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
            required
            className="w-full px-3 py-2 border border-light-border dark:border-dark-border rounded-md bg-light-card dark:bg-dark-card text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Author"
            value={newBook.author}
            onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
            required
            className="w-full px-3 py-2 border border-light-border dark:border-dark-border rounded-md bg-light-card dark:bg-dark-card text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => addBookFromSearch(newBook)}
            className="w-full px-4 py-2 border border-blue-500 hover:bg-blue-500 hover:text-white transition-colors duration-200 bg-transparent text-blue-500 rounded-md"
          >
            Add Book
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookList;