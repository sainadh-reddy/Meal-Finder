const categoryList = document.getElementById("categories");
const hamburgerBtn = document.getElementById("hamburgerBtn");

// Toggle category list
hamburgerBtn.addEventListener("click", () => {
    categoryList.classList.toggle("hidden");
});
// Fetch meal categories
fetch("https://www.themealdb.com/api/json/v1/1/categories.php")
.then(response => {
    if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
    }
    return response.json();
})
.then(data => {
    const categories = data.categories;
    categories.forEach(category => {
        const listItem = document.createElement("li");
        const link = document.createElement("a");
        link.textContent = category.strCategory;
        link.textdecoation = "none";
        listItem.className = "px-4 py-1 hover:bg-gray-100 cursor-pointer text-gray-500";
        listItem.appendChild(link);
        const line = document.createElement("hr");
        line.className = "border-gray-200 mx-4";
        categoryList.appendChild(listItem);
        categoryList.appendChild(line);
    });
})
.catch(error => {
    console.error("There was a problem with the fetch operation:", error);
    const errorItem = document.createElement("li");
    errorItem.textContent = "Failed to load categories.";
    errorItem.className = "px-4 py-2 text-red-500";
    categoryList.appendChild(errorItem);
});
