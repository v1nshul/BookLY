import React, { useEffect, useState } from "react";

const BookList = ({ auth }) => {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({ title: "", author: "" });

  useEffect(() => {
  if (!auth) {
    console.error("No authentication found!");
    return;
  }

  fetch("https://radiusironic-historyharlem-3000.codio-box.uk/api/home/books", {
    headers: { Authorization: `Basic ${auth}` },
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("Books received from API:", data); // Debugging log
      setBooks(data.data);
    })
    .catch((err) => console.error("Error fetching books:", err));
    }, [auth]);

  const handleAddBook = async (e) => {
    e.preventDefault();
    if (!newBook.title || !newBook.author) return;

    try {
      const response = await fetch("https://radiusironic-historyharlem-3000.codio-box.uk/api/home/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${auth}`,
        },
        body: JSON.stringify(newBook),
      });

      if (response.ok) {
        const addedBook = await response.json();
        setBooks([...books, { ...newBook, id: addedBook.id }]); // Update UI with new book
        setNewBook({ title: "", author: "" }); // Reset form
      }
    } catch (error) {
      console.error("Error adding book:", error);
    }
  };

  return (
    <div>
      <h2>Your Book List</h2>
      <ul>
        {books && books.length > 0 ? (
          books.map((book, index) => <li key={index}>{book.title} by {book.author}</li>)
        ) : (
          <p>No books added yet.</p>
        )}
      </ul>

      <h3>Add a New Book</h3>
      <form onSubmit={handleAddBook}>
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
        <button type="submit">Add Book</button>
      </form>
    </div>
  );
};

export default BookList;
