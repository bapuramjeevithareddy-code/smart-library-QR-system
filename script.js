// Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, push, update } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCFUqmTvIVXzmwiFxhsiqAA5b6Z8WGvrlU",
  authDomain: "smart-qr-library-system.firebaseapp.com",
  databaseURL: "https://smart-qr-library-system-default-rtdb.firebaseio.com",
  projectId: "smart-qr-library-system",
  storageBucket: "smart-qr-library-system.firebasestorage.app",
  messagingSenderId: "729958073054",
  appId: "1:729958073054:web:62992966031178549d384f",
  measurementId: "G-PD1MVK1YR3"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Issue Book
window.issueBook = function () {
    const studentName = document.getElementById("studentName").value;
    const rollNumber = document.getElementById("rollNumber").value;
    const bookId = document.getElementById("bookId").value;
    const bookName = document.getElementById("bookName").value;

    if (!studentName || !rollNumber || !bookId || !bookName) {
        alert("Please fill all details");
        return;
    }

    push(ref(database, "libraryRecords"), {
        studentName: studentName,
        rollNumber: rollNumber,
        bookId: bookId,
        bookName: bookName,
        status: "Issued",
        date: new Date().toISOString()
    });

    alert("Book Issued Successfully!");

    document.getElementById("studentName").value = "";
    document.getElementById("rollNumber").value = "";
    document.getElementById("bookId").value = "";
    document.getElementById("bookName").value = "";
};

// Return Book
window.returnBook = function () {
    const studentName = document.getElementById("studentName").value;
    const rollNumber = document.getElementById("rollNumber").value;
    const bookId = document.getElementById("bookId").value;
    const bookName = document.getElementById("bookName").value;

    if (!studentName || !rollNumber || !bookId || !bookName) {
        alert("Please fill all details");
        return;
    }

    push(ref(database, "libraryRecords"), {
        studentName: studentName,
        rollNumber: rollNumber,
        bookId: bookId,
        bookName: bookName,
        status: "Returned",
        date: new Date().toISOString()
    });

    alert("Book Returned Successfully!");
};
