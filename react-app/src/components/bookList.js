import React, { useEffect, useState } from 'react';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch('https://radiusironic-historyharlem-3000.codio-box.uk/api/home/books');

        
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Received non-JSON response from API");
        }

        const data = await response.json();
        console.log("API Response:", data); 

        if (!data.data) throw new Error("API response does not contain 'data'");

        setBooks(data.data); 
      } catch (err) {
        console.error("Fetch error:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) return <p>Loading books...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Book List</h2>
      <ul>
        {books.map((book) => (
          <li key={book.ID}> 
            <strong>{book.title}</strong> - {book.description || "No description available"}
            <br />
            by Author ID: {book.authorID} 
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookList;
