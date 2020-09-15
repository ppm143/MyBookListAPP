// Book Class : Represent a Book

class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}
// UI Class : Handle UI Class
class UI {
    static displayBooks() {
        const books = Store.getBook();

        books.forEach((book) => UI.addBookToList(book));
    }

    static addBookToList(book) {
        const list = document.querySelector('#book-list');

        const row = document.createElement('tr');

        row.innerHTML = `
           <td>${book.title}</td>
           <td>${book.author}</td>
           <td>${book.isbn}</td>
           <td><a href="#" class="btn btn-danger btn-sm delete">X</td>
        `;
        list.appendChild(row);
    }

    static deleteBook(book) {
        if (book.classList.contains('delete')) {
            book.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);

        // delete after 3 sec

        setTimeout(() => {
            document.querySelector('.alert').remove();
        }, 2000);
    }

    static clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }

}
// Store Class 
class Store {
    static getBook() {
        let books;
        if (localStorage.getItem('books') === null) {
            books = [];
        }
        else {
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }
    static addBook(book) {
        const books = Store.getBook();
        books.push(book);

        localStorage.setItem('books', JSON.stringify(books));
    }
    static removeBook(isbn) {
        const books = Store.getBook();

        books.forEach((book, id) => {
            if (book.isbn === isbn) {
                books.splice(id, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }
}

// Event : Display Book
document.addEventListener('DOMContentLoaded', UI.displayBooks)

// Event : ADD Book
document.querySelector('#book-form').addEventListener('submit', (e) => {
    // Prevent Submit
    e.preventDefault();
    // Get Value From Input
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    // Validate
    if (title === '' || author === '' || isbn === '') {
        UI.showAlert('Please Fill All Fields.', 'danger');
    }
    else {
        // Initialize Book
        const addBook = new Book(title, author, isbn);
        // Add Book to UI
        UI.addBookToList(addBook);

        Store.addBook(addBook);

        UI.showAlert('Book Added.', 'success');

        // Clear Fields
        UI.clearFields();

    }
});
// Event : Remove Book
document.querySelector('#book-list').addEventListener('click', (e) => {
    UI.deleteBook(e.target);

    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
    UI.showAlert('Book Removed.', 'success');
})

