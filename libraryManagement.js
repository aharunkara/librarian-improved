class Book {
  /**
   * 
   * @param {string} isbn 
   * @param {string} title 
   * @param {string} author 
   * @param {number} year 
   * @param {number} availability 
   * @param {number} stock 
   */
  constructor(isbn, title, author, year, availability = 0, stock = 0) {
    this.isbn = isbn;
    this.title = title;
    this.author = author;
    this.year = year;
    this.availability = availability;
    this.stock = stock;
  }
}

class Library {
  books = [];

  constructor(catalogCsv = "catalog.csv") {
    this.loadCatalog(catalogCsv);
  }

  /**
   * 
   * @param {string} catalogCsv File path to catalog.csv 
   */
  loadCatalog(catalogCsv) {
    let fs = require("fs");
    let csvString = fs.readFileSync(catalogCsv, "utf8");
    let lines = csvString.split("\n");

    lines.forEach((line) => {
      // there is a \r at the end of each line for some reason
      line = line.replace("\r", ""); 
      let book = line.split(",");
      this.books.push(new Book(book[0], book[1], book[2], book[3]));
    });
  }

  getBookByIsbn(isbn) {
    return this.books.find((book) => book.isbn === isbn);
  }

  lookup(isbn) {
    console.log(this.getBookByIsbn(isbn));
  }

  add(isbn, quantity = 1) {
    let book = this.getBookByIsbn(isbn);
    if (book) {
      book.stock += quantity;
      book.availability += quantity;
      console.log(`Book: "${isbn}" added ${quantity} copies`);
    } else {
      console.log(`Book: "${isbn}" not found`);
    }
  }

  borrow(isbn) {
    let book = this.getBookByIsbn(isbn);
    if (book && book.availability > 0) {
      book.availability--;
      console.log(`Book: "${isbn}" borrowed`);
    } else {
      console.log(`Book: "${isbn}" not available`);
    }
  }

  return(isbn) {
    let book = this.getBookByIsbn(isbn);
    if (!book) {
      console.log(`Book: "${isbn}" not found`);
    } else { // book is in db
      if (book.availability >= book.stock) { 
        console.log(`Book: "${isbn}" already returned`);
      } else {
        book.availability++;
        console.log(`Book: "${isbn}" returned`);
      }
    }
  }

  stock() {
    this.books.forEach((book) => {
      console.log(
        `${book.isbn}, copies ${book.stock}, available ${book.availability}`
      );
    });
  }
}

module.exports = Library;