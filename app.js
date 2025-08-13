const categoryList = document.getElementById("categories");
const hamburgerBtn = document.getElementById("hamburgerBtn");

hamburgerBtn.addEventListener("click", () => {
  categoryList.classList.toggle("hidden");
});

fetch("https://www.themealdb.com/api/json/v1/1/categories.php")
  .then(response => {
    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }
    return response.json();
  })
  .then(data => {
    const categories = data.categories;

    // Add Close Button
    const closeItem = document.createElement("li");
    closeItem.className = "flex justify-end px-2";
    const closeBtn = document.createElement("button");
    closeBtn.innerHTML = '<i class="fa-solid fa-xmark text-gray-500 hover:text-red-500 text-md"></i>';
    closeBtn.addEventListener("click", () => {
      categoryList.classList.add("hidden");
    });
    closeItem.appendChild(closeBtn);
    categoryList.appendChild(closeItem);

    // Add each category
    categories.forEach(category => {
        const listItem = document.createElement("li");
        const link = document.createElement("a");
        link.textContent = category.strCategory;
        link.href = "#"; // Placeholder, can be replaced with a click handler
        link.className = "block text-gray-700 hover:text-orange-500";
        listItem.className = "text-s px-4 hover:bg-gray-100 cursor-pointer";
        listItem.appendChild(link);
        const divider = document.createElement("hr");
        divider.className = "border-gray-300 my-1";
        categoryList.appendChild(listItem);
        categoryList.appendChild(divider);
    });
  })
  .catch(error => {
    console.error("There was a problem with the fetch operation:", error);
    const errorItem = document.createElement("li");
    errorItem.textContent = "Failed to load categories.";
    errorItem.className = "px-4 py-2 text-red-500";
    categoryList.appendChild(errorItem);
  });
