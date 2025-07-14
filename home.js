document.addEventListener("DOMContentLoaded", () => {
  // Check login status first
  if (!window.checkLoginStatus()) {
    return; // Redirect handled by checkLoginStatus
  }

  const loggedInUserName = document.getElementById("loggedInUserName");
  const productGrid = document.getElementById("productGrid");

  // Update welcome message
  if (window.loggedInCustomer) {
    loggedInUserName.textContent = window.loggedInCustomer.customerName;
  } else {
    loggedInUserName.textContent = "Guest"; // Fallback if not logged in (should be redirected though)
  }

  const renderProducts = () => {
    productGrid.innerHTML = ""; // Clear existing products
    window.products.forEach((product) => {
      const productCard = document.createElement("div");
      productCard.classList.add("product-card");
      productCard.innerHTML = `
                <img src="${product.imageUrl}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p class="price">₹${product.price.toFixed(2)}</p>
                <button class="add-to-cart-button" data-product-id="${
                  product.id
                }">Add to Cart</button>
            `;
      productGrid.appendChild(productCard);
    });

    // Add event listeners to "Add to Cart" buttons
    document.querySelectorAll(".add-to-cart-button").forEach((button) => {
      button.addEventListener("click", (e) => {
        const productId = e.target.dataset.productId;
        const productToAdd = window.products.find((p) => p.id === productId);
        if (productToAdd) {
          addToCart(productToAdd);
        }
      });
    });
  };

  const addToCart = (product) => {
    const existingItem = window.cart.find((item) => item.id === product.id);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      window.cart.push({ ...product, quantity: 1 });
    }
    window.updateLocalStorage();
    alert(`${product.name} added to cart!`); // Simple feedback
  };

  // Initial render of products when home page loads
  renderProducts();
});
