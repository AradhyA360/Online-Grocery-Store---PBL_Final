// This file will contain common utility functions and data accessible across pages

// --- Mock Data (Using localStorage as a simple "database") ---
// 'registeredCustomers' stores all registered users
window.registeredCustomers =
  JSON.parse(localStorage.getItem("registeredCustomers")) || [];
// 'loggedInCustomer' stores the currently logged-in user's data
window.loggedInCustomer =
  JSON.parse(localStorage.getItem("loggedInCustomer")) || null;
// 'cart' stores items for the current user's session
window.cart = JSON.parse(localStorage.getItem("cart")) || [];

window.products = [
  {
    id: "prod001",
    name: "Fresh Apples (1kg)",
    price: 120,
    imageUrl: "https://via.placeholder.com/150/FF6347/FFFFFF?text=Apples",
  },
  {
    id: "prod002",
    name: "Organic Milk (1L)",
    price: 60,
    imageUrl: "https://via.placeholder.com/150/87CEEB/FFFFFF?text=Milk",
  },
  {
    id: "prod003",
    name: "Whole Wheat Bread",
    price: 80,
    imageUrl: "https://via.placeholder.com/150/CD853F/FFFFFF?text=Bread",
  },
  {
    id: "prod004",
    name: "Farm Fresh Eggs (12)",
    price: 95,
    imageUrl: "https://via.placeholder.com/150/F4D03F/FFFFFF?text=Eggs",
  },
  {
    id: "prod005",
    name: "Basmati Rice (5kg)",
    price: 400,
    imageUrl: "https://via.placeholder.com/150/90EE90/FFFFFF?text=Rice",
  },
  {
    id: "prod006",
    name: "Chicken Breast (500g)",
    price: 250,
    imageUrl: "https://via.placeholder.com/150/DDA0DD/FFFFFF?text=Chicken",
  },
  {
    id: "prod007",
    name: "Spinach (250g)",
    price: 30,
    imageUrl: "https://via.placeholder.com/150/7FFFD4/FFFFFF?text=Spinach",
  },
  {
    id: "prod008",
    name: "Olive Oil (1L)",
    price: 500,
    imageUrl: "https://via.placeholder.com/150/FFDAB9/FFFFFF?text=Olive+Oil",
  },
];

// --- Utility Functions ---

window.updateLocalStorage = () => {
  localStorage.setItem(
    "registeredCustomers",
    JSON.stringify(window.registeredCustomers)
  );
  localStorage.setItem(
    "loggedInCustomer",
    JSON.stringify(window.loggedInCustomer)
  ); // Persist logged-in user
  localStorage.setItem("cart", JSON.stringify(window.cart));
};

window.displayMessage = (element, message, type) => {
  element.textContent = message;
  element.className = `server-message ${type}`;
  element.style.display = "block";
};

window.hideMessage = (element) => {
  element.textContent = "";
  element.className = "server-message";
  element.style.display = "none";
};

window.displayError = (element, message) => {
  element.textContent = message;
  element.style.display = "block";
};

window.hideError = (element) => {
  element.textContent = "";
  element.style.display = "none";
};

window.generateUniqueId = (prefix) => {
  return prefix + Math.random().toString(36).substr(2, 9).toUpperCase();
};

// --- Validation Functions ---
window.validateCustomerName = (name) => {
  if (!name || name.trim() === "") {
    return "Customer Name must not be blank.";
  }
  if (!/^[a-zA-Z\s]*$/.test(name)) {
    return "Customer Name must have alphabets only.";
  }
  return null;
};

window.validateEmail = (email) => {
  if (!email || email.trim() === "") {
    return "Email must not be blank.";
  }
  if (!/.+@.+\..+/.test(email)) {
    // More robust email regex
    return "Email id not valid.";
  }
  return null;
};

window.validatePassword = (password) => {
  if (!password || password.trim() === "") {
    return "Password must not be blank.";
  }
  if (password.length < 5) {
    return "Password's length must not be less than 5 characters.";
  }
  // At least one uppercase, one number, and one special character
  if (
    !/[A-Z]/.test(password) ||
    !/[0-9]/.test(password) ||
    !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
  ) {
    return "Password must contain at least one uppercase letter, one number, and one special character.";
  }
  return null;
};

window.validateAddress = (address) => {
  if (!address || address.trim() === "") {
    return "Address field must not be blank.";
  }
  return null;
};

window.validateContactNumber = (number) => {
  if (!number || number.trim() === "") {
    return "Contact number must not be blank.";
  }
  if (!/^[0-9]{10}$/.test(number)) {
    // Exact 10 digits
    return "Contact number must be 10 digits and numeric only.";
  }
  return null;
};

// Function to check login status and redirect if needed
window.checkLoginStatus = () => {
  window.loggedInCustomer =
    JSON.parse(localStorage.getItem("loggedInCustomer")) || null; // Re-fetch in case of tab sync
  if (
    !window.loggedInCustomer &&
    !["index.html", "login.html", "register.html"].some((page) =>
      window.location.pathname.endsWith(page)
    )
  ) {
    alert("Please login to access this page.");
    window.location.href = "login.html";
    return false;
  }
  return true;
};

// Logout handler - common for all pages
window.setupLogout = () => {
  const logoutNav = document.getElementById("logoutNav");
  if (logoutNav) {
    logoutNav.addEventListener("click", (e) => {
      e.preventDefault();
      window.loggedInCustomer = null;
      window.cart = []; // Clear cart on logout
      window.updateLocalStorage();
      window.location.href = "login.html";
    });
  }
};

// --- Initial setup on all pages using common.js (if applicable) ---
document.addEventListener("DOMContentLoaded", () => {
  window.setupLogout(); // Setup logout listener on all pages with a nav bar
});
