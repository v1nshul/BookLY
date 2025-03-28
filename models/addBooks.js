const db = require('../helpers/database');
async function addDummyBooks() {
  const books = [
    { title: "The Great Adventure", authorID: 1, datePublished: "2020-12-12", genre: "Fiction" },
    { title: "Learning JavaScript", authorID: 1, datePublished: "2019-01-23", genre: "Programming" },
    { title: "Mastering React", authorID: 1, datePublished: '2021-11-03', genre: "Technology" },
    { title: "Mystery of the Lost City", authorID: 1, datePublished: '2022-10-23', genre: "Mystery" },
    { title: "History of AI", authorID: 1, datePublished: '2023-05-16', genre: "Science" }
  ];

  for (const book of books) {
    await db.run_query("INSERT INTO books SET ?", book);
  }

  console.log("Dummy books added!");
}

//addDummyBooks();