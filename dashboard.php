<?php
require_once 'config.php';

if (!isset($_SESSION['user_id'])) {
    header('Location: login.php');
    exit();
}

$user_id = $_SESSION['user_id'];
$user_name = $_SESSION['name'];
$user_role = $_SESSION['role'];

$total_books = mysqli_fetch_assoc(mysqli_query($conn, "SELECT COUNT(*) as count FROM books"))['count'];
$available_books = mysqli_fetch_assoc(mysqli_query($conn, "SELECT COUNT(*) as count FROM books WHERE available = 1"))['count'];
$borrowed_count = mysqli_fetch_assoc(mysqli_query($conn, "SELECT COUNT(*) as count FROM borrowed_books WHERE user_id = $user_id AND return_date IS NULL"))['count'];
$total_users = mysqli_fetch_assoc(mysqli_query($conn, "SELECT COUNT(*) as count FROM users"))['count'];
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - City Library</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; background: #f5f5f5; }
        .navbar { background: #667eea; color: white; padding: 15px 30px; display: flex; justify-content: space-between; align-items: center; }
        .navbar h1 { font-size: 24px; }
        .navbar .user-info { display: flex; align-items: center; gap: 15px; }
        .navbar .role-badge { background: #764ba2; padding: 5px 10px; border-radius: 5px; font-size: 12px; }
        .navbar button { background: #764ba2; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; }
        .container { max-width: 1200px; margin: 30px auto; padding: 0 20px; }
        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .stat-card { background: white; padding: 25px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .stat-card h3 { font-size: 32px; color: #667eea; margin-bottom: 10px; }
        .stat-card p { color: #666; }
        .section { background: white; padding: 25px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); margin-bottom: 20px; }
        .section h2 { margin-bottom: 20px; color: #333; }
        .books-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px; }
        .book-card { border: 1px solid #ddd; border-radius: 8px; padding: 15px; transition: transform 0.2s; position: relative; }
        .book-card:hover { transform: translateY(-5px); box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
        .book-card h3 { color: #333; margin-bottom: 10px; font-size: 18px; }
        .book-card p { color: #666; font-size: 14px; margin-bottom: 5px; }
        .badge { display: inline-block; padding: 5px 10px; border-radius: 5px; font-size: 12px; font-weight: bold; margin: 10px 0; }
        .badge.available { background: #c6f6d5; color: #22543d; }
        .badge.borrowed { background: #fed7d7; color: #742a2a; }
        button.btn { background: #667eea; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer; margin-top: 10px; margin-right: 5px; }
        button.btn:hover { background: #5568d3; }
        button.btn:disabled { background: #ccc; cursor: not-allowed; }
        button.btn-danger { background: #e53e3e; }
        button.btn-danger:hover { background: #c53030; }
        button.btn-success { background: #48bb78; }
        button.btn-success:hover { background: #38a169; }
        .tabs { display: flex; gap: 10px; margin-bottom: 20px; border-bottom: 2px solid #ddd; flex-wrap: wrap; }
        .tabs button { background: none; border: none; padding: 10px 20px; cursor: pointer; font-size: 16px; color: #666; border-bottom: 2px solid transparent; margin-bottom: -2px; }
        .tabs button.active { color: #667eea; border-bottom-color: #667eea; font-weight: bold; }
        .tab-content { display: none; }
        .tab-content.active { display: block; }
        table { width: 100%; border-collapse: collapse; }
        table th, table td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
        table th { background: #f8f9fa; font-weight: bold; }
        .search-bar { margin-bottom: 20px; }
        .search-bar input { width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 5px; font-size: 14px; }
        .filter { display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap; }
        .filter select { padding: 10px; border: 1px solid #ddd; border-radius: 5px; }
        .modal { display: none; position: fixed; z-index: 1000; left: 0; top: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); }
        .modal-content { background: white; margin: 50px auto; padding: 30px; width: 90%; max-width: 500px; border-radius: 10px; }
        .modal-content h2 { margin-bottom: 20px; }
        .form-group { margin-bottom: 15px; }
        .form-group label { display: block; margin-bottom: 5px; font-weight: bold; }
        .form-group input, .form-group select, .form-group textarea { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; }
        .form-group textarea { resize: vertical; min-height: 80px; }
        .modal-buttons { display: flex; gap: 10px; margin-top: 20px; }
        .admin-actions { position: absolute; top: 10px; right: 10px; }
    </style>
</head>
<body>
    <div class="navbar">
        <h1>📚 City Library</h1>
        <div class="user-info">
            <span>Welcome, <?php echo $user_name; ?></span>
            <?php if ($user_role == 'admin'): ?>
                <span class="role-badge">ADMIN</span>
            <?php endif; ?>
            <button onclick="logout()">Logout</button>
        </div>
    </div>

    <div class="container">
        <!-- Statistics -->
        <div class="stats">
            <div class="stat-card">
                <h3><?php echo $total_books; ?></h3>
                <p>Total Books</p>
            </div>
            <div class="stat-card">
                <h3><?php echo $available_books; ?></h3>
                <p>Available Books</p>
            </div>
            <div class="stat-card">
                <h3><?php echo $borrowed_count; ?></h3>
                <p>Your Borrowed Books</p>
            </div>
            <?php if ($user_role == 'admin'): ?>
            <div class="stat-card">
                <h3><?php echo $total_users; ?></h3>
                <p>Total Users</p>
            </div>
            <?php endif; ?>
        </div>

        <!-- Tabs -->
        <div class="section">
            <div class="tabs">
                <button class="active" onclick="showTab('browse')">Browse Books</button>
                <button onclick="showTab('mybooks')">My Books</button>
                <?php if ($user_role == 'admin'): ?>
                    <button onclick="showTab('users')">Manage Users</button>
                    <button onclick="showTab('allborrows')">All Borrowed Books</button>
                <?php endif; ?>
            </div>

            <!-- Browse Books Tab -->
            <div id="browse" class="tab-content active">
                <?php if ($user_role == 'admin'): ?>
                    <button class="btn btn-success" onclick="openAddBookModal()" style="margin-bottom: 15px;">➕ Add New Book</button>
                <?php endif; ?>
                
                <div class="search-bar">
                    <input type="text" id="searchInput" placeholder="Search books by title or author..." onkeyup="searchBooks()">
                </div>
                <div class="filter">
                    <select id="genreFilter" onchange="searchBooks()">
                        <option value="">All Genres</option>
                        <option value="Fiction">Fiction</option>
                        <option value="Science Fiction">Science Fiction</option>
                        <option value="Romance">Romance</option>
                        <option value="Mystery">Mystery</option>
                        <option value="Biography">Biography</option>
                    </select>
                    <select id="availFilter" onchange="searchBooks()">
                        <option value="">All Books</option>
                        <option value="1">Available Only</option>
                        <option value="0">Borrowed</option>
                    </select>
                </div>
                <div id="booksGrid" class="books-grid"></div>
            </div>

            <!-- My Books Tab -->
            <div id="mybooks" class="tab-content">
                <table id="myBooksTable">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Author</th>
                            <th>Borrow Date</th>
                            <th>Due Date</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>

            <?php if ($user_role == 'admin'): ?>
            <!-- Users Tab (Admin Only) -->
            <div id="users" class="tab-content">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h2>All Users</h2>
                    <button class="btn btn-success" onclick="openAddUserModal()">➕ Add New User</button>
                </div>
                <table id="usersTable">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Username</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Borrowed Books</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>

            <!-- All Borrowed Books Tab (Admin Only) -->
            <div id="allborrows" class="tab-content">
                <h2>All Borrowed Books</h2>
                <table id="allBorrowsTable">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Book Title</th>
                            <th>Author</th>
                            <th>Borrow Date</th>
                            <th>Due Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>
            <?php endif; ?>
        </div>
    </div>

    <!-- Add Book Modal -->
    <div id="addBookModal" class="modal">
        <div class="modal-content">
            <h2>Add New Book</h2>
            <form id="addBookForm">
                <div class="form-group">
                    <label>Title *</label>
                    <input type="text" name="title" required>
                </div>
                <div class="form-group">
                    <label>Author *</label>
                    <input type="text" name="author" required>
                </div>
                <div class="form-group">
                    <label>Genre *</label>
                    <select name="genre" required>
                        <option value="">Select Genre</option>
                        <option value="Fiction">Fiction</option>
                        <option value="Science Fiction">Science Fiction</option>
                        <option value="Romance">Romance</option>
                        <option value="Mystery">Mystery</option>
                        <option value="Biography">Biography</option>
                        <option value="Non-fiction">Non-fiction</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>ISBN</label>
                    <input type="text" name="isbn">
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea name="description"></textarea>
                </div>
                <div class="modal-buttons">
                    <button type="submit" class="btn btn-success">Add Book</button>
                    <button type="button" class="btn" onclick="closeAddBookModal()">Cancel</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Add User Modal -->
    <div id="addUserModal" class="modal">
        <div class="modal-content">
            <h2>Add New User</h2>
            <form id="addUserForm">
                <div class="form-group">
                    <label>Username *</label>
                    <input type="text" name="username" required>
                </div>
                <div class="form-group">
                    <label>Password *</label>
                    <input type="password" name="password" required>
                </div>
                <div class="form-group">
                    <label>Full Name *</label>
                    <input type="text" name="name" required>
                </div>
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" name="email">
                </div>
                <div class="form-group">
                    <label>Role *</label>
                    <select name="role" required>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <div class="modal-buttons">
                    <button type="submit" class="btn btn-success">Add User</button>
                    <button type="button" class="btn" onclick="closeAddUserModal()">Cancel</button>
                </div>
            </form>
        </div>
    </div>

    <script>
        const isAdmin = <?php echo $user_role == 'admin' ? 'true' : 'false'; ?>;
        
        // Modal functions (define at top for global access)
        function openAddBookModal() {
            document.getElementById('addBookModal').style.display = 'block';
        }

        function closeAddBookModal() {
            document.getElementById('addBookModal').style.display = 'none';
            document.getElementById('addBookForm').reset();
        }

        function openAddUserModal() {
            document.getElementById('addUserModal').style.display = 'block';
        }

        function closeAddUserModal() {
            document.getElementById('addUserModal').style.display = 'none';
            document.getElementById('addUserForm').reset();
        }
        
        // Load books on page load
        loadBooks();
        
        function showTab(tab) {
            document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tabs button').forEach(b => b.classList.remove('active'));
            
            document.getElementById(tab).classList.add('active');
            event.target.classList.add('active');
            
            if (tab === 'mybooks') {
                loadMyBooks();
            } else if (tab === 'users' && isAdmin) {
                loadUsers();
            } else if (tab === 'allborrows' && isAdmin) {
                loadAllBorrows();
            }
        }

        function loadBooks() {
            const search = document.getElementById('searchInput').value;
            const genre = document.getElementById('genreFilter').value;
            const available = document.getElementById('availFilter').value;
            
            fetch(`get_books.php?search=${search}&genre=${genre}&available=${available}`)
                .then(response => response.json())
                .then(data => {
                    const grid = document.getElementById('booksGrid');
                    grid.innerHTML = '';
                    
                    data.forEach(book => {
                        const card = document.createElement('div');
                        card.className = 'book-card';
                        card.innerHTML = `
                            ${isAdmin ? `<div class="admin-actions">
                                <button class="btn btn-danger" onclick="deleteBook(${book.id})" title="Delete Book">🗑️</button>
                            </div>` : ''}
                            <h3>${book.title}</h3>
                            <p><strong>Author:</strong> ${book.author}</p>
                            <p><strong>Genre:</strong> ${book.genre}</p>
                            <p><strong>ISBN:</strong> ${book.isbn || 'N/A'}</p>
                            <span class="badge ${book.available == 1 ? 'available' : 'borrowed'}">
                                ${book.available == 1 ? 'Available' : 'Borrowed'}
                            </span>
                            <br>
                            <button class="btn" onclick="borrowBook(${book.id})" ${book.available == 0 ? 'disabled' : ''}>
                                ${book.available == 1 ? 'Borrow' : 'Not Available'}
                            </button>
                        `;
                        grid.appendChild(card);
                    });
                });
        }

        function searchBooks() {
            loadBooks();
        }

        function borrowBook(bookId) {
            if (confirm('Do you want to borrow this book?')) {
                fetch('borrow_book.php', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    body: `book_id=${bookId}`
                })
                .then(response => response.json())
                .then(data => {
                    alert(data.message);
                    if (data.success) {
                        location.reload();
                    }
                });
            }
        }

        function loadMyBooks() {
            fetch('get_my_books.php')
                .then(response => response.json())
                .then(data => {
                    const tbody = document.querySelector('#myBooksTable tbody');
                    tbody.innerHTML = '';
                    
                    if (data.length === 0) {
                        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center">No borrowed books</td></tr>';
                        return;
                    }
                    
                    data.forEach(book => {
                        const tr = document.createElement('tr');
                        tr.innerHTML = `
                            <td>${book.title}</td>
                            <td>${book.author}</td>
                            <td>${book.borrow_date}</td>
                            <td>${book.due_date}</td>
                            <td><button class="btn" onclick="returnBook(${book.borrow_id})">Return</button></td>
                        `;
                        tbody.appendChild(tr);
                    });
                });
        }

        function returnBook(borrowId) {
            if (confirm('Return this book?')) {
                fetch('return_book.php', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    body: `borrow_id=${borrowId}`
                })
                .then(response => response.json())
                .then(data => {
                    alert(data.message);
                    if (data.success) {
                        location.reload();
                    }
                });
            }
        }

        function loadUsers() {
            fetch('admin_get_users.php')
                .then(response => response.json())
                .then(data => {
                    const tbody = document.querySelector('#usersTable tbody');
                    tbody.innerHTML = '';
                    
                    data.forEach(user => {
                        const tr = document.createElement('tr');
                        tr.innerHTML = `
                            <td>${user.id}</td>
                            <td>${user.username}</td>
                            <td>${user.name}</td>
                            <td>${user.email || 'N/A'}</td>
                            <td>${user.role}</td>
                            <td>${user.borrowed_count}</td>
                            <td>
                                ${user.role !== 'admin' ? `<button class="btn btn-danger" onclick="deleteUser(${user.id})">Delete</button>` : '-'}
                            </td>
                        `;
                        tbody.appendChild(tr);
                    });
                });
        }

        function loadAllBorrows() {
            fetch('admin_get_all_borrows.php')
                .then(response => response.json())
                .then(data => {
                    const tbody = document.querySelector('#allBorrowsTable tbody');
                    tbody.innerHTML = '';
                    
                    if (data.length === 0) {
                        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center">No borrowed books</td></tr>';
                        return;
                    }
                    
                    data.forEach(borrow => {
                        const isOverdue = new Date(borrow.due_date) < new Date();
                        const tr = document.createElement('tr');
                        tr.innerHTML = `
                            <td>${borrow.user_name}</td>
                            <td>${borrow.title}</td>
                            <td>${borrow.author}</td>
                            <td>${borrow.borrow_date}</td>
                            <td>${borrow.due_date}</td>
                            <td style="color: ${isOverdue ? 'red' : 'green'}; font-weight: bold;">
                                ${isOverdue ? '⚠️ OVERDUE' : '✓ Active'}
                            </td>
                        `;
                        tbody.appendChild(tr);
                    });
                });
        }

        function deleteBook(bookId) {
            if (confirm('Are you sure you want to delete this book? This action cannot be undone.')) {
                fetch('admin_delete_book.php', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    body: `book_id=${bookId}`
                })
                .then(response => response.json())
                .then(data => {
                    alert(data.message);
                    if (data.success) {
                        loadBooks();
                        location.reload();
                    }
                });
            }
        }

        function deleteUser(userId) {
            if (confirm('Are you sure you want to delete this user?')) {
                fetch('admin_delete_user.php', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    body: `user_id=${userId}`
                })
                .then(response => response.json())
                .then(data => {
                    alert(data.message);
                    if (data.success) {
                        loadUsers();
                    }
                });
            }
        }

        function openAddBookModal() {
            document.getElementById('addBookModal').style.display = 'block';
        }

        function closeAddBookModal() {
            document.getElementById('addBookModal').style.display = 'none';
            document.getElementById('addBookForm').reset();
        }

        function openAddUserModal() {
            document.getElementById('addUserModal').style.display = 'block';
        }

        function closeAddUserModal() {
            document.getElementById('addUserModal').style.display = 'none';
            document.getElementById('addUserForm').reset();
        }

        document.getElementById('addBookForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            
            fetch('admin_add_book.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                if (data.success) {
                    closeAddBookModal();
                    loadBooks();
                    location.reload();
                }
            });
        });

        document.getElementById('addUserForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            
            fetch('admin_add_user.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                if (data.success) {
                    closeAddUserModal();
                    loadUsers();
                }
            });
        });

        function logout() {
            if (confirm('Are you sure you want to logout?')) {
                window.location.href = 'logout.php';
            }
        }

        // Close modal when clicking outside
        window.onclick = function(event) {
            const bookModal = document.getElementById('addBookModal');
            const userModal = document.getElementById('addUserModal');
            if (event.target == bookModal) {
                closeAddBookModal();
            }
            if (event.target == userModal) {
                closeAddUserModal();
            }
        }
    </script>
</body>
</html>