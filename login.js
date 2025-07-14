document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const loginCustomerIdInput = document.getElementById("loginCustomerId");
  const loginPasswordInput = document.getElementById("loginPassword");
  const loginCustomerIdError = document.getElementById("loginCustomerIdError");
  const loginPasswordError = document.getElementById("loginPasswordError");
  const loginMessage = document.getElementById("loginMessage");
  const showPasswordCheckbox = document.getElementById("showPassword");

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    window.hideMessage(loginMessage);
    window.hideError(loginCustomerIdError);
    window.hideError(loginPasswordError);

    const customerId = loginCustomerIdInput.value.trim();
    const password = loginPasswordInput.value;

    let hasError = false;

    if (!customerId) {
      window.displayError(loginCustomerIdError, "Customer ID cannot be blank.");
      hasError = true;
    }
    if (!password) {
      window.displayError(loginPasswordError, "Password cannot be blank.");
      hasError = true;
    }
    if (hasError) return;

    const foundCustomer = window.registeredCustomers.find(
      (customer) => customer.customerId === customerId
    );

    if (!foundCustomer) {
      window.displayMessage(loginMessage, "ID not valid.", "error");
      return;
    }

    if (foundCustomer.password !== password) {
      window.displayMessage(loginMessage, "Password not valid.", "error");
      return;
    }

    // If both are correct
    window.loggedInCustomer = foundCustomer; // Update global loggedInCustomer
    window.updateLocalStorage(); // Persist logged-in user

    window.displayMessage(
      loginMessage,
      "Login Successful. Redirecting...",
      "success"
    );
    setTimeout(() => {
      window.location.href = "home.html"; // Redirect to home page
    }, 1000);
  });

  showPasswordCheckbox.addEventListener("change", () => {
    loginPasswordInput.type = showPasswordCheckbox.checked
      ? "text"
      : "password";
  });
});
