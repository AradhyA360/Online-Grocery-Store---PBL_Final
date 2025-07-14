document.addEventListener("DOMContentLoaded", () => {
  // Check login status first
  if (!window.checkLoginStatus()) {
    return; // Redirect handled by checkLoginStatus
  }

  const profileForm = document.getElementById("profileForm");
  const profileCustomerId = document.getElementById("profileCustomerId");
  const profileCustomerName = document.getElementById("profileCustomerName");
  const profileEmail = document.getElementById("profileEmail");
  const profilePassword = document.getElementById("profilePassword");
  const profileAddress = document.getElementById("profileAddress");
  const profileContactNumber = document.getElementById("profileContactNumber");
  const profileCustomerNameError = document.getElementById(
    "profileCustomerNameError"
  );
  const profileEmailError = document.getElementById("profileEmailError"); // Email not editable, but validation still applies if it was
  const profileAddressError = document.getElementById("profileAddressError");
  const profileContactNumberError = document.getElementById(
    "profileContactNumberError"
  );
  const editProfileButton = document.getElementById("editProfileButton");
  const saveProfileButton = document.getElementById("saveProfileButton");
  const profileUpdateMessage = document.getElementById("profileUpdateMessage");

  const loadProfileData = () => {
    if (window.loggedInCustomer) {
      profileCustomerId.value = window.loggedInCustomer.customerId;
      profileCustomerName.value = window.loggedInCustomer.customerName;
      profileEmail.value = window.loggedInCustomer.email;
      profilePassword.value = window.loggedInCustomer.password; // Display password (masked by type="password")
      profileAddress.value = window.loggedInCustomer.address;
      profileContactNumber.value = window.loggedInCustomer.contactNumber;
    }
  };

  const toggleProfileEdit = (isEditing) => {
    profileCustomerName.disabled = !isEditing;
    // profileEmail.disabled = !isEditing; // Email not editable as per instruction
    profileAddress.disabled = !isEditing;
    profileContactNumber.disabled = !isEditing;

    editProfileButton.style.display = isEditing ? "none" : "block";
    saveProfileButton.style.display = isEditing ? "block" : "none";

    // Clear previous errors when toggling edit mode
    Array.from(profileForm.querySelectorAll(".error-message")).forEach(
      window.hideError
    );
    window.hideMessage(profileUpdateMessage); // Hide any previous messages
  };

  editProfileButton.addEventListener("click", () => {
    toggleProfileEdit(true);
  });

  profileForm.addEventListener("submit", (e) => {
    e.preventDefault();
    window.hideMessage(profileUpdateMessage);
    // Clear previous errors
    Array.from(profileForm.querySelectorAll(".error-message")).forEach(
      window.hideError
    );

    const updatedName = profileCustomerName.value.trim();
    const updatedAddress = profileAddress.value.trim();
    const updatedContactNumber = profileContactNumber.value.trim();

    let isValid = true;

    const nameError = window.validateCustomerName(updatedName);
    if (nameError) {
      window.displayError(profileCustomerNameError, nameError);
      isValid = false;
    }

    const addrErr = window.validateAddress(updatedAddress);
    if (addrErr) {
      window.displayError(profileAddressError, addrErr);
      isValid = false;
    }

    const contactErr = window.validateContactNumber(updatedContactNumber);
    if (contactErr) {
      window.displayError(profileContactNumberError, contactErr);
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    // Update loggedInCustomer object with new values
    window.loggedInCustomer.customerName = updatedName;
    window.loggedInCustomer.address = updatedAddress;
    window.loggedInCustomer.contactNumber = updatedContactNumber;

    // Find and update in the registeredCustomers array (simulates "Registration Table" update)
    const customerIndex = window.registeredCustomers.findIndex(
      (c) => c.customerId === window.loggedInCustomer.customerId
    );
    if (customerIndex > -1) {
      window.registeredCustomers[customerIndex] = {
        ...window.loggedInCustomer,
      };
    }
    window.updateLocalStorage();
    window.displayMessage(
      profileUpdateMessage,
      "Profile updated successfully!",
      "success"
    );
    // Update welcome message on home page if the name changes
    // (This would typically involve re-rendering the home page or a shared component)
    // For now, it will update when the user navigates to home.
    toggleProfileEdit(false); // Disable fields after saving
  });

  // Initial load of profile data and set edit state
  loadProfileData();
  toggleProfileEdit(false); // Ensure fields are disabled initially
});
