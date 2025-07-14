document.addEventListener("DOMContentLoaded", () => {
  // Check login status first
  if (!window.checkLoginStatus()) {
    return; // Redirect handled by checkLoginStatus
  }

  const cartItemsContainer = document.getElementById("cartItemsContainer");
  const cartTotalItems = document.getElementById("cartTotalItems");
  const cartSubtotal = document.getElementById("cartSubtotal");
  const cartTotalAmount = document.getElementById("cartTotalAmount");
  const checkoutButton = document.getElementById("checkoutButton");
  const emptyCartMessage = document.getElementById("emptyCartMessage");
  const checkoutMessage = document.getElementById("checkoutMessage");

  const paymentOptionsSection = document.getElementById("paymentOptions");
  const paymentButtons = document.querySelectorAll(".payment-button");
  const paymentMessage = document.getElementById("paymentMessage");

  const invoice = document.getElementById("invoice");
  const invoiceOrderId = document.getElementById("invoiceOrderId");
  const invoiceDate = document.getElementById("invoiceDate");
  const invoicePaymentMethod = document.getElementById("invoicePaymentMethod"); // New element for payment method
  const invoiceItemsContainer = document.getElementById(
    "invoiceItemsContainer"
  );
  const invoiceGrandTotal = document.getElementById("invoiceGrandTotal");
  const backToHomeFromInvoice = document.getElementById(
    "backToHomeFromInvoice"
  );

  let currentOrderId = null; // Store order ID after checkout
  let currentOrderDate = null; // Store order date

  const renderCart = () => {
    cartItemsContainer.innerHTML = "";
    if (window.cart.length === 0) {
      emptyCartMessage.style.display = "block";
      cartTotalItems.textContent = "0";
      cartSubtotal.textContent = "0.00";
      cartTotalAmount.textContent = "0.00";
      checkoutButton.disabled = true;
      return;
    } else {
      emptyCartMessage.style.display = "none";
      checkoutButton.disabled = false;
    }

    let totalItems = 0;
    let subtotal = 0;

    window.cart.forEach((item) => {
      const cartItemDiv = document.createElement("div");
      cartItemDiv.classList.add("cart-item");
      const itemTotalPrice = item.price * item.quantity;
      subtotal += itemTotalPrice;
      totalItems += item.quantity;

      cartItemDiv.innerHTML = `
                <img src="${item.imageUrl}" alt="${item.name}">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>Price: ₹<span class="price">${item.price.toFixed(
                      2
                    )}</span> x ${item.quantity}</p>
                    <p>Total: ₹<span>${itemTotalPrice.toFixed(2)}</span></p>
                </div>
                <button class="delete-button" data-product-id="${
                  item.id
                }">Remove</button>
            `;
      cartItemsContainer.appendChild(cartItemDiv);
    });

    cartTotalItems.textContent = totalItems;
    cartSubtotal.textContent = subtotal.toFixed(2);
    cartTotalAmount.textContent = subtotal.toFixed(2); // For now, total amount is same as subtotal

    // Add event listeners for remove buttons
    document.querySelectorAll(".cart-item .delete-button").forEach((button) => {
      button.addEventListener("click", (e) => {
        const productId = e.target.dataset.productId;
        removeFromCart(productId);
      });
    });
  };

  const removeFromCart = (productId) => {
    window.cart = window.cart.filter((item) => item.id !== productId);
    window.updateLocalStorage();
    renderCart(); // Re-render cart after removal
  };

  checkoutButton.addEventListener("click", () => {
    if (window.cart.length === 0) {
      window.displayMessage(
        checkoutMessage,
        "Your cart is empty. Please add items before checking out.",
        "error"
      );
      return;
    }

    // Simulate order placement (US_SQL_003)
    currentOrderId = window.generateUniqueId("ORD");
    currentOrderDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    window.displayMessage(
      checkoutMessage,
      "Order Placed Successfully. Please select payment method.",
      "success"
    );

    // Hide cart and show payment options
    document.querySelector(".cart-content").style.display = "none"; // Hide main cart content
    checkoutButton.style.display = "none"; // Hide checkout button
    paymentOptionsSection.style.display = "block"; // Show payment options
  });

  // Event listeners for payment buttons
  paymentButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const paymentType = e.target.dataset.paymentType;
      window.hideMessage(paymentMessage); // Clear previous messages

      // Simulate payment processing
      window.displayMessage(
        paymentMessage,
        `Processing payment via ${paymentType}...`,
        "success"
      );

      setTimeout(() => {
        window.displayMessage(
          paymentMessage,
          `Payment successful via ${paymentType}!`,
          "success"
        );
        renderInvoice(paymentType); // Render invoice after payment
      }, 1500); // Simulate network delay
    });
  });

  const renderInvoice = (paymentMethod) => {
    // Hide payment options
    paymentOptionsSection.style.display = "none";
    window.hideMessage(checkoutMessage); // Clear the 'Order Placed' message
    window.hideMessage(paymentMessage); // Clear payment processing message

    invoiceOrderId.textContent = currentOrderId;
    invoiceDate.textContent = currentOrderDate;
    invoicePaymentMethod.textContent = paymentMethod; // Set selected payment method
    invoiceItemsContainer.innerHTML = "";
    let grandTotal = 0;

    // Use a copy of the cart from before it was cleared, or pass it directly.
    // For simplicity, let's assume `window.cart` still holds the items that were just checked out.
    // In a real app, you'd move items from cart to an 'orders' history before clearing.
    const itemsForInvoice = JSON.parse(localStorage.getItem("cart")); // Get the cart items before clearing

    itemsForInvoice.forEach((item) => {
      const itemTotalPrice = item.price * item.quantity;
      grandTotal += itemTotalPrice;
      const invoiceItemDiv = document.createElement("div");
      invoiceItemDiv.classList.add("invoice-item");
      invoiceItemDiv.innerHTML = `
                <span>${item.name} (x${item.quantity})</span>
                <span>₹${itemTotalPrice.toFixed(2)}</span>
            `;
      invoiceItemsContainer.appendChild(invoiceItemDiv);
    });
    invoiceGrandTotal.textContent = grandTotal.toFixed(2);
    invoice.style.display = "block";

    // Clear the cart after successful checkout and invoice display
    window.cart = [];
    window.updateLocalStorage();
    renderCart(); // Update cart display to empty
  };

  backToHomeFromInvoice.addEventListener("click", () => {
    window.location.href = "home.html"; // Redirect to home
  });

  // Initial render of cart when page loads
  renderCart();
  window.hideMessage(checkoutMessage); // Clear any old checkout messages
  window.hideMessage(paymentMessage); // Clear payment message
  invoice.style.display = "none"; // Ensure invoice is hidden on load
  paymentOptionsSection.style.display = "none"; // Ensure payment options are hidden on load
});
