//Mixin en create buttons i pare Library
//Diferents display classes que hereden de display controller

class Book {
    constructor(title, author, pages, read) {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.read = read;
    }

    info() {
        const isRead = read ? 'read' : 'not read yet';
        return `${this.title} by ${this.author}, ${this.pages} pages, ${isRead}`;
    }

}

class Library {
    #myLibrary = [];

    constructor(...books) {
        this.#myLibrary.push(...books);
    }

    get myLibrary() {
        return this.#myLibrary;
    }

    addBookToLibrary(name, author, pages, read) {
        const book = new Book(name, author, pages, read);
        const position = this.#myLibrary.push(book) - 1;
        return {book, position};
    }

    changeBookIsRead(position) {
        console.log(this.#myLibrary[0]);
        this.#myLibrary[position].read = !this.#myLibrary[position].read;
    }

    deleteBook(position) {
        this.#myLibrary.splice(position, 1);
        console.log(this.#myLibrary);
    }

}

class DisplayController {

    constructor(library) {
        this.main = document.querySelector('main');
        this.library = library;

        //Initialize library's previous books
        this.library.myLibrary.forEach(
            book => this.#displayBook(book)
        );
    }

    addNewBook(nameInfo, authorInfo, pagesInfo, readInfo) {
        const bookInfo = library.addBookToLibrary(nameInfo, authorInfo, pagesInfo, readInfo);
        this.#displayBook(bookInfo.book, bookInfo.position);
    }

    #displayBook(book, position) {
        const card = document.createElement('div');
        card.classList.add('card');
        card.setAttribute('data-position', position);
    
        const title = document.createElement('p');
        title.textContent = `"${book.title}"`;
        const author = document.createElement('p');
        author.textContent = book.author;
        const pages = document.createElement('p');
        pages.textContent = `${book.pages} pages`;
        
        card.append(title, author, pages, this.#createIsReadButton(book),
                    this.#createRemoveButton());
        this.main.appendChild(card);
    }

    #createIsReadButton(book) {
        const readButton = document.createElement('button');
    
        readButton.setAttribute('type', 'button');
        readButton.classList.add('isRead-btn');
    
        if (book.read) { readButton.classList.add('read'); }
        readButton.textContent = book.read ? 'Read' : 'Not Read';
    
        readButton.addEventListener('click', (event) => {
            event.target.classList.toggle('read');
            readButton.textContent = 
                event.target.classList.contains('read') ? 'Read' : 'Not Read';
            const bookPosition = event.target.parentNode.dataset.position;
            this.library.changeBookIsRead(bookPosition);
        });
    
        return readButton;
    }

    #createRemoveButton() {
        const removeButton = document.createElement('button');
    
        removeButton.setAttribute('type', 'button');
        removeButton.classList.add('remove-btn');
        removeButton.textContent = 'Remove';
    
        removeButton.addEventListener('click', (event) => {
            const bookPosition = event.target.parentNode.dataset.position;
            this.library.deleteBook(bookPosition);
            this.main.removeChild(event.target.parentNode);
        });
    
        return removeButton;
    }

}

const library = new Library(new Book('The Lord of the Rings', 'J. R. R. Tolkien', 1216, true));
const displayController = new DisplayController(library);

const dialog = document.querySelector('dialog');
const newBookBtn = document.querySelector('header button');
const dialogSubmitButton = document.querySelector('dialog button');

// Close dialog when click outside form
dialog.addEventListener('click', (event) => {
    if (event.target === dialog) {
        dialog.close();
    }
});

//Add new book if button clicked
newBookBtn.addEventListener('click', () => {
    resetInputValues();
    dialog.showModal();
});

// Close dialog and create book
dialogSubmitButton.addEventListener('click', (event) => {
    const form = dialog.querySelector('form');
    if (form.checkValidity()) {
        event.preventDefault();// Don't want to submit this form
        addNewBook();
        dialog.close();
    } 
});

function addNewBook() {
    const dialogInputName = dialog.querySelector('#book-name');
    const dialogInputAuthor = dialog.querySelector('#book-author');
    const dialogInputPages = dialog.querySelector('#book-pages');
    const dialogInputRead = dialog.querySelector('#book-read');

    
    displayController.addNewBook(dialogInputName.value, dialogInputAuthor.value,
                                dialogInputPages.value, dialogInputRead.checked);
}

function resetInputValues() {
    const inputs = dialog.querySelectorAll('input');
    inputs.forEach(input => {
        if (input.type === 'checkbox') {
            input.checked = false;
        } else {
            input.value = '';
        }
    });
}
