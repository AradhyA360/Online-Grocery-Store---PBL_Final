document.addEventListener("DOMContentLoaded", () => {
  const registrationForm = document.getElementById("registrationForm");
  const customerNameInput = document.getElementById("customerName");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const addressInput = document.getElementById("address");
  const contactNumberInput = document.getElementById("contactNumber");
  const customerNameError = document.getElementById("customerNameError");
  const emailError = document.getElementById("emailError");
  const passwordError = document.getElementById("passwordError");
  const addressError = document.getElementById("addressError");
  const contactNumberError = document.getElementById("contactNumberError");
  const registerBtn = document.getElementById("registerBtn");

  const acknowledgmentScreen = document.getElementById("acknowledgmentScreen");
  const ackCustomerId = document.getElementById("ackCustomerId");
  const ackCustomerName = document.getElementById("ackCustomerName");
  const ackEmail = document.getElementById("ackEmail");
  const goToLoginFromAck = document.getElementById("goToLoginFromAck");

  registrationForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Clear previous errors
    Array.from(registrationForm.querySelectorAll(".error-message")).forEach(
      window.hideError
    );

    const name = customerNameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const address = addressInput.value.trim();
    const contactNumber = contactNumberInput.value.trim();

    let isValid = true;

    const nameError = window.validateCustomerName(name);
    if (nameError) {
      window.displayError(customerNameError, nameError);
      isValid = false;
    }

    const emailErr = window.validateEmail(email);
    if (emailErr) {
      window.displayError(emailError, emailErr);
      isValid = false;
    }
    // Check for existing email during registration
    if (
      !emailErr &&
      window.registeredCustomers.some((customer) => customer.email === email)
    ) {
      window.displayError(
        emailError,
        "This email is already registered. Please login."
      );
      isValid = false;
    }

    const passErr = window.validatePassword(password);
    if (passErr) {
      window.displayError(passwordError, passErr);
      isValid = false;
    }

    const addrErr = window.validateAddress(address);
    if (addrErr) {
      window.displayError(addressError, addrErr);
      isValid = false;
    }

    const contactErr = window.validateContactNumber(contactNumber);
    if (contactErr) {
      window.displayError(contactNumberError, contactErr);
      isValid = false;
    }

    if (!isValid) {
      return; // Stop if any validation fails
    }

    const newCustomerId = window.generateUniqueId("CUST");
    const newCustomer = {
      customerId: newCustomerId,
      customerName: name,
      email: email,
      password: password, // In a real app, hash this password!
      address: address,
      contactNumber: contactNumber,
    };

    window.registeredCustomers.push(newCustomer);
    window.updateLocalStorage();

    // Hide registration form and display acknowledgment
    document.getElementById("registrationPage").style.display = "none";
    acknowledgmentScreen.style.display = "block";

    ackCustomerId.textContent = newCustomerId;
    ackCustomerName.textContent = name;
    ackEmail.textContent = email;
  });

  goToLoginFromAck.addEventListener("click", () => {
    window.location.href = "login.html"; // Redirect to login page
  });
});
