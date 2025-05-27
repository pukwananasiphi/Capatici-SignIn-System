        // Global variables
        let html5QrCode = null;

        // DOM Elements - Desktop
        const desktopLoginForm = document.getElementById('desktop-login-form');
        const desktopLoginButton = document.getElementById('desktop-login-button');
        const desktopSpinner = document.getElementById('desktop-spinner');
        const desktopButtonText = document.getElementById('desktop-button-text');

        // DOM Elements - Mobile
        const mobileButtons = document.getElementById('mobile-buttons');
        const mobileLoginButton = document.getElementById('mobile-login-button');
        const mobileScanButton = document.getElementById('mobile-scan-button');
        const mobileLoginForm = document.getElementById('mobile-login-form');
        const backFromLoginButton = document.getElementById('back-from-login');
        const mobileLoginFormElement = document.getElementById('mobile-login-form-element');
        const mobileSubmitButton = document.getElementById('mobile-submit-button');
        const mobileSpinner = document.getElementById('mobile-spinner');
        const mobileButtonText = document.getElementById('mobile-button-text');

        // DOM Elements - Scan
        const scanScreen = document.getElementById('scan-screen');
        const backFromScanButton = document.getElementById('back-from-scan');
        const qrReader = document.getElementById('qr-reader');
        const scanButton = document.getElementById('scan-button');

        // Toast notification system
        const createToast = ({ title, description, variant = 'success' }) => {
            // Create toast container
            const toastContainer = document.createElement('div');
            toastContainer.className = `toast-container ${variant === 'destructive' ? 'toast-error' : 'toast-success'}`;
            
            // Create toast content
            toastContainer.innerHTML = `
                <div class="toast-title">${title}</div>
                <div class="toast-description">${description}</div>
            `;
            
            // Add to document
            document.body.appendChild(toastContainer);
            
            // Remove toast after 3 seconds
            setTimeout(() => {
                if (document.body.contains(toastContainer)) {
                    document.body.removeChild(toastContainer);
                }
            }, 3000);
        };

        // Desktop login form handler
       desktopLoginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = e.target.elements.email.value;
    const password = e.target.elements.password.value;
    
    if (!email || !password) {
        createToast({
            title: "Error",
            description: "Please enter both email and password",
            variant: "destructive"
        });
        return;
    }
    
    // Show loading state
    desktopLoginButton.disabled = true;
    desktopSpinner.style.display = 'inline-block';
    desktopButtonText.textContent = 'Logging in...';
    
    // Simulate API call delay
    setTimeout(() => {
        // Reset loading state
        desktopLoginButton.disabled = false;
        desktopSpinner.style.display = 'none';
        desktopButtonText.textContent = 'Login';
        
        // Check if admin credentials
        if (email === 'admin@capaciti.org.za' && password === 'Password') {
            createToast({
                title: "Admin Login Success",
                description: "Welcome Admin! Redirecting to dashboard..."
            });
            // Redirect to admin dashboard
            setTimeout(() => {
                window.location.href = "AdminDashboard.html";
            }, 1500);
        } else {
            createToast({
                title: "Login Success",
                description: "Welcome! Redirecting to face capture..."
            });
            // Redirect to facial capture
            setTimeout(() => {
                window.location.href = "facial-capture.html";
            }, 1500);
        }
    }, 1000);
});

        // Mobile login button handler
        mobileLoginButton.addEventListener('click', () => {
            mobileLoginForm.style.display = 'block';
            mobileButtons.style.display = 'none';
        });

        // Mobile scan button handler
        mobileScanButton.addEventListener('click', () => {
            scanScreen.style.display = 'block';
            mobileButtons.style.display = 'none';
            
            // Small delay to ensure DOM is ready
            setTimeout(() => {
                startQrScanner();
            }, 100);
        });

        // Back button from login handler
        backFromLoginButton.addEventListener('click', (e) => {
            e.preventDefault();
            mobileLoginForm.style.display = 'none';
            mobileButtons.style.display = 'flex';
        });

        // Back button from scan handler
        backFromScanButton.addEventListener('click', (e) => {
            e.preventDefault();
            
            if (html5QrCode) {
                html5QrCode.stop().then(() => {
                    html5QrCode = null;
                    scanScreen.style.display = 'none';
                    mobileButtons.style.display = 'flex';
                }).catch(() => {
                    scanScreen.style.display = 'none';
                    mobileButtons.style.display = 'flex';
                });
            } else {
                scanScreen.style.display = 'none';
                mobileButtons.style.display = 'flex';
            }
        });

        // Mobile login form handler
        mobileLoginFormElement.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = e.target.elements.mobileEmail.value;
    const password = e.target.elements.mobilePassword.value;
    
    if (!email || !password) {
        createToast({
            title: "Error",
            description: "Please enter both email and password",
            variant: "destructive"
        });
        return;
    }
    
    // Show loading state
    mobileSubmitButton.disabled = true;
    mobileSpinner.style.display = 'inline-block';
    mobileButtonText.textContent = 'Logging in...';
    
    // Simulate API call delay
    setTimeout(() => {
        // Reset loading state
        mobileSubmitButton.disabled = false;
        mobileSpinner.style.display = 'none';
        mobileButtonText.textContent = 'Login';
        
        // Check if admin credentials
        if (email === 'admin@capaciti.org.za' && password === 'Password') {
            createToast({
                title: "Admin Login Success",
                description: "Welcome Admin! Redirecting to dashboard..."
            });
            // Redirect to admin dashboard
            setTimeout(() => {
                window.location.href = "AdminDashboard.html";
            }, 1500);
        } else {
            createToast({
                title: "Login Success",
                description: "Welcome! Redirecting to face capture..."
            });
            // Redirect to facial capture
            setTimeout(() => {
                window.location.href = "facial-capture.html";
            }, 1500);
        }
    }, 1000);
});

        // QR Scanner functionality
        function startQrScanner() {
            if (!Html5Qrcode || !qrReader) return;
            
            Html5Qrcode.getCameras().then(devices => {
                if (devices && devices.length) {
                    const cameraId = devices[0].id;
                    html5QrCode = new Html5Qrcode("qr-reader");
                    html5QrCode.start(
                        cameraId,
                        {
                            fps: 10,
                            qrbox: 200
                        },
                        qrCodeMessage => {
                            createToast({
                                title: "QR Code Detected",
                                description: `Code: ${qrCodeMessage}`
                            });
                            
                            if (html5QrCode) {
                                html5QrCode.stop().then(() => {
                                    html5QrCode = null;
                                    scanScreen.style.display = 'none';
                                    mobileButtons.style.display = 'flex';
                                });
                            }
                        },
                        errorMessage => {
                            // You can log scanning errors here if needed
                            console.error("QR scanning error:", errorMessage);
                        }
                    ).catch(err => {
                        console.error("QR code scanner error:", err);
                    });
                }
            }).catch(err => {
                console.error("Camera initialization failed: ", err);
                createToast({
                    title: "Camera Error",
                    description: "Failed to initialize camera",
                    variant: "destructive"
                });
            });
        }

        // Scan button click handler
        scanButton.addEventListener('click', () => {
            // This could be used to restart scanning if needed
            if (html5QrCode) {
                html5QrCode.stop().then(() => {
                    startQrScanner();
                });
            } else {
                startQrScanner();
            }
        });

        // Mobile login form handler (for the form itself)
       function handleMobileLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('mobileEmail').value;
    const password = document.getElementById('mobilePassword').value;
    
    if (!email || !password) {
        createToast({
            title: "Error",
            description: "Please enter both email and password",
            variant: "destructive"
        });
        return;
    }
    
    // Show loading state
    mobileSubmitButton.disabled = true;
    mobileSpinner.style.display = 'inline-block';
    mobileButtonText.textContent = 'Logging in...';
    
    // Simulate API call delay
    setTimeout(() => {
        // Reset loading state
        mobileSubmitButton.disabled = false;
        mobileSpinner.style.display = 'none';
        mobileButtonText.textContent = 'Login';
        
        // Check if admin credentials
        if (email === 'admin@gmail.com' && password === 'password') {
            createToast({
                title: "Admin Login Success",
                description: "Welcome Admin! Redirecting to dashboard..."
            });
            // Redirect to admin dashboard
            setTimeout(() => {
                window.location.href = "AdminDashboard.html";
            }, 1500);
        } else {
            createToast({
                title: "Login Success",
                description: "Welcome! Redirecting to face capture..."
            });
            // Redirect to facial capture
            setTimeout(() => {
                window.location.href = "facial-capture.html";
            }, 1500);
        }
    }, 1000);
}