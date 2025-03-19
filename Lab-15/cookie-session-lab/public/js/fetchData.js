document.addEventListener("DOMContentLoaded", function () {
    fetch("data/data.json")
      .then(response => response.json()) // Convert response to JSON
      .then(data => {
        const page = document.body.getAttribute("data-page"); // Get the current page
  
        if (page === "home") {
          // Load home section
          document.getElementById("welcomeMessage").textContent = data.home.welcomeMessage;
          document.getElementById("introText").textContent = data.home.introText;
          document.getElementById("indexImage").src = data.home.indexImage;
        } 
        else if (page === "products") {
          document.getElementById("prodListTitle").textContent = data.prodListTitle;
          // Load gallery images
          const productsContainer = document.getElementById("productsContainer");
          data.products.forEach(product => {
            const productDiv = document.createElement("div");
            productDiv.classList.add("product");
  
            // Create and append the product caption
            const caption = document.createElement("h2");
            caption.textContent = product.caption;
            productDiv.appendChild(caption);
  
            // Create and append the product image if available
            if (product.image) {
              const img = document.createElement("img");
              img.src = product.image;
              img.alt = product.caption;
              productDiv.appendChild(img);
            }
  
            // Create and append the product description
            const description = document.createElement("p");
            description.textContent = product.description;
            productDiv.appendChild(description);
  
            // Create the "Add to Cart" button
            const addButton = document.createElement("button");
            addButton.textContent = "Add to Cart";
            addButton.addEventListener("click", () => {
              addToCart(product);
            });
            productDiv.appendChild(addButton);
  
            // Append the complete product div to the container
            productsContainer.appendChild(productDiv);
          });
        } 
        else if (page === "contact") {
          // Load contact section
          document.getElementById("contactText").textContent = data.contact.contactText;
          document.getElementById("contactEmail").textContent = data.contact.contactEmail;
          document.getElementById("contactNum").textContent = data.contact.contactNum;
        }
      })
      .catch(error => console.error("Error fetching data:", error));
  
    // Function to add a product to the cart using localStorage
    function addToCart(product) {
      // Retrieve any existing cart items from localStorage or initialize an empty array
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      cart.push(product);
      localStorage.setItem("cart", JSON.stringify(cart));
      alert(`${product.caption} has been added to your cart!`);
    }
  });
  