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
const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll(".section");
const searchInput = document.getElementById("search-input");
const genreFilter = document.getElementById("genre-filter");
const booksGrid = document.getElementById("books-grid");
const borrowedBooksList = document.getElementById("borrowed-books-list");
const historyBooksList = document.getElementById("history-books-list");
const tabBtns = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");
const modal = document.getElementById("book-modal");
const modalContent = document.getElementById("modal-book-details");
const closeBtn = document.querySelector(".close");
const logoutBtn = document.getElementById("logout-btn");
const actionCards = document.querySelectorAll(".action-card");
const notification = document.getElementById("notification");
const notificationMessage = document.getElementById("notification-message");
const closeNotification = document.getElementById("close-notification");

// Current user
let currentUser = null;

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

  // Event listeners
  navLinks.forEach((link) => link.addEventListener("click", handleNavigation));
  searchInput.addEventListener("input", handleSearch);
  genreFilter.addEventListener("change", handleFilter);
  tabBtns.forEach((btn) => btn.addEventListener("click", handleTabSwitch));
  closeBtn.addEventListener("click", closeModal);
  window.addEventListener("click", outsideModalClick);
  logoutBtn.addEventListener("click", handleLogout);
  actionCards.forEach((card) =>
    card.addEventListener("click", handleQuickAction)
  );
  closeNotification.addEventListener("click", hideNotification);
});

// Get current user from localStorage
function getCurrentUser() {
  return JSON.parse(localStorage.getItem("currentUser") || "null");
}

// Update user information in UI
function updateUserInfo() {
  const userName = document.getElementById("user-name");
  const profileName = document.getElementById("profile-name");
  const userEmail = document.getElementById("user-email");
  const memberId = document.getElementById("member-id");

  if (currentUser) {
    userName.textContent = currentUser.name;
    profileName.textContent = currentUser.name;
    userEmail.textContent = currentUser.username + "@library.com";
    memberId.textContent = "LIB" + String(Math.random()).slice(2, 5);
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
  const targetId = e.target.getAttribute("href").substring(1);
  switchToSection(targetId);
}

// Switch to specific section
function switchToSection(sectionId) {
  // Update active nav link
  navLinks.forEach((link) => link.classList.remove("active"));
  document.querySelector(`a[href="#${sectionId}"]`).classList.add("active");

  // Update active section
  sections.forEach((section) => section.classList.remove("active"));
  document.getElementById(sectionId).classList.add("active");
}

// Handle quick actions
function handleQuickAction(e) {
  const action = e.currentTarget.getAttribute("data-action");
  switchToSection(action);
}

// Update statistics
function updateStats() {
  const totalBooks = sampleBooks.length;
  const availableBooks = sampleBooks.filter((book) => book.available).length;
  const borrowedBooksCount = borrowedBooks.length;

  document.getElementById("total-books").textContent = totalBooks;
  document.getElementById("available-books").textContent = availableBooks;
  document.getElementById("borrowed-books").textContent = borrowedBooksCount;

  // Update profile stats
  document.getElementById("books-read").textContent = readingHistory.length;
  document.getElementById("current-borrowed").textContent = borrowedBooksCount;

  // Calculate overdue books
  const today = new Date();
  const overdueCount = borrowedBooks.filter(
    (book) => new Date(book.dueDate) < today
  ).length;
  document.getElementById("overdue-books").textContent = overdueCount;
}

// Render books in grid
function renderBooks(books) {
  booksGrid.innerHTML = "";

  if (books.length === 0) {
    booksGrid.innerHTML =
      '<p class="no-results">No books found matching your criteria.</p>';
    return;
  }

  books.forEach((book) => {
    const bookCard = document.createElement("div");
    bookCard.className = "book-card";
    bookCard.innerHTML = `
            <div class="book-cover">📖</div>
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
                            ${book.available ? "" : "disabled"}
                            onclick="handleBorrowBook(${book.id})">
                        ${book.available ? "Borrow" : "Unavailable"}
                    </button>
                </div>
            </div>
        `;

    bookCard.addEventListener("click", (e) => {
      // Don't show modal if button was clicked
      if (!e.target.classList.contains("btn")) {
        showBookDetails(book);
      }
    });

    booksGrid.appendChild(bookCard);
  });
}

// Handle book borrowing
function handleBorrowBook(bookId) {
  const book = sampleBooks.find((b) => b.id === bookId);
  if (!book || !book.available) return;

  // Check if user already has 3 books borrowed
  if (borrowedBooks.length >= 3) {
    showNotification("You can only borrow up to 3 books at a time!", "warning");
    return;
  }

  // Add to borrowed books
  const borrowDate = new Date();
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 14); // 2 weeks loan period

  borrowedBooks.push({
    id: book.id,
    title: book.title,
    author: book.author,
    borrowDate: borrowDate.toISOString().split("T")[0],
    dueDate: dueDate.toISOString().split("T")[0],
  });

  // Mark book as unavailable
  book.available = false;

  // Update UI
  updateStats();
  renderBooks(getFilteredBooks());
  renderBorrowedBooks();

  showNotification(
    `"${book.title}" has been borrowed successfully!`,
    "success"
  );
}

// Handle book return
function handleReturnBook(bookId) {
  const borrowedBookIndex = borrowedBooks.findIndex((b) => b.id === bookId);
  const borrowedBook = borrowedBooks[borrowedBookIndex];

  if (!borrowedBook) return;

  // Remove from borrowed books
  borrowedBooks.splice(borrowedBookIndex, 1);

  // Add to reading history
  readingHistory.unshift({
    id: borrowedBook.id,
    title: borrowedBook.title,
    author: borrowedBook.author,
    borrowDate: borrowedBook.borrowDate,
    returnDate: new Date().toISOString().split("T")[0],
  });

  // Mark book as available
  const book = sampleBooks.find((b) => b.id === bookId);
  if (book) {
    book.available = true;
  }

  // Update UI
  updateStats();
  renderBooks(getFilteredBooks());
  renderBorrowedBooks();
  renderReadingHistory();

  showNotification(
    `"${borrowedBook.title}" has been returned successfully!`,
    "success"
  );
}

// Show book details in modal
function showBookDetails(book) {
  modalContent.innerHTML = `
        <h2>${book.title}</h2>
        <p><strong>Author:</strong> ${book.author}</p>
        <p><strong>Genre:</strong> ${book.genre}</p>
        <p><strong>ISBN:</strong> ${book.isbn}</p>
        <p><strong>Status:</strong> <span class="status-badge ${
          book.available ? "available" : "borrowed"
        }">
            ${book.available ? "Available" : "Borrowed"}
        </span></p>
        <p><strong>Description:</strong></p>
        <p>${book.description}</p>
        <div style="margin-top: 2rem;">
            <button class="btn ${
              book.available ? "btn-primary" : "btn-secondary"
            }" 
                    ${book.available ? "" : "disabled"}
                    onclick="handleBorrowBook(${book.id}); closeModal();">
                ${book.available ? "Borrow Book" : "Currently Unavailable"}
            </button>
        </div>
    `;
  modal.style.display = "block";
}

// Close modal
function closeModal() {
  modal.style.display = "none";
}

// Close modal when clicking outside
function outsideModalClick(e) {
  if (e.target === modal) {
    closeModal();
  }
}

// Handle search
function handleSearch() {
  const filteredBooks = getFilteredBooks();
  renderBooks(filteredBooks);
}

// Handle genre filter
function handleFilter() {
  const filteredBooks = getFilteredBooks();
  renderBooks(filteredBooks);
}

// Get filtered books based on search and genre
function getFilteredBooks() {
  const query = searchInput.value.toLowerCase();
  const genre = genreFilter.value;

  return sampleBooks.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query) ||
      book.genre.toLowerCase().includes(query);
    const matchesGenre = !genre || book.genre === genre;
    return matchesSearch && matchesGenre;
  });
}

// Handle tab switching
function handleTabSwitch(e) {
  const targetTab = e.target.getAttribute("data-tab");

  // Update active tab button
  tabBtns.forEach((btn) => btn.classList.remove("active"));
  e.target.classList.add("active");

  // Update active tab content
  tabContents.forEach((content) => content.classList.remove("active"));
  document.getElementById(targetTab).classList.add("active");
}

// Render borrowed books
function renderBorrowedBooks() {
  borrowedBooksList.innerHTML = "";

  if (borrowedBooks.length === 0) {
    borrowedBooksList.innerHTML = "<p>No books currently borrowed.</p>";
    return;
  }

  borrowedBooks.forEach((book) => {
    const bookItem = document.createElement("div");
    bookItem.className = "book-item";

    const today = new Date();
    const dueDate = new Date(book.dueDate);
    const isOverdue = dueDate < today;
    const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

    bookItem.innerHTML = `
            <div class="book-item-info">
                <h4>${book.title}</h4>
                <p class="author">by ${book.author}</p>
                <p class="${isOverdue ? "overdue" : "due-date"}">
                    ${
                      isOverdue
                        ? "Overdue!"
                        : `Due: ${dueDate.toLocaleDateString()}`
                    }
                    ${
                      !isOverdue && daysUntilDue <= 3
                        ? ` (${daysUntilDue} days left)`
                        : ""
                    }
                </p>
            </div>
            <div>
                <button class="btn btn-secondary" onclick="handleReturnBook(${
                  book.id
                })">
                    Return Book
                </button>
            </div>
        `;
    borrowedBooksList.appendChild(bookItem);
  });
}

// Render reading history
function renderReadingHistory() {
  historyBooksList.innerHTML = "";

  if (readingHistory.length === 0) {
    historyBooksList.innerHTML = "<p>No reading history available.</p>";
    return;
  }

  readingHistory.forEach((book) => {
    const bookItem = document.createElement("div");
    bookItem.className = "book-item";
    bookItem.innerHTML = `
            <div class="book-item-info">
                <h4>${book.title}</h4>
                <p class="author">by ${book.author}</p>
                <p>Returned: ${new Date(
                  book.returnDate
                ).toLocaleDateString()}</p>
            </div>
            <div>
                <button class="btn btn-primary" onclick="handleBorrowAgain(${
                  book.id
                })">
                    Borrow Again
                </button>
            </div>
        `;
    historyBooksList.appendChild(bookItem);
  });
}

// Handle borrow again
function handleBorrowAgain(bookId) {
  const book = sampleBooks.find((b) => b.id === bookId);
  if (book && book.available) {
    handleBorrowBook(bookId);
  } else if (book) {
    showNotification(`"${book.title}" is currently unavailable.`, "warning");
  }
}

// Show notification
function showNotification(message, type = "success") {
  notificationMessage.textContent = message;
  notification.className = `notification ${type}`;
  notification.style.display = "flex";

  // Auto hide after 5 seconds
  setTimeout(() => {
    hideNotification();
  }, 5000);
}

// Hide notification
function hideNotification() {
  notification.style.display = "none";
}

// Profile management functions
document.addEventListener("DOMContentLoaded", function () {
  const editProfileBtn = document.getElementById("edit-profile");
  const changePasswordBtn = document.getElementById("change-password");

  if (editProfileBtn) {
    editProfileBtn.addEventListener("click", handleEditProfile);
  }

  if (changePasswordBtn) {
    changePasswordBtn.addEventListener("click", handleChangePassword);
  }
});

// Handle edit profile
function handleEditProfile() {
  showNotification("Profile editing feature coming soon!", "info");
}

// Handle change password
function handleChangePassword() {
  showNotification("Password change feature coming soon!", "info");
}

// Utility function to format date
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Check for overdue books and show notifications
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

// Auto-save user preferences
function saveUserPreferences() {
  const preferences = {
    lastGenreFilter: genreFilter.value,
    lastSearchQuery: searchInput.value,
    lastActiveSection: document.querySelector(".section.active").id,
  };

  localStorage.setItem("userPreferences", JSON.stringify(preferences));
}

// Load user preferences
function loadUserPreferences() {
  const preferences = JSON.parse(
    localStorage.getItem("userPreferences") || "{}"
  );

  if (preferences.lastGenreFilter) {
    genreFilter.value = preferences.lastGenreFilter;
  }

  if (preferences.lastSearchQuery) {
    searchInput.value = preferences.lastSearchQuery;
  }
}

// Add keyboard shortcuts
document.addEventListener("keydown", function (e) {
  // Ctrl/Cmd + K to focus search
  if ((e.ctrlKey || e.metaKey) && e.key === "k") {
    e.preventDefault();
    searchInput.focus();
    switchToSection("browse");
  }

  // Escape to close modal
  if (e.key === "Escape") {
    closeModal();
    hideNotification();
  }

  // Ctrl/Cmd + 1-4 for navigation
  if ((e.ctrlKey || e.metaKey) && e.key >= "1" && e.key <= "4") {
    e.preventDefault();
    const sections = ["home", "browse", "my-books", "profile"];
    const sectionIndex = parseInt(e.key) - 1;
    if (sections[sectionIndex]) {
      switchToSection(sections[sectionIndex]);
    }
  }
});

// Initialize preferences and check for overdue books when page loads
document.addEventListener("DOMContentLoaded", function () {
  loadUserPreferences();

  // Check for overdue books after a short delay
  setTimeout(() => {
    checkOverdueBooks();
  }, 2000);

  // Save preferences when leaving the page
  window.addEventListener("beforeunload", saveUserPreferences);
});

// Add search suggestions
function showSearchSuggestions(query) {
  if (!query || query.length < 2) return;

  const suggestions = sampleBooks
    .filter(
      (book) =>
        book.title.toLowerCase().includes(query.toLowerCase()) ||
        book.author.toLowerCase().includes(query.toLowerCase())
    )
    .slice(0, 5)
    .map((book) => `${book.title} by ${book.author}`);

  // This would typically show a dropdown with suggestions
  // Implementation depends on UI requirements
}

// Book recommendation system (simple)
function getRecommendedBooks() {
  // Get user's reading history genres
  const readGenres = readingHistory
    .map((book) => {
      const fullBook = sampleBooks.find((b) => b.title === book.title);
      return fullBook ? fullBook.genre : null;
    })
    .filter(Boolean);

  // Find most common genre
  const genreCount = {};
  readGenres.forEach((genre) => {
    genreCount[genre] = (genreCount[genre] || 0) + 1;
  });

  const favoriteGenre = Object.keys(genreCount).reduce(
    (a, b) => (genreCount[a] > genreCount[b] ? a : b),
    Object.keys(genreCount)[0]
  );

  // Return available books in favorite genre
  return sampleBooks
    .filter(
      (book) =>
        book.available &&
        book.genre === favoriteGenre &&
        !borrowedBooks.some((borrowed) => borrowed.id === book.id)
    )
    .slice(0, 3);
}

// Enhanced book card rendering with recommendations
function renderBooksWithRecommendations(books) {
  renderBooks(books);

  // Add recommendations section if on home page and no search/filter active
  if (
    document.getElementById("home").classList.contains("active") &&
    !searchInput.value &&
    !genreFilter.value
  ) {
    const recommendations = getRecommendedBooks();
    if (recommendations.length > 0) {
      const recommendationsSection = document.createElement("div");
      recommendationsSection.className = "recommendations-section";
      recommendationsSection.innerHTML = `
                <h3>Recommended for You</h3>
                <div class="recommendations-grid">
                    ${recommendations
                      .map(
                        (book) => `
                        <div class="recommendation-card" onclick="showBookDetails(${JSON.stringify(
                          book
                        ).replace(/"/g, "&quot;")})">
                            <h4>${book.title}</h4>
                            <p>by ${book.author}</p>
                            <span class="genre-tag">${book.genre}</span>
                        </div>
                    `
                      )
                      .join("")}
                </div>
            `;

      // Insert after stats section
      const statsSection = document.querySelector(".stats");
      statsSection.parentNode.insertBefore(
        recommendationsSection,
        statsSection.nextSibling
      );
    }
  }
}

// Session timeout warning
let sessionTimeout;
let warningTimeout;

function resetSessionTimer() {
  clearTimeout(sessionTimeout);
  clearTimeout(warningTimeout);

  // Show warning after 25 minutes
  warningTimeout = setTimeout(() => {
    if (
      confirm(
        "Your session will expire in 5 minutes. Would you like to continue?"
      )
    ) {
      resetSessionTimer();
    }
  }, 25 * 60 * 1000);

  // Auto logout after 30 minutes
  sessionTimeout = setTimeout(() => {
    alert("Session expired. Please login again.");
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
  }, 30 * 60 * 1000);
}

// Reset timer on user activity
document.addEventListener("click", resetSessionTimer);
document.addEventListener("keypress", resetSessionTimer);
document.addEventListener("scroll", resetSessionTimer);

// Initialize session timer
resetSessionTimer();
