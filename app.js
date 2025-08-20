const categoryList = document.getElementById("categories");
const hamburgerBtn = document.getElementById("hamburgerBtn");
const categoryThumbList = document.getElementById("categoriesList");
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const mealResult = document.getElementById("mealResult");
const mealdetails = document.getElementById("mealDetails");
const backBtn = document.getElementById("backBtn");
const homeBtn = document.getElementById("homeBtn");

const mealsByCategory = document.getElementById("mealsByCategory");
const mealsAfterSearching = document.getElementById("mealsAfterSearching");

// Toggle category menu
hamburgerBtn.addEventListener("click", () => {
  categoryList.classList.toggle("hidden");
});

// Fetch and display categories
fetch("https://www.themealdb.com/api/json/v1/1/categories.php")
  .then((res) => res.json())
  .then((data) => {
    const categories = data.categories;

    // Close button inside dropdown
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
      const { strCategory, strCategoryDescription, strCategoryThumb } = category;

      // Menu item
      const listItem = document.createElement("li");
      listItem.className =
        "block text-gray-700 text-s px-4 py-1 hover:bg-gray-100 cursor-pointer hover:text-orange-500";
      listItem.textContent = strCategory;
      listItem.addEventListener("click", () => {
        categoryList.classList.add("hidden");
        fetchMealsByCategory(strCategory, strCategoryDescription);
        window.scrollTo({ top: 408, behavior: "smooth" });
      });
      categoryList.appendChild(listItem);
      categoryList.appendChild(document.createElement("hr"));

      // Thumbnail card
      const categoryThumb = document.createElement("div");
      categoryThumb.className =
        "bg-white shadow-lg relative text-center cursor-pointer rounded-lg overflow-hidden hover:shadow-xl transition";
      categoryThumb.innerHTML = `
        <img src="${strCategoryThumb}" alt="${strCategory}" class="w-full h-32 object-cover p-2">
        <div class="absolute py-1 px-2 text-sm text-white bg-orange-500 rounded top-0 right-0 m-1">${strCategory}</div>
      `;
      categoryThumb.addEventListener("click", () =>{
        mealsAfterSearching.classList.add("hidden");
        mealdetails.classList.add("hidden");
        fetchMealsByCategory(strCategory, strCategoryDescription);
        window.scrollTo({ top: 408, behavior: "smooth" });
    });
      categoryThumbList.appendChild(categoryThumb);
    });
  });

// Search meal by name
searchBtn.addEventListener("click", () => {
  const mealName = searchInput.value.trim();
  if (!mealName) {
    alert("Please enter a meal name to search.");
    return;
  }

  mealsAfterSearching.classList.remove("hidden");
  mealsByCategory.classList.add("hidden");

  fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`)
    .then((res) => res.json())
    .then((data) => {
      mealResult.innerHTML = "";
      if (!data.meals) {
        mealResult.innerHTML = `<p class="text-gray-600">No meals found for "${mealName}".</p>`;
        return;
      }
      data.meals.forEach((meal) => {
        const mealCard = document.createElement("div");
        mealCard.className =
          "bg-white shadow-md rounded overflow-hidden hover:shadow-xl transition cursor-pointer";
        mealCard.innerHTML = `
          <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="w-full h-40 object-cover">
          <div class="p-4">
            <p class="text-sm text-gray-600 mb-1">${meal.strArea}</p>
            <h3 class="text-lg font-bold mb-2">${meal.strMeal}</h3>
          </div>
        `;
        mealCard.addEventListener("click", () => {
          showMealDetails(meal.idMeal);
          window.scrollTo({ top: 408, behavior: "smooth" });
        });
        mealResult.appendChild(mealCard);
      });
    });
    window.scrollTo({ top: 408, behavior: "smooth" });
});

// Enter key search
searchInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") searchBtn.click();
});

// Fetch meals by category
function fetchMealsByCategory(categoryName, description) {
  const categoryDesc = document.getElementById("categoryDescription");
  const mealsList = document.getElementById("mealsList");

  mealsAfterSearching.classList.add("hidden");
  mealsByCategory.classList.remove("hidden");

  categoryDesc.innerHTML = `
    <div>
      <h3 class="text-lg font-bold text-orange-600 mb-2">${categoryName}</h3>
      <p class="text-gray-600 text-sm">${description}</p>
    </div>
  `;

  mealsList.innerHTML = "";

  fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoryName}`)
    .then((res) => res.json())
    .then((data) => {
      mealsList.innerHTML = "";
      if (!data.meals) {
        mealsList.innerHTML = `<p class="text-gray-600">No meals found for "${categoryName}".</p>`;
        return;
      }
      data.meals.forEach((meal) => {
        const mealCard = document.createElement("div");
        mealCard.className =
          "bg-white shadow-md rounded overflow-hidden hover:shadow-xl transition cursor-pointer";
        mealCard.innerHTML = `
          <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="w-full h-40 object-cover">
          <div class="p-4">
            <h3 class="text-lg font-bold mb-2">${meal.strMeal}</h3>
          </div>
        `;
        mealCard.addEventListener("click", () => {
          showMealDetails(meal.idMeal);
          window.scrollTo({ top: 408, behavior: "smooth" });
        });
        mealsList.appendChild(mealCard);
      });
    });
}

// Show meal details
function showMealDetails(mealId) {
  mealdetails.classList.remove("hidden");
  mealsByCategory.classList.add("hidden");
  mealsAfterSearching.classList.add("hidden");

  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
    .then((res) => res.json())
    .then((data) => {
      const mealData = data.meals[0];
      document.getElementById("mealName").textContent = mealData.strMeal;

      // Header
      const ingredientsContainer = document.getElementById("ingredents");
      ingredientsContainer.innerHTML = `
        <div class="flex-1">
          <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}" class="mt-6 w-full md:w-96 rounded shadow-lg" />
        </div>
        <div id="mealDetailsText" class="flex-1 flex-col p-4">
        <div class="flex-1 text-center md:text-left">
          <h2 class="text-3xl font-bold text-orange-600 mb-3">${mealData.strMeal}</h2>
          <p class="text-gray-700 my-1"><strong>Category:</strong> ${mealData.strCategory}</p>
          <p class="text-gray-700 my-1"><strong>Area:</strong> ${mealData.strArea}</p>
          ${mealData.strTags 
            ? `
              <div class="my-2 flex items-center">
                <strong class="text-gray-800">Tags:</strong>
                <div class="flex space-x-2 flex-wrap mt-1 mx-1">
                  ${mealData.strTags.split(',').map(tag => `
                    <span class="text-orange-500 px-1 rounded text-sm font-medium border-2 border-orange-500">
                      ${tag.trim()}
                    </span>
                  `).join('')}
                </div>
              </div>
            `
            : ""
          }
          ${mealData.strSource ? `<p class="text-blue-600 mt-2"><a href="${mealData.strSource}" target="_blank" class="underline hover:text-blue-800">Source</a></p>` : ""}
        </div>
        </div>
      `;

      let ingredientName = document.createElement('div');
      ingredientName.className="mt-4 bg-orange-500 text-white p-2 rounded shadow-sm";
      ingredientName.innerHTML = `
        <h3 class="text-2xl font-semibold mb-4 mx-4">Ingredients </h3>
      `;
      const ingredentsUl = document.createElement("ul");
      ingredentsUl.className = "grid grid-cols-1 sm:grid-cols-2";
      for (let i = 1; i <= 20; i++) {
        const ingredient = mealData[`strIngredient${i}`];
        if (ingredient && ingredient.trim()) {
          const li = document.createElement("li");
          li.innerHTML = `<div class="inline-flex items-center justify-center w-4 h-5 text-sm border-2 border-white bg-green-300 rounded-full">${i}</div>
         <p class="inline">${ingredient}</p>`;
          ingredentsUl.appendChild(li);
        }
      }
      ingredientName.appendChild(ingredentsUl);
      mealDetailsText.appendChild(ingredientName);
      

      // Ingredients
      const measureContainer = document.getElementById("measure");
      measureContainer.innerHTML = `
        <h3 class="text-2xl font-semibold text-orange-600 mb-4 mx-4">Measure: </h3>
      `;
      const ul = document.createElement("ul");
      ul.className = "grid grid-cols-1 sm:grid-cols-2 text-gray-700 bg-gray-100 border-gray-500 border-2 mx-4 p-2";
      for (let i = 1; i <= 20; i++) {
        const measure = mealData[`strMeasure${i}`];
        const ingredient = mealData[`strIngredient${i}`];
        if (measure && measure.trim()) {
          const li = document.createElement("li");
          li.innerHTML = `<i class="fa-solid fa-spoon text-orange-500 mx-2"></i><p class="inline">${measure}</p>`;
          ul.appendChild(li);
        }
      }
      measureContainer.appendChild(ul);

      // Instructions
      const instructionsContainer = document.getElementById("instructions");
      const steps = mealData.strInstructions
      .split(/\r?\n/)        // Split by newline (handles both \n and \r\n)
      .filter(Boolean);   
      instructionsContainer.innerHTML = `
      <h3 class="text-2xl font-semibold text-orange-600 mb-4">Instructions</h3>
      <div>
        ${steps.map(step => `
          <div class="flex items-start mb-2">
            <i class="fa-regular fa-square-check text-orange-500 mr-2 mt-1"></i>
            <span class="text-gray-700 leading-relaxed">${step}</span>
          </div>
        `).join("")}
      </div>
    `;
    });
}

// Home button (breadcrumb house icon)
homeBtn.addEventListener("click", () => {
  mealdetails.classList.add("hidden");
  mealsByCategory.classList.add("hidden");
  mealsAfterSearching.classList.add("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
});
