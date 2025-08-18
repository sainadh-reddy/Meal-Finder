const categoryList = document.getElementById("categories");
const hamburgerBtn = document.getElementById("hamburgerBtn");
const categoryThumbList = document.getElementById("categoriesList");
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const mealResult = document.getElementById("mealResult");

// Toggle category menu
hamburgerBtn.addEventListener("click", () => {
  categoryList.classList.toggle("hidden");
});

// Fetch and display categories
fetch("https://www.themealdb.com/api/json/v1/1/categories.php")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }
    return response.json();
  })
  .then((data) => {
    const categories = data.categories;

    // Add close button
    const closeItem = document.createElement("li");
    closeItem.className = "flex justify-end px-2";
    const closeBtn = document.createElement("button");
    closeBtn.innerHTML =
      '<i class="fa-solid fa-xmark text-gray-500 hover:text-red-500 text-md"></i>';
    closeBtn.addEventListener("click", () => {
      categoryList.classList.add("hidden");
    });
    closeItem.appendChild(closeBtn);
    categoryList.appendChild(closeItem);

    categories.forEach((category) => {
      // List item in dropdown
      const listItem = document.createElement("li");
      listItem.className =
        "block text-gray-700 text-s px-4 hover:bg-gray-100 cursor-pointer hover:text-orange-500";
      listItem.textContent = category.strCategory;
      const divider = document.createElement("hr");
      divider.className = "border-gray-300 my-1";
      categoryList.appendChild(listItem);
      categoryList.appendChild(divider);

      // Thumbnail card
      const categoryThumb = document.createElement("div");
      categoryThumb.className =
        "bg-white shadow-lg relative text-center cursor-pointer";
      const thumbImage = document.createElement("img");
      thumbImage.src = category.strCategoryThumb;
      thumbImage.alt = category.strCategory;
      thumbImage.className = "w-full h-32 object-fit p-2";

      const thumbTitle = document.createElement("div");
      thumbTitle.textContent = category.strCategory;
      thumbTitle.className =
        "absolute py-1 px-2 text-sm text-white bg-orange-500 rounded top-0 right-0 m-1";

      categoryThumb.appendChild(thumbImage);
      categoryThumb.appendChild(thumbTitle);
      categoryThumbList.appendChild(categoryThumb);
    });
  })
  .catch((error) => {
    console.error("There was a problem with the fetch operation:", error);
    const errorItem = document.createElement("li");
    errorItem.textContent = "Failed to load categories.";
    errorItem.className = "px-4 py-2 text-red-500";
    categoryList.appendChild(errorItem);
  });

// Search meal by name
searchBtn.addEventListener("click", () => {
  const mealName = searchInput.value.trim();

  if (mealName === "") {
    alert("Please enter a meal name to search.");
    return;
  }

  const mealsAfterSearching = document.getElementById("mealsAfterSearching");
  mealsAfterSearching.classList.remove("hidden");

  fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch meals.");
      }
      return response.json();
    })
    .then((data) => {
      mealResult.innerHTML = ""; // Clear old results

      if (!data.meals) {
        mealResult.innerHTML = `<p class="text-gray-600">No meals found for "${mealName}".</p>`;
        return;
      }

      data.meals.forEach((meal) => {
        const mealCard = document.createElement("div");
        mealCard.id = `searchedMeal-${meal.idMeal}`;
        mealCard.className =
          "bg-white shadow-md rounded overflow-hidden hover:shadow-xl transition-shadow";

        mealCard.innerHTML = `
          <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="w-full h-40 object-cover">
          <div class="p-4">
            <p class="text-sm text-gray-600 mb-1">${meal.strArea}</p>
            <h3 class="text-lg font-bold mb-2">${meal.strMeal}</h3>
          </div>
        `;

        mealResult.appendChild(mealCard);
      });
    })
    .catch((error) => {
      console.error("Error fetching meals:", error);
      mealResult.innerHTML = `<p class="text-red-500">Error fetching meals.</p>`;
    });
});

// Optional: search on Enter key press
searchInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    searchBtn.click();
  }
});
