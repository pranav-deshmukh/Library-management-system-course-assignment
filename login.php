<?php
require_once 'config.php';

// Redirect if already logged in
if (isset($_SESSION['user_id'])) {
    header('Location: dashboard.php');
    exit();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - City Library</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center; }
        .login-container { background: white; padding: 40px; border-radius: 10px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); width: 100%; max-width: 400px; }
        h1 { color: #333; text-align: center; margin-bottom: 10px; }
        p { text-align: center; color: #666; margin-bottom: 30px; }
        .form-group { margin-bottom: 20px; }
        label { display: block; margin-bottom: 5px; color: #333; font-weight: bold; }
        input { width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 5px; font-size: 14px; }
        button { width: 100%; padding: 12px; background: #667eea; color: white; border: none; border-radius: 5px; font-size: 16px; cursor: pointer; margin-top: 10px; }
        button:hover { background: #5568d3; }
        .demo-btn { background: #48bb78; margin-top: 10px; }
        .demo-btn:hover { background: #38a169; }
        .error { background: #fee; color: #c33; padding: 10px; border-radius: 5px; margin-bottom: 15px; display: none; }
        .success { background: #efe; color: #3c3; padding: 10px; border-radius: 5px; margin-bottom: 15px; display: none; }
        .divider { text-align: center; margin: 20px 0; color: #999; }
    </style>
</head>
<body>
    <div class="login-container">
        <h1>📚 City Library</h1>
        <p>Welcome! Please sign in</p>
        
        <div id="error-msg" class="error"></div>
        <div id="success-msg" class="success"></div>
        
        <form id="login-form">
            <div class="form-group">
                <label>Username</label>
                <input type="text" name="username" id="username" required>
            </div>
            <div class="form-group">
                <label>Password</label>
                <input type="password" name="password" id="password" required>
            </div>
            <button type="submit">Sign In</button>
        </form>
        
        <div class="divider">or use demo accounts</div>
        
        <button class="demo-btn" onclick="demoLogin('john.doe', 'user123')">Login as User</button>
        <button class="demo-btn" onclick="demoLogin('admin', 'admin123')">Login as Admin</button>
    </div>

    <script>
        document.getElementById('login-form').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            
            fetch('login_process.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showMessage('Login successful! Redirecting...', 'success');
                    setTimeout(() => {
                        window.location.href = 'dashboard.php';
                    }, 1000);
                } else {
                    showMessage(data.message, 'error');
                }
            })
            .catch(error => {
                showMessage('An error occurred. Please try again.', 'error');
            });
        });
        
        function demoLogin(username, password) {
            document.getElementById('username').value = username;
            document.getElementById('password').value = password;
            document.getElementById('login-form').dispatchEvent(new Event('submit'));
        }
        
        function showMessage(message, type) {
            const errorDiv = document.getElementById('error-msg');
            const successDiv = document.getElementById('success-msg');
            
            errorDiv.style.display = 'none';
            successDiv.style.display = 'none';
            
            if (type === 'error') {
                errorDiv.textContent = message;
                errorDiv.style.display = 'block';
            } else {
                successDiv.textContent = message;
                successDiv.style.display = 'block';
            }
        }
    </script>
</body>
</html>