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
            
            else if (page === "gallery") {
                document.getElementById("galleryTitle").textContent = data.galleryTitle
                // Load gallery images
                const galleryContainer = document.getElementById("galleryContainer");
                data.gallery.forEach(item => {
                    const div = document.createElement("div");
                    div.innerHTML = `
                        <h3>${item.caption}</h3>
                        <img src="${item.image}" alt="${item.caption}" width="200">
                        <p id="galleryDescription" style="text-decoration: none;">${item.description}</p>
                    `;
                    galleryContainer.appendChild(div);
                });
            } 
            
            else if (page === "contact") {
                // Load contact section
                document.getElementById("contactText").textContent = data.contact.contactText;
                document.getElementById("contactEmail").textContent = data.contact.contactEmail;
                document.getElementById("contactNum").textContent = data.contact.contactNum;
            }
        })
        .catch(error => console.error("Error loading JSON data:", error));
});
