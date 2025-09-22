// Sample data
const sampleBooks = [
  {
    id: 1,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    genre: "Fiction",
    isbn: "978-0-7432-7356-5",
    available: true,
    description:
      "A classic American novel set in the Jazz Age, exploring themes of wealth, love, and the American Dream.",
  },
  {
    id: 2,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    genre: "Fiction",
    isbn: "978-0-06-112008-4",
    available: false,
    description:
      "A powerful story of racial injustice and childhood innocence in the American South.",
  },
  {
    id: 3,
    title: "1984",
    author: "George Orwell",
    genre: "Science Fiction",
    isbn: "978-0-452-28423-4",
    available: true,
    description:
      "A dystopian novel about totalitarian control and the struggle for individual freedom.",
  },
  {
    id: 4,
    title: "Pride and Prejudice",
    author: "Jane Austen",
    genre: "Romance",
    isbn: "978-0-14-143951-8",
    available: true,
    description:
      "A witty and romantic novel about love, class, and social expectations in Regency England.",
  },
  {
    id: 5,
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    genre: "Fiction",
    isbn: "978-0-316-76948-0",
    available: false,
    description:
      "A coming-of-age story following teenager Holden Caulfield in New York City.",
  },
  {
    id: 6,
    title: "Harry Potter and the Sorcerer's Stone",
    author: "J.K. Rowling",
    genre: "Fiction",
    isbn: "978-0-439-70818-8",
    available: true,
    description:
      "The magical story of a young wizard discovering his destiny at Hogwarts School.",
  },
  {
    id: 7,
    title: "The Da Vinci Code",
    author: "Dan Brown",
    genre: "Mystery",
    isbn: "978-0-307-27430-4",
    available: true,
    description:
      "A thrilling mystery involving art, history, and religious symbology.",
  },
  {
    id: 8,
    title: "Steve Jobs",
    author: "Walter Isaacson",
    genre: "Biography",
    isbn: "978-1-451-64853-9",
    available: true,
    description: "The definitive biography of Apple co-founder Steve Jobs.",
  },
];

let borrowedBooks = [
  {
    id: 2,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    dueDate: "2024-10-15",
    borrowDate: "2024-09-01",
  },
  {
    id: 5,
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    dueDate: "2024-10-22",
    borrowDate: "2024-09-08",
  },
];

const readingHistory = [
  {
    id: 10,
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    returnDate: "2024-08-15",
    borrowDate: "2024-07-20",
  },
  {
    id: 11,
    title: "Dune",
    author: "Frank Herbert",
    returnDate: "2024-08-01",
    borrowDate: "2024-07-05",
  },
  {
    id: 12,
    title: "The Alchemist",
    author: "Paulo Coelho",
    returnDate: "2024-07-18",
    borrowDate: "2024-06-25",
  },
];

// DOM Elements
const sidebar = document.querySelector(".sidebar");
const sidebarToggle = document.getElementById("sidebar-toggle");
const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll(".section");
const currentPageSpan = document.getElementById("current-page");
const searchInput = document.getElementById("search-input");
const genreFilter = document.getElementById("genre-filter");
const availabilityFilter = document.getElementById("availability-filter");
const booksGrid = document.getElementById("books-grid");
const borrowedBooksList = document.getElementById("borrowed-books-list");
const historyBooksList = document.getElementById("history-books-list");
const tabBtns = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");
const modal = document.getElementById("book-modal");
const modalContent = document.getElementById("modal-book-details");
const closeBtn = document.querySelector(".close-btn");
const logoutBtn = document.getElementById("logout-btn");
const actionItems = document.querySelectorAll(".action-item");
const notification = document.getElementById("notification");
const notificationMessage = document.getElementById("notification-message");
const closeNotification = document.getElementById("close-notification");
const resultsCount = document.getElementById("results-count");
const activityList = document.getElementById("activity-list");

// Current user
let currentUser = null;

// Page titles mapping
const pageTitles = {
  home: "Dashboard",
  browse: "Browse Books",
  "my-books": "My Books",
  profile: "Profile",
};

// Initialize the application
document.addEventListener("DOMContentLoaded", function () {
  // Check authentication
  currentUser = getCurrentUser();
  if (!currentUser) {
    window.location.href = "login.html";
    return;
  }

  // Initialize UI
  updateUserInfo();
  updateStats();
  renderBooks(sampleBooks);
  renderBorrowedBooks();
  renderReadingHistory();
  renderRecentActivity();

  // Event listeners
  if (sidebarToggle) {
    sidebarToggle.addEventListener("click", toggleSidebar);
  }

  navLinks.forEach((link) => link.addEventListener("click", handleNavigation));
  if (searchInput) searchInput.addEventListener("input", handleSearch);
  if (genreFilter) genreFilter.addEventListener("change", handleFilter);
  if (availabilityFilter)
    availabilityFilter.addEventListener("change", handleFilter);
  tabBtns.forEach((btn) => btn.addEventListener("click", handleTabSwitch));
  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  window.addEventListener("click", outsideModalClick);
  if (logoutBtn) logoutBtn.addEventListener("click", handleLogout);
  actionItems.forEach((item) =>
    item.addEventListener("click", handleQuickAction)
  );
  if (closeNotification)
    closeNotification.addEventListener("click", hideNotification);

  // Global search
  const globalSearch = document.getElementById("global-search");
  if (globalSearch) {
    globalSearch.addEventListener("keypress", handleGlobalSearch);
  }

  // Initialize filters
  updateResultsCount();

  // Profile buttons
  const editProfileBtn = document.getElementById("edit-profile");
  const changePasswordBtn = document.getElementById("change-password");
  const exportDataBtn = document.getElementById("export-data");

  if (editProfileBtn)
    editProfileBtn.addEventListener("click", handleEditProfile);
  if (changePasswordBtn)
    changePasswordBtn.addEventListener("click", handleChangePassword);
  if (exportDataBtn) exportDataBtn.addEventListener("click", handleExportData);

  // Check for overdue books after delay
  setTimeout(() => {
    checkOverdueBooks();
  }, 2000);

  // Load user preferences
  loadUserPreferences();

  // Save preferences on unload
  window.addEventListener("beforeunload", saveUserPreferences);
});

// Get current user from localStorage
function getCurrentUser() {
  return JSON.parse(localStorage.getItem("currentUser") || "null");
}

// Update user information in UI
function updateUserInfo() {
  const userName = document.getElementById("sidebar-user-name");
  const profileName = document.getElementById("profile-name");
  const userEmail = document.getElementById("user-email");
  const memberId = document.getElementById("member-id");

  if (currentUser) {
    const displayName = currentUser.name || "User";
    if (userName) userName.textContent = displayName;
    if (profileName) profileName.textContent = displayName;
    if (userEmail)
      userEmail.textContent = currentUser.username + "@library.com";
    if (memberId)
      memberId.textContent = "LIB" + String(Math.random()).slice(2, 5);
  }
}

// Toggle sidebar for mobile
function toggleSidebar() {
  if (sidebar) {
    sidebar.classList.toggle("open");
  }
}

// Handle logout
function handleLogout() {
  if (confirm("Are you sure you want to logout?")) {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("loginTime");
    showNotification("Logged out successfully!", "success");
    setTimeout(() => {
      window.location.href = "login.html";
    }, 1500);
  }
}

// Navigation handling
function handleNavigation(e) {
  e.preventDefault();
  const targetId = e.target.closest("a").getAttribute("href").substring(1);
  switchToSection(targetId);

  // Close sidebar on mobile
  if (window.innerWidth <= 1024 && sidebar) {
    sidebar.classList.remove("open");
  }
}

// Switch to specific section
function switchToSection(sectionId) {
  // Update active nav link
  navLinks.forEach((link) => link.classList.remove("active"));
  const activeLink = document.querySelector(`a[href="#${sectionId}"]`);
  if (activeLink) {
    activeLink.classList.add("active");
  }

  // Update active section
  sections.forEach((section) => section.classList.remove("active"));
  const activeSection = document.getElementById(sectionId);
  if (activeSection) {
    activeSection.classList.add("active");
  }

  // Update breadcrumb
  if (currentPageSpan) {
    currentPageSpan.textContent = pageTitles[sectionId] || "Dashboard";
  }
}

// Handle quick actions
function handleQuickAction(e) {
  const action = e.currentTarget.getAttribute("data-action");
  if (action) {
    switchToSection(action);
  }
}

// Handle global search
function handleGlobalSearch(e) {
  if (e.key === "Enter") {
    const query = e.target.value.trim();
    if (query) {
      switchToSection("browse");
      if (searchInput) {
        searchInput.value = query;
        handleSearch();
      }
    }
  }
}

// Update statistics
function updateStats() {
  const totalBooks = sampleBooks.length;
  const availableBooks = sampleBooks.filter((book) => book.available).length;
  const borrowedBooksCount = borrowedBooks.length;

  const totalBooksEl = document.getElementById("total-books");
  const availableBooksEl = document.getElementById("available-books");
  const borrowedBooksEl = document.getElementById("borrowed-books");
  const booksReadStatEl = document.getElementById("books-read-stat");

  if (totalBooksEl) totalBooksEl.textContent = totalBooks;
  if (availableBooksEl) availableBooksEl.textContent = availableBooks;
  if (borrowedBooksEl) borrowedBooksEl.textContent = borrowedBooksCount;
  if (booksReadStatEl) booksReadStatEl.textContent = readingHistory.length;

  // Update profile stats
  const booksReadEl = document.getElementById("books-read");
  const currentBorrowedEl = document.getElementById("current-borrowed");
  const overdueEl = document.getElementById("overdue-books");

  if (booksReadEl) booksReadEl.textContent = readingHistory.length;
  if (currentBorrowedEl) currentBorrowedEl.textContent = borrowedBooksCount;

  // Calculate overdue books
  const today = new Date();
  const overdueCount = borrowedBooks.filter(
    (book) => new Date(book.dueDate) < today
  ).length;
  if (overdueEl) overdueEl.textContent = overdueCount;
}

// Update results count
function updateResultsCount() {
  const filteredBooks = getFilteredBooks();
  const total = sampleBooks.length;
  const showing = filteredBooks.length;

  if (resultsCount) {
    if (showing === total) {
      resultsCount.textContent = `Showing all ${total} books`;
    } else {
      resultsCount.textContent = `Showing ${showing} of ${total} books`;
    }
  }
}

// Render books in grid
function renderBooks(books) {
  if (!booksGrid) return;

  booksGrid.innerHTML = "";

  if (books.length === 0) {
    booksGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-search"></i>
                <p>No books found matching your criteria</p>
                <small>Try adjusting your search or filters</small>
            </div>
        `;
    return;
  }

  books.forEach((book) => {
    const bookCard = document.createElement("div");
    bookCard.className = "book-card";
    bookCard.innerHTML = `
            <div class="book-cover">
                <i class="fas fa-book"></i>
            </div>
            <div class="book-info">
                <h3>${book.title}</h3>
                <p class="author">by ${book.author}</p>
                <span class="genre">${book.genre}</span>
                <div class="book-status">
                    <span class="status-badge ${
                      book.available ? "available" : "borrowed"
                    }">
                        ${book.available ? "Available" : "Borrowed"}
                    </span>
                    <button class="btn ${
                      book.available ? "btn-primary" : "btn-secondary"
                    }" 
                            ${book.available ? "" : "disabled"}>
                        ${book.available ? "Borrow" : "Unavailable"}
                    </button>
                </div>
            </div>
        `;

    // Add event listeners
    const borrowBtn = bookCard.querySelector(".btn");
    if (borrowBtn && book.available) {
      borrowBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        handleBorrowBook(book.id);
      });
    }

    bookCard.addEventListener("click", () => {
      showBookDetails(book);
    });

    booksGrid.appendChild(bookCard);
  });

  updateResultsCount();
}

// Handle book borrowing
function handleBorrowBook(bookId) {
  const book = sampleBooks.find((b) => b.id === bookId);
  if (!book || !book.available) return;

  if (borrowedBooks.length >= 3) {
    showNotification("You can only borrow up to 3 books at a time!", "warning");
    return;
  }

  const borrowDate = new Date();
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 14);

  borrowedBooks.push({
    id: book.id,
    title: book.title,
    author: book.author,
    borrowDate: borrowDate.toISOString().split("T")[0],
    dueDate: dueDate.toISOString().split("T")[0],
  });

  book.available = false;

  updateStats();
  renderBooks(getFilteredBooks());
  renderBorrowedBooks();
  renderRecentActivity();

  showNotification(
    `"${book.title}" has been borrowed successfully!`,
    "success"
  );
  closeModal();
}

// Handle book return
function handleReturnBook(bookId) {
  const borrowedBookIndex = borrowedBooks.findIndex((b) => b.id === bookId);
  const borrowedBook = borrowedBooks[borrowedBookIndex];

  if (!borrowedBook) return;

  borrowedBooks.splice(borrowedBookIndex, 1);

  readingHistory.unshift({
    id: borrowedBook.id,
    title: borrowedBook.title,
    author: borrowedBook.author,
    borrowDate: borrowedBook.borrowDate,
    returnDate: new Date().toISOString().split("T")[0],
  });

  const book = sampleBooks.find((b) => b.id === bookId);
  if (book) {
    book.available = true;
  }

  updateStats();
  renderBooks(getFilteredBooks());
  renderBorrowedBooks();
  renderReadingHistory();
  renderRecentActivity();

  showNotification(
    `"${borrowedBook.title}" has been returned successfully!`,
    "success"
  );
}

// Show book details in modal
function showBookDetails(book) {
  if (!modalContent) return;

  modalContent.innerHTML = `
        <div class="book-detail-header">
            <div class="book-cover-large">
                <i class="fas fa-book"></i>
            </div>
            <div class="book-detail-info">
                <h2>${book.title}</h2>
                <p class="book-author">by ${book.author}</p>
                <span class="book-genre-tag">${book.genre}</span>
                <div class="book-availability">
                    <span class="status-badge ${
                      book.available ? "available" : "borrowed"
                    }">
                        ${book.available ? "Available" : "Currently Borrowed"}
                    </span>
                </div>
            </div>
        </div>
        
        <div class="book-details-grid">
            <div class="detail-section">
                <h3>Book Information</h3>
                <div class="detail-list">
                    <div class="detail-item">
                        <span class="label">ISBN:</span>
                        <span class="value">${book.isbn}</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">Genre:</span>
                        <span class="value">${book.genre}</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">Status:</span>
                        <span class="value">${
                          book.available
                            ? "Available for borrowing"
                            : "Currently borrowed"
                        }</span>
                    </div>
                </div>
            </div>
            
            <div class="detail-section">
                <h3>Description</h3>
                <p class="book-description">${book.description}</p>
            </div>
        </div>
        
        <div class="modal-actions">
            <button class="btn ${
              book.available ? "btn-primary" : "btn-secondary"
            }" 
                    ${book.available ? "" : "disabled"}
                    id="modal-borrow-btn">
                <i class="fas fa-${book.available ? "bookmark" : "clock"}"></i>
                ${book.available ? "Borrow This Book" : "Currently Unavailable"}
            </button>
            ${
              !book.available
                ? '<p class="availability-note">This book will be available when returned by current borrower.</p>'
                : ""
            }
        </div>
    `;

  const modalBorrowBtn = modalContent.querySelector("#modal-borrow-btn");
  if (modalBorrowBtn && book.available) {
    modalBorrowBtn.addEventListener("click", () => {
      handleBorrowBook(book.id);
    });
  }

  if (modal) {
    modal.style.display = "block";
    document.body.style.overflow = "hidden";
  }
}

function closeModal() {
  if (modal) {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
  }
}

function outsideModalClick(e) {
  if (e.target === modal || e.target.classList.contains("modal-backdrop")) {
    closeModal();
  }
}

function handleSearch() {
  const filteredBooks = getFilteredBooks();
  renderBooks(filteredBooks);
}

function handleFilter() {
  const filteredBooks = getFilteredBooks();
  renderBooks(filteredBooks);
}

function getFilteredBooks() {
  const query = searchInput ? searchInput.value.toLowerCase() : "";
  const genre = genreFilter ? genreFilter.value : "";
  const availability = availabilityFilter ? availabilityFilter.value : "";

  return sampleBooks.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query) ||
      book.isbn.toLowerCase().includes(query);
    const matchesGenre = !genre || book.genre === genre;
    const matchesAvailability =
      !availability ||
      (availability === "available" && book.available) ||
      (availability === "borrowed" && !book.available);

    return matchesSearch && matchesGenre && matchesAvailability;
  });
}

function handleTabSwitch(e) {
  const targetTab = e.target.closest("button").getAttribute("data-tab");

  tabBtns.forEach((btn) => btn.classList.remove("active"));
  e.target.closest("button").classList.add("active");

  tabContents.forEach((content) => content.classList.remove("active"));
  const targetContent = document.getElementById(targetTab);
  if (targetContent) {
    targetContent.classList.add("active");
  }
}

// Render borrowed books
function renderBorrowedBooks() {
  if (!borrowedBooksList) return;

  borrowedBooksList.innerHTML = "";

  if (borrowedBooks.length === 0) {
    borrowedBooksList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-book-open"></i>
                <p>No books currently borrowed</p>
                <small>Visit the browse section to borrow books</small>
            </div>
        `;
    return;
  }

  borrowedBooks.forEach((book) => {
    const today = new Date();
    const dueDate = new Date(book.dueDate);
    const isOverdue = dueDate < today;
    const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

    const bookRow = document.createElement("div");
    bookRow.className = "book-row";
    bookRow.innerHTML = `
            <div class="book-info-table">
                <h4>${book.title}</h4>
                <p class="author">by ${book.author}</p>
                <div class="book-meta">
                    <span>Borrowed: ${formatDate(book.borrowDate)}</span> • 
                    <span class="${isOverdue ? "overdue" : "due-date"}">
                        ${
                          isOverdue
                            ? "Overdue!"
                            : `Due: ${formatDate(book.dueDate)}`
                        }
                        ${
                          !isOverdue && daysUntilDue <= 3 && daysUntilDue > 0
                            ? ` (${daysUntilDue} days left)`
                            : ""
                        }
                        ${daysUntilDue === 0 ? " (Due today!)" : ""}
                    </span>
                </div>
            </div>
            <div class="book-actions">
                <button class="btn btn-primary renew-btn">
                    <i class="fas fa-redo"></i>
                    Renew
                </button>
                <button class="btn btn-secondary return-btn">
                    <i class="fas fa-check"></i>
                    Return
                </button>
            </div>
        `;

    const renewBtn = bookRow.querySelector(".renew-btn");
    const returnBtn = bookRow.querySelector(".return-btn");

    if (renewBtn) {
      renewBtn.addEventListener("click", () => renewBook(book.id));
    }

    if (returnBtn) {
      returnBtn.addEventListener("click", () => handleReturnBook(book.id));
    }

    borrowedBooksList.appendChild(bookRow);
  });
}

function renderReadingHistory() {
  if (!historyBooksList) return;

  historyBooksList.innerHTML = "";

  if (readingHistory.length === 0) {
    historyBooksList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-history"></i>
                <p>No reading history available</p>
                <small>Books you return will appear here</small>
            </div>
        `;
    return;
  }

  readingHistory.forEach((book) => {
    const bookRow = document.createElement("div");
    bookRow.className = "book-row";
    bookRow.innerHTML = `
            <div class="book-info-table">
                <h4>${book.title}</h4>
                <p class="author">by ${book.author}</p>
                <div class="book-meta">
                    <span>Borrowed: ${formatDate(book.borrowDate)}</span> • 
                    <span>Returned: ${formatDate(book.returnDate)}</span>
                </div>
            </div>
            <div class="book-actions">
                <button class="btn btn-primary borrow-again-btn">
                    <i class="fas fa-bookmark"></i>
                    Borrow Again
                </button>
            </div>
        `;

    const borrowAgainBtn = bookRow.querySelector(".borrow-again-btn");
    if (borrowAgainBtn) {
      borrowAgainBtn.addEventListener("click", () =>
        handleBorrowAgain(book.id)
      );
    }

    historyBooksList.appendChild(bookRow);
  });
}

function handleBorrowAgain(bookId) {
  const book = sampleBooks.find((b) => b.id === bookId);
  if (book && book.available) {
    handleBorrowBook(bookId);
  } else if (book) {
    showNotification(`"${book.title}" is currently unavailable.`, "warning");
  }
}

function renewBook(bookId) {
  const book = borrowedBooks.find((b) => b.id === bookId);
  if (!book) return;

  const currentDueDate = new Date(book.dueDate);
  const newDueDate = new Date(currentDueDate);
  newDueDate.setDate(newDueDate.getDate() + 14);

  book.dueDate = newDueDate.toISOString().split("T")[0];

  renderBorrowedBooks();
  showNotification(
    `"${book.title}" has been renewed until ${formatDate(book.dueDate)}`,
    "success"
  );
}

function renderRecentActivity() {
  if (!activityList) return;

  const activities = [];

  borrowedBooks.slice(-3).forEach((book) => {
    activities.push({
      type: "borrow",
      message: `Borrowed "${book.title}"`,
      time: book.borrowDate,
      icon: "fa-bookmark",
    });
  });

  readingHistory.slice(0, 2).forEach((book) => {
    activities.push({
      type: "return",
      message: `Returned "${book.title}"`,
      time: book.returnDate,
      icon: "fa-check-circle",
    });
  });

  activities.sort((a, b) => new Date(b.time) - new Date(a.time));

  activityList.innerHTML = "";

  if (activities.length === 0) {
    activityList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-clock"></i>
                <p>No recent activity</p>
                <small>Your library activity will appear here</small>
            </div>
        `;
    return;
  }

  activities.slice(0, 5).forEach((activity) => {
    const activityItem = document.createElement("div");
    activityItem.className = "activity-item";
    activityItem.innerHTML = `
            <div class="activity-icon">
                <i class="fas ${activity.icon}"></i>
            </div>
            <div class="activity-content">
                <p>${activity.message}</p>
                <span class="activity-time">${formatDate(activity.time)}</span>
            </div>
        `;
    activityList.appendChild(activityItem);
  });
}

function showNotification(message, type = "success") {
  if (!notification || !notificationMessage) return;

  notificationMessage.textContent = message;
  notification.className = `notification-toast ${type}`;

  const iconElement = notification.querySelector(".toast-icon");
  if (iconElement) {
    switch (type) {
      case "success":
        iconElement.className = "toast-icon fas fa-check-circle";
        break;
      case "error":
        iconElement.className = "toast-icon fas fa-exclamation-circle";
        break;
      case "warning":
        iconElement.className = "toast-icon fas fa-exclamation-triangle";
        break;
      default:
        iconElement.className = "toast-icon fas fa-info-circle";
    }
  }

  notification.style.display = "flex";

  setTimeout(() => {
    hideNotification();
  }, 5000);
}

function hideNotification() {
  if (notification) {
    notification.style.display = "none";
  }
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function checkOverdueBooks() {
  const today = new Date();
  const overdueBooks = borrowedBooks.filter(
    (book) => new Date(book.dueDate) < today
  );

  if (overdueBooks.length > 0) {
    showNotification(
      `You have ${overdueBooks.length} overdue book${
        overdueBooks.length > 1 ? "s" : ""
      }!`,
      "warning"
    );
  }
}

function handleEditProfile() {
  showNotification("Profile editing feature coming soon!", "warning");
}

function handleChangePassword() {
  showNotification("Password change feature coming soon!", "warning");
}

function handleExportData() {
  const userData = {
    user: currentUser,
    borrowedBooks,
    readingHistory,
    exportDate: new Date().toISOString(),
  };

  const dataStr = JSON.stringify(userData, null, 2);
  const dataBlob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(dataBlob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `library-data-${currentUser.username}-${
    new Date().toISOString().split("T")[0]
  }.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  showNotification("Your data has been exported successfully!", "success");
}

function saveUserPreferences() {
  const preferences = {
    lastGenreFilter: genreFilter ? genreFilter.value : "",
    lastSearchQuery: searchInput ? searchInput.value : "",
    lastAvailabilityFilter: availabilityFilter ? availabilityFilter.value : "",
  };

  localStorage.setItem("userPreferences", JSON.stringify(preferences));
}

function loadUserPreferences() {
  const preferences = JSON.parse(
    localStorage.getItem("userPreferences") || "{}"
  );

  if (preferences.lastGenreFilter && genreFilter) {
    genreFilter.value = preferences.lastGenreFilter;
  }
  if (preferences.lastSearchQuery && searchInput) {
    searchInput.value = preferences.lastSearchQuery;
  }
  if (preferences.lastAvailabilityFilter && availabilityFilter) {
    availabilityFilter.value = preferences.lastAvailabilityFilter;
  }
}

document.addEventListener("keydown", function (e) {
  if ((e.ctrlKey || e.metaKey) && e.key === "k") {
    e.preventDefault();
    if (searchInput) {
      searchInput.focus();
      switchToSection("browse");
    }
  }

  if (e.key === "Escape") {
    closeModal();
    hideNotification();
  }

  if ((e.ctrlKey || e.metaKey) && e.key >= "1" && e.key <= "4") {
    e.preventDefault();
    const sections = ["home", "browse", "my-books", "profile"];
    const sectionIndex = parseInt(e.key) - 1;
    if (sections[sectionIndex]) {
      switchToSection(sections[sectionIndex]);
    }
  }
});

window.addEventListener("resize", function () {
  if (window.innerWidth > 1024 && sidebar) {
    sidebar.classList.remove("open");
  }
});

let sessionTimeout;
let warningTimeout;

function resetSessionTimer() {
  clearTimeout(sessionTimeout);
  clearTimeout(warningTimeout);

  warningTimeout = setTimeout(() => {
    if (
      confirm(
        "Your session will expire in 5 minutes. Would you like to continue?"
      )
    ) {
      resetSessionTimer();
    }
  }, 25 * 60 * 1000);

  sessionTimeout = setTimeout(() => {
    alert("Session expired. Please login again.");
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
  }, 30 * 60 * 1000);
}

document.addEventListener("click", resetSessionTimer);
document.addEventListener("keypress", resetSessionTimer);
document.addEventListener("scroll", resetSessionTimer);

resetSessionTimer();

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

const debouncedSearch = debounce(handleSearch, 300);
if (searchInput) {
  searchInput.removeEventListener("input", handleSearch);
  searchInput.addEventListener("input", debouncedSearch);
}

function addModalStyles() {
  const style = document.createElement("style");
  style.textContent = `
        .book-detail-header {
            display: flex;
            gap: 1.5rem;
            margin-bottom: 2rem;
        }

        .book-cover-large {
            width: 120px;
            height: 160px;
            background: linear-gradient(135deg, var(--primary-blue), var(--dark-blue));
            border-radius: var(--radius);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 2rem;
            flex-shrink: 0;
        }

        .book-detail-info h2 {
            margin-bottom: 0.5rem;
            color: var(--text-primary);
        }

        .book-author {
            color: var(--text-secondary);
            margin-bottom: 1rem;
        }

        .book-genre-tag {
            background: #f1f5f9;
            color: var(--text-secondary);
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            font-size: 0.75rem;
            font-weight: 500;
            margin-bottom: 1rem;
            display: inline-block;
        }

        .book-availability {
            margin-top: 1rem;
        }

        .book-details-grid {
            display: grid;
            gap: 2rem;
            margin-bottom: 2rem;
        }

        .detail-section h3 {
            margin-bottom: 1rem;
            color: var(--text-primary);
            font-size: 1.125rem;
        }

        .detail-list {
            display: grid;
            gap: 0.75rem;
        }

        .detail-item {
            display: flex;
            justify-content: space-between;
            padding: 0.5rem 0;
            border-bottom: 1px solid var(--border-light);
        }

        .detail-item:last-child {
            border-bottom: none;
        }

        .detail-item .label {
            font-weight: 500;
            color: var(--text-secondary);
        }

        .detail-item .value {
            color: var(--text-primary);
        }

        .book-description {
            color: var(--text-secondary);
            line-height: 1.6;
        }

        .modal-actions {
            display: flex;
            gap: 1rem;
            align-items: center;
            flex-wrap: wrap;
        }

        .availability-note {
            color: var(--text-muted);
            font-size: 0.875rem;
            font-style: italic;
        }

        @media (max-width: 768px) {
            .book-detail-header {
                flex-direction: column;
                text-align: center;
            }
            
            .book-cover-large {
                align-self: center;
            }
            
            .modal-actions {
                flex-direction: column;
                align-items: stretch;
            }
        }
    `;

  if (!document.querySelector("#modal-styles")) {
    style.id = "modal-styles";
    document.head.appendChild(style);
  }
}

addModalStyles();

function getRecommendedBooks() {
  if (readingHistory.length === 0) return [];

  const readGenres = readingHistory
    .map((book) => {
      const fullBook = sampleBooks.find((b) => b.title === book.title);
      return fullBook ? fullBook.genre : null;
    })
    .filter(Boolean);

  if (readGenres.length === 0) return [];

  const genreCount = {};
  readGenres.forEach((genre) => {
    genreCount[genre] = (genreCount[genre] || 0) + 1;
  });

  const favoriteGenre = Object.keys(genreCount).reduce((a, b) =>
    genreCount[a] > genreCount[b] ? a : b
  );

  return sampleBooks
    .filter(
      (book) =>
        book.available &&
        book.genre === favoriteGenre &&
        !borrowedBooks.some((borrowed) => borrowed.id === book.id) &&
        !readingHistory.some((read) => read.id === book.id)
    )
    .slice(0, 3);
}

function calculateBookStats() {
  const stats = {
    totalBooks: sampleBooks.length,
    availableBooks: sampleBooks.filter((book) => book.available).length,
    borrowedBooks: borrowedBooks.length,
    readBooks: readingHistory.length,
    overdueBooks: borrowedBooks.filter(
      (book) => new Date(book.dueDate) < new Date()
    ).length,
    favoriteGenre: getFavoriteGenre(),
    averageReadingTime: calculateAverageReadingTime(),
  };

  return stats;
}

function getFavoriteGenre() {
  if (readingHistory.length === 0) return "Fiction";

  const genreCounts = {};
  readingHistory.forEach((book) => {
    const fullBook = sampleBooks.find((b) => b.title === book.title);
    if (fullBook) {
      genreCounts[fullBook.genre] = (genreCounts[fullBook.genre] || 0) + 1;
    }
  });

  return Object.keys(genreCounts).reduce(
    (a, b) => (genreCounts[a] > genreCounts[b] ? a : b),
    "Fiction"
  );
}

function calculateAverageReadingTime() {
  if (readingHistory.length === 0) return 0;

  const totalDays = readingHistory.reduce((total, book) => {
    const borrowDate = new Date(book.borrowDate);
    const returnDate = new Date(book.returnDate);
    const days = Math.ceil((returnDate - borrowDate) / (1000 * 60 * 60 * 24));
    return total + days;
  }, 0);

  return Math.round(totalDays / readingHistory.length);
}

function updateEnhancedStats() {
  const stats = calculateBookStats();
  const favoriteGenreEl = document.querySelector(".stat-value:last-child");
  if (favoriteGenreEl) {
    favoriteGenreEl.textContent = stats.favoriteGenre;
  }
}

setTimeout(updateEnhancedStats, 100);

window.handleBorrowBook = handleBorrowBook;
window.handleReturnBook = handleReturnBook;
window.renewBook = renewBook;
window.handleBorrowAgain = handleBorrowAgain;

if (typeof window !== "undefined" && window.location.hostname === "localhost") {
  window.debugLibrary = {
    currentUser,
    sampleBooks,
    borrowedBooks,
    readingHistory,
    stats: calculateBookStats(),
    resetData: function () {
      localStorage.clear();
      location.reload();
    },
  };

  console.log("Library Debug Tools available at window.debugLibrary");
}
