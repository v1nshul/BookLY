const db = require('../helpers/database');

// Add a review for a book
exports.addReview = async function addReview(review) {
  const { book_id, user_id, rating, comment } = review;
  const query = `
    INSERT INTO reviews (book_id, user_id, rating, comment)
    VALUES (?, ?, ?, ?);
  `;
  const values = [book_id, user_id, rating, comment];
  try {
    const result = await db.run_query(query, values);
    return { message: "Review added successfully", reviewID: result.insertId };
  } catch (error) {
    console.error("Error adding review:", error);
    throw error;
  }
};

// Get all reviews for a specific book
exports.getReviewsByBookId = async function getReviewsByBookId(book_id) {
  const query = `
    SELECT id, book_id, user_id, rating, comment, created_at 
    FROM reviews 
    WHERE book_id = ?;
  `;
  const values = [book_id];
  try {
    const data = await db.run_query(query, values);
    return data;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw error;
  }
};

module.exports = exports;