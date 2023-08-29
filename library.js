const myLibrary = [new Book('The Lord of the Rings', 'J. R. R. Tolkien', 1216, true), new Book('The Lord of the Rings', 'J. R. R. Tolkien', 1216, true), new Book('The Lord of the Rings', 'J. R. R. Tolkien', 1216, true), new Book('The Lord of the Rings', 'J. R. R. Tolkien', 1216, true), new Book('The Lord of the Rings', 'J. R. R. Tolkien', 1216, true)];

const newBookBtn = document.querySelector('header button');
const main = document.querySelector('main');
const dialog = document.querySelector('dialog');
const dialogSubmitButton = dialog.querySelector('button');

function Book(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
}

Book.prototype.info = function() {
    const isRead = read ? 'read' : 'not read yet';
        return `${this.title} by ${this.author}, ${this.pages} pages, ${isRead}`;
}

// Display books initially saved in myLibrary
myLibrary.forEach(book => { displayNewBook(book); });

// Open new dialog
newBookBtn.addEventListener('click', () => {
    resetInputValues();
    dialog.showModal();
});

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

// Close dialog when click outside form
dialog.addEventListener('click', (event) => {
    if (event.target === dialog) {
        dialog.close();
    }
});

// Close dialog and create book
dialogSubmitButton.addEventListener('click', (event) => {
    const form = dialog.querySelector('form');
    if (form.checkValidity()) {
        event.preventDefault();// Don't want to submit this form
        const bookInfo = addBookToLibrary();
        displayNewBook(bookInfo.book, bookInfo.position);
        dialog.close();
    } 
});

function addBookToLibrary() {
    const dialogInputName = dialog.querySelector('#book-name');
    const dialogInputAuthor = dialog.querySelector('#book-author');
    const dialogInputPages = dialog.querySelector('#book-pages');
    const dialogInputRead = dialog.querySelector('#book-read');

    const book = new Book(dialogInputName.value, dialogInputAuthor.value,
                dialogInputPages.value, dialogInputRead.checked);
    const position = myLibrary.push(book);
    return {book, position};
}

function displayNewBook(book, position) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.setAttribute('data-position', position);

    const title = document.createElement('p');
    title.textContent = `"${book.title}"`;
    const author = document.createElement('p');
    author.textContent = book.author;
    const pages = document.createElement('p');
    pages.textContent = `${book.pages} pages`;
        
    card.append(title, author, pages, createIsReadButton(book), createRemoveButton());
    main.appendChild(card);
}

function createIsReadButton(book) {
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
        myLibrary[bookPosition].read = !myLibrary[bookPosition].read;
    });

    return readButton;
}

function createRemoveButton() {
    const removeButton = document.createElement('button');

    removeButton.setAttribute('type', 'button');
    removeButton.classList.add('remove-btn');
    removeButton.textContent = 'Remove';

    removeButton.addEventListener('click', (event) => {
        const bookPosition = event.target.parentNode.dataset.position;
        myLibrary.splice(bookPosition, 1);
        main.removeChild(event.target.parentNode);
        
    });

    return removeButton;
}