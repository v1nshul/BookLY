import React, { useEffect, useState } from 'react';
const apiBase = 'https://radiusironic-historyharlem-3000.codio-box.uk/api/home/books';
const authHeader = localStorage.getItem('authHeader') || '';
console.log("Authorization Header:", authHeader);
const BookList = () => {
    const [books, setBooks] = useState([]);
    useEffect(() => {
      fetchBooks();
    }, []);
    const fetchBooks = async () => {
      try {
          const response = await fetch(apiBase, {
          headers: { 'Authorization': authHeader }
          });
          if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
          const data = await response.json();
          setBooks(data);
      } catch (error) {
          console.error("Error fetching Books:", error);
      }
 };
 return (
    <div>
        <h2>Books</h2>
        {books.length === 0 ? (
            <p>No Books found.</p>
        ) : (
            books.map(book => (
              <div key={book.ID}>
                  <h3>{book.title}</h3>
                    <p><strong>ID:</strong> {book.ID}</p>
                  <p>{book.description}</p>
              </div>
              ))
        )}
    </div>
  );
};
export default BookList;