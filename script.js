const STORAGE_KEY = 'smartLibraryQrSystem';

function getIssuedBooks() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        return [];
    }
}

function saveIssuedBooks(books) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

function showStatus(message, type = 'success') {
    const statusElement = document.getElementById('statusMessage');
    if (!statusElement) {
        return;
    }

    statusElement.textContent = message;
    statusElement.className = `status ${type}`;
}

function renderIssuedBooks() {
    const list = document.getElementById('issuedBooksList');
    if (!list) {
        return;
    }

    const books = getIssuedBooks();

    if (!books.length) {
        list.innerHTML = '<li>No books issued yet.</li>';
        return;
    }

    list.innerHTML = books
        .map(
            (book) =>
                `<li><strong>${book.studentName}</strong> (${book.rollNumber}) - ${book.bookName} [${book.bookId}]</li>`
        )
        .join('');
}

function createQrData(studentName, rollNumber, bookId, bookName) {
    return JSON.stringify({
        studentName,
        rollNumber,
        bookId,
        bookName,
        status: 'Issued'
    });
}

function generateQrCode(data, callback) {
    const target = document.getElementById('qrImage');
    if (!target) {
        return;
    }

    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(data)}&size=220x220`;

    const image = new Image();
    image.onload = function () {
        target.src = image.src;
        if (callback) {
            callback();
        }
    };
    image.onerror = function () {
        target.alt = 'QR code unavailable';
        target.src = '';
        if (callback) {
            callback();
        }
    };
    image.src = qrUrl;
}

function issueBook() {
    const studentName = document.getElementById('studentName')?.value.trim() || '';
    const rollNumber = document.getElementById('rollNumber')?.value.trim() || '';
    const bookId = document.getElementById('bookId')?.value.trim() || '';
    const bookName = document.getElementById('bookName')?.value.trim() || '';

    if (!studentName || !rollNumber || !bookId || !bookName) {
        showStatus('Please fill in all fields before issuing a book.', 'error');
        return;
    }

    const books = getIssuedBooks();
    const existingBookIndex = books.findIndex(
        (book) => book.bookId.toLowerCase() === bookId.toLowerCase()
    );

    if (existingBookIndex >= 0) {
        showStatus('This book is already issued. Please return it before issuing again.', 'error');
        return;
    }

    const record = { studentName, rollNumber, bookId, bookName };
    books.push(record);
    saveIssuedBooks(books);
    renderIssuedBooks();

    const qrData = createQrData(studentName, rollNumber, bookId, bookName);
    const qrPanel = document.getElementById('qrPanel');
    if (qrPanel) {
        qrPanel.classList.add('visible');
    }

    generateQrCode(qrData, () => {
        showStatus(`Book ${bookName} issued successfully for ${studentName}.`, 'success');
    });
}

function returnBook() {
    const rollNumber = document.getElementById('rollNumber')?.value.trim() || '';
    const bookId = document.getElementById('bookId')?.value.trim() || '';

    if (!rollNumber || !bookId) {
        showStatus('Please enter the roll number and book ID to return a book.', 'error');
        return;
    }

    const books = getIssuedBooks();
    const updatedBooks = books.filter(
        (book) => !(book.rollNumber.toLowerCase() === rollNumber.toLowerCase() && book.bookId.toLowerCase() === bookId.toLowerCase())
    );

    if (updatedBooks.length === books.length) {
        showStatus('No matching issued book found for the provided roll number and book ID.', 'error');
        return;
    }

    saveIssuedBooks(updatedBooks);
    renderIssuedBooks();

    const qrPanel = document.getElementById('qrPanel');
    if (qrPanel) {
        qrPanel.classList.remove('visible');
    }

    const qrImage = document.getElementById('qrImage');
    if (qrImage) {
        qrImage.src = '';
        qrImage.alt = 'No QR code';
    }

    showStatus('Book returned successfully.', 'success');
}

document.addEventListener('DOMContentLoaded', () => {
    renderIssuedBooks();
    const statusElement = document.getElementById('statusMessage');
    if (statusElement) {
        statusElement.textContent = '';
        statusElement.className = 'status';
    }
});
