$(document).ready(function () {
  console.log('jQuery sourced.');
  refreshBooks();
  addClickHandlers();
});

function addClickHandlers() {
  $('#submitBtn').on('click', handleSubmit);

  // delete event handler
  $('#bookShelf').on('click', '.delete-book', handleDelete);
  // TODO - Add code for edit
  // edit book if read
  $('#bookShelf').on('click', '.mark-as-read', handleMarkAsRead);
}

function handleSubmit() {
  console.log('Submit button clicked.');
  let book = {};
  book.author = $('#author').val();
  book.title = $('#title').val();
  addBook(book);
}

function handleDelete() {
  console.log('Pressed Delete', $(this).data('id'));
  deleteBook($(this).data('id'));
}

function handleMarkAsRead() {
  console.log('Mark as read button clicked.');
  markAsRead($(this).data('id'), true);
}

// adds a book to the database
function addBook(bookToAdd) {
  $.ajax({
    type: 'POST',
    url: '/books',
    data: bookToAdd,
  })
    .then(function (response) {
      console.log('Response from server.', response);
      refreshBooks();
    })
    .catch(function (error) {
      console.log('Error in POST', error);
      alert('Unable to add book at this time. Please try again later.');
    });
}

// refreshBooks will get all books from the server and render to page
function refreshBooks() {
  $.ajax({
    type: 'GET',
    url: '/books',
  })
    .then(function (response) {
      console.log(response);
      renderBooks(response);
    })
    .catch(function (error) {
      console.log('error in GET', error);
    });
}

// Displays an array of books to the DOM
function renderBooks(books) {
  $('#bookShelf').empty();

  for (let i = 0; i < books.length; i += 1) {
    let book = books[i];
    // For each book, append a new row to our table
    $('#bookShelf').append(`
      <tr>
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>
          ${book.isRead}
          <button class="mark-as-read" data-id="${book.id}">Mark As Read</button>
        </td>
        <td>
          <button class="delete-book" data-id="${book.id}">Delete</button>
        </td>
      </tr>
    `);
  }
}

// Deletes book from Database
function deleteBook(bookId) {
  $.ajax({
    method: 'DELETE',
    url: `/books/${bookId}`,
  })
    .then((response) => {
      // refresh the book list
      refreshBooks();
    })
    .catch((error) => {
      alert('There was an error', error);
    });
}

function markAsRead(bookId, boolean) {
  console.log(bookId, boolean);
  $.ajax({
    method: 'PUT',
    url: `/books/isRead/${bookId}`,
    data: {
      isRead: boolean,
    },
  })
    .then((response) => {
      refreshBooks();
    })
    .catch((error) => {
      alert('Here is your error', error);
    });
}
