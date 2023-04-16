const Bookshelf_Data = "Bookshelf_Data";

const AddBook = document.getElementById("inputBook");
const searchBook = document.getElementById("searchBook");

function CheckForStorage() {
  return typeof Storage !== "undefined";
}

AddBook.addEventListener("submit", function (event) {
  const title = document.getElementById("inputBookTitle").value;
  const author = document.getElementById("inputBookAuthor").value;
  const year = parseInt(document.getElementById("inputBookYear").value);
  const isComplete = document.getElementById("inputBookIsComplete").checked;

  const generateID = document.getElementById("inputBookTitle").name;
  if (generateID !== "") {
    const bookData = GetBookList();
    for (let index = 0; index < bookData.length; index++) {
      if (bookData[index].id == generateID) {
        bookData[index].title = title;
        bookData[index].author = author;
        bookData[index].year = year;
        bookData[index].isComplete = isComplete;
      }
    }
    localStorage.setItem(Bookshelf_Data, JSON.stringify(bookData));
    ResetAllForm();
    RenderBookList(bookData);
    return;
  }

  const id = JSON.parse(localStorage.getItem(Bookshelf_Data)) === null ? 0 + Date.now() : JSON.parse(localStorage.getItem(Bookshelf_Data)).length + Date.now();
  const newBook = {
    id: id,
    title: title,
    author: author,
    year: year,
    isComplete: isComplete,
  };

  PutBookList(newBook);

  const bookData = GetBookList();
  RenderBookList(bookData);
});

function PutBookList(data) {
  if (CheckForStorage()) {
    let bookData = [];

    if (localStorage.getItem(Bookshelf_Data) !== null) {
      bookData = JSON.parse(localStorage.getItem(Bookshelf_Data));
    }

    bookData.push(data);
    localStorage.setItem(Bookshelf_Data, JSON.stringify(bookData));
  }
}

function RenderBookList(bookData) {
  if (bookData === null) {
    return;
  }

  const containerIncomplete = document.getElementById("incompleteBookshelfList");
  const containerComplete = document.getElementById("completeBookshelfList");

  containerIncomplete.innerHTML = "";
  containerComplete.innerHTML = "";
  for (let book of bookData) {
    const id = book.id;
    const title = book.title;
    const author = book.author;
    const year = book.year;
    const isComplete = book.isComplete;

    //create isi item
    let bookItem = document.createElement("article");
    bookItem.classList.add("book_item", "select_item");
    bookItem.innerHTML = "<h3 name = " + id + ">" + title + "</h3>";
    bookItem.innerHTML += "<p>Penulis: " + author + "</p>";
    bookItem.innerHTML += "<p>Tahun: " + year + "</p>";

    //container action item
    let containerActionItem = document.createElement("div");
    containerActionItem.classList.add("action");

    //complete button
    const completeButton = CreateCompleteButton(book, function (event) {
      isCompleteBookHandler(event.target.parentElement.parentElement);

      const bookData = GetBookList();
      ResetAllForm();
      RenderBookList(bookData);
    });

    //delete button
    const deleteButton = CreateDeleteButton(function (event) {
      const confirmDelete= confirm("Apakah Yakin Ingin Menghapus ?");
      
      if (confirmDelete == true) {
        DeleteAnItem(event.target.parentElement.parentElement);

        const bookData = GetBookList();
        ResetAllForm();
        RenderBookList(bookData);
      } else {
        const bookData = GetBookList();
        ResetAllForm();
        RenderBookList(bookData);
      }
      
    });

    containerActionItem.append(completeButton, deleteButton);

    bookItem.append(containerActionItem);

    //incomplete book
    if (isComplete === false) {
      containerIncomplete.append(bookItem);
      bookItem.childNodes[0].addEventListener("click", function (event) {
        UpdateAnItem(event.target.parentElement);
      });

      continue;
    }

    //complete book
    containerComplete.append(bookItem);

    bookItem.childNodes[0].addEventListener("click", function (event) {
      UpdateAnItem(event.target.parentElement);
    });
  }
}

function CreateCompleteButton(book, eventListener) {
  const Selesai = book.isComplete ? "Belum selesai" : "Selesai";

  const completeButton = document.createElement("button");
  completeButton.classList.add("green");
  completeButton.innerText = Selesai + " di Baca";
  completeButton.addEventListener("click", function (event) {
    eventListener(event);
  });
  return completeButton;
}

function CreateDeleteButton(eventListener) {
  const deleteButton = document.createElement("button");
  deleteButton.classList.add("red");
  deleteButton.innerText = "Hapus buku";
  deleteButton.addEventListener("click", function (event) {
    eventListener(event);
  });
  return deleteButton;
}

function isCompleteBookHandler(itemElement) {
  const bookData = GetBookList();
  if (bookData.length === 0) {
    return;
  }

  const title = itemElement.childNodes[0].innerText;
  const titleNameAttribut = itemElement.childNodes[0].getAttribute("name");
  for (let index = 0; index < bookData.length; index++) {
    if (bookData[index].title === title && bookData[index].id == titleNameAttribut) {
      bookData[index].isComplete = !bookData[index].isComplete;
      break;
    }
  }
  localStorage.setItem(Bookshelf_Data, JSON.stringify(bookData));
}

function SearchBookList(title) {
  const bookData = GetBookList();
  if (bookData.length === 0) {
    return;
  }

  const bookList = [];

  for (let index = 0; index < bookData.length; index++) {
    const tempTitle = bookData[index].title.toLowerCase();
    const tempTitleTarget = title.toLowerCase();
    if (bookData[index].title.includes(title) || tempTitle.includes(tempTitleTarget)) {
      bookList.push(bookData[index]);
    }
  }
  return bookList;
}

function DeleteButtonHandler(parentElement) {
  let book = isCompleteBookHandler(parentElement);
  book.isComplete = !book.isComplete;
}

function GetBookList() {
  if (CheckForStorage) {
    return JSON.parse(localStorage.getItem(Bookshelf_Data));
  }
  return [];
}

function DeleteAnItem(itemElement) {
  const bookData = GetBookList();
  if (bookData.length === 0) {
    return;
  }

  const titleNameAttribut = itemElement.childNodes[0].getAttribute("name");
  for (let index = 0; index < bookData.length; index++) {
    if (bookData[index].id == titleNameAttribut) {
      bookData.splice(index, 1);
      break;
    }
  }

  localStorage.setItem(Bookshelf_Data, JSON.stringify(bookData));
}

function UpdateAnItem(itemElement) {
  if (itemElement.id === "incompleteBookshelfList" || itemElement.id === "completeBookshelfList") {
    return;
  }

  const bookData = GetBookList();
  if (bookData.length === 0) {
    return;
  }

  const title = itemElement.childNodes[0].innerText;
  const author = itemElement.childNodes[1].innerText.slice(9, itemElement.childNodes[1].innerText.length);
  const getYear = itemElement.childNodes[2].innerText.slice(7, itemElement.childNodes[2].innerText.length);
  const year = parseInt(getYear);

  const isComplete = itemElement.childNodes[3].childNodes[0].innerText.length === "Selesai di baca".length ? false : true;

  const id = itemElement.childNodes[0].getAttribute("name");
  document.getElementById("inputBookTitle").value = title;
  document.getElementById("inputBookTitle").name = id;
  document.getElementById("inputBookAuthor").value = author;
  document.getElementById("inputBookYear").value = year;
  document.getElementById("inputBookIsComplete").checked = isComplete;

  for (let index = 0; index < bookData.length; index++) {
    if (bookData[index].id == id) {
      bookData[index].id = id;
      bookData[index].title = title;
      bookData[index].author = author;
      bookData[index].year = year;
      bookData[index].isComplete = isComplete;
    }
  }
  localStorage.setItem(Bookshelf_Data, JSON.stringify(bookData));
}

searchBook.addEventListener("submit", function (event) {
  event.preventDefault();
  const bookData = GetBookList();
  if (bookData.length === 0) {
    return;
  }

  const title = document.getElementById("searchBookTitle").value;
  if (title === null) {
    RenderBookList(bookData);
    return;
  }
  const bookList = SearchBookList(title);
  RenderBookList(bookList);
});

function ResetAllForm() {
  document.getElementById("inputBookTitle").value = "";
  document.getElementById("inputBookAuthor").value = "";
  document.getElementById("inputBookYear").value = "";
  document.getElementById("inputBookIsComplete").checked = false;

  document.getElementById("searchBookTitle").value = "";
}

window.addEventListener("load", function () {
  if (CheckForStorage) {
    if (localStorage.getItem(Bookshelf_Data) !== null) {
      const bookData = GetBookList();
      RenderBookList(bookData);
    }
  } else {
    alert("Browser yang Anda gunakan tidak mendukung Web Storage");
  }
});
