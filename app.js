const categoryList = document.getElementById("categories");
const hamburgerBtn = document.getElementById("hamburgerBtn");
const categoryThumbList = document.getElementById("categoriesList");

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
        listItem.className = "block text-gray-700 text-s px-4 hover:bg-gray-100 cursor-pointer hover:text-orange-500";
        listItem.id = `category-${category.idCategory}`;
        listItem.textContent = category.strCategory;
        const divider = document.createElement("hr");
        divider.className = "border-gray-300 my-1";
        categoryList.appendChild(listItem);
        categoryList.appendChild(divider);

        // Create category thumbnail
        const categoryThumb = document.createElement("div");
        categoryThumb.className = `bg-white shadow-lg  relative text-center cursor-pointer`;
        categoryThumb.id = `category-${category.idCategory}Thumb`;
        const thumbImage = document.createElement("img");
        thumbImage.src = category.strCategoryThumb;
        thumbImage.alt = category.strCategory;
        thumbImage.className = "w-full h-32 object-fit p-2";

        const thumbTitle = document.createElement("div");
        thumbTitle.textContent = category.strCategory;
        thumbTitle.className = `absolute py-1 px-2 text-sm text-white bg-orange-500 rounded top-0 right-0 m-1`;

        categoryThumb.appendChild(thumbImage);
        categoryThumb.appendChild(thumbTitle);
        categoryThumbList.appendChild(categoryThumb);
    });
  })
  .catch(error => {
    console.error("There was a problem with the fetch operation:", error);
    const errorItem = document.createElement("li");
    errorItem.textContent = "Failed to load categories.";
    errorItem.className = "px-4 py-2 text-red-500";
    categoryList.appendChild(errorItem);
  });
