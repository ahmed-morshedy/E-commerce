const themeToggleBtn = document.getElementById("theme-toggle");
const currentTheme = localStorage.getItem("theme");
const htmlElement = document.documentElement;
const numCartProducts = document.getElementById("num-product");
const sectionProducts = document.getElementById("products");

//Theme Mode
if (currentTheme) {
  htmlElement.setAttribute("data-theme", currentTheme);
  if (currentTheme === "dark") {
    themeToggleBtn.children[0].className = "fa-solid fa-sun fa-2xl";
  } else {
    themeToggleBtn.children[0].className = "fa-regular fa-moon fa-2xl";
  }
}

themeToggleBtn.addEventListener("click", function () {
  const currentTheme = htmlElement.getAttribute("data-theme");

  if (currentTheme === "dark") {
    htmlElement.setAttribute("data-theme", "light");
    localStorage.setItem("theme", "light");
    themeToggleBtn.children[0].className = "fa-regular fa-moon fa-2xl";
  } else {
    htmlElement.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark");
    themeToggleBtn.children[0].className = "fa-solid fa-sun fa-2xl";
  }
});

window.onload = function () {
  getNumberOfProductsInSession();
};

function getNumberOfProductsInSession() {
  let existingProducts = sessionStorage.getItem("products");
  existingProducts = existingProducts ? JSON.parse(existingProducts) : [];

  // Return the number of products in the array
  numCartProducts.innerHTML = existingProducts.length;
}

// Function to get product from sessionStorage
function getProductFromSession() {
  // Assuming you have stored products in sessionStorage as a JSON string
  const products = sessionStorage.getItem("products");
  return products ? JSON.parse(products) : [];
}
const products = getProductFromSession();

async function fetchData() {
  const setProducts = [...new Set(products)];
  let final = [];

  // Use 'Promise.all' to wait for all fetch requests to complete
  final = await Promise.all(
    setProducts.map(async (item) => {
      const res = await fetch(`https://fakestoreapi.com/products/${item}`);
      const json = await res.json();
      return json;
    })
  );

  // Now final contains all the product data, so we can render them
  final.map((item) => {
    const count = countProduct(item.id);
    const itemElement = document.createElement("div");
    itemElement.className = "item";

    // Image Element
    const imgElement = document.createElement("div");
    const img = document.createElement("img");
    img.src = item.image;
    imgElement.appendChild(img);
    itemElement.appendChild(imgElement);

    // Info Container
    const info = document.createElement("div");
    info.className = "info";
    info.style =
      "display: flex;padding: 10px;justify-content: space-between;align-items: center;";

    const div = document.createElement("div");

    // Category Text
    const pCat = document.createElement("p");
    pCat.className = "category";
    const pCatText = document.createTextNode(`Title : ${item.title}`);
    pCat.appendChild(pCatText);
    div.appendChild(pCat);

    // Price Text
    const pPrice = document.createElement("p");
    pPrice.className = "price";
    const priceText = document.createTextNode(`Price : $${item.price}`);
    pPrice.appendChild(priceText);
    div.appendChild(pPrice);

    const pCount = document.createElement("p");
    pCount.className = "count";
    const CountText = document.createTextNode(`Count : ${count}`);
    pCount.appendChild(CountText);
    div.appendChild(pCount);

    const description = document.createElement("p");
    description.appendChild(
      document.createTextNode(`Description : ${item.description}`)
    );
    div.appendChild(description);

    info.appendChild(div);
    itemElement.appendChild(info);

    sectionProducts.append(itemElement);
  });
}

window.addEventListener("load", () => fetchData());

// Function to count occurrences of a specific product by its ID
function countProductInSession(productId) {
  const productsInSession = getProductFromSession();
  let count = 0;

  productsInSession.forEach((product) => {
    if (product === productId) {
      count += 1; // Assuming quantity field exists
    }
  });

  return count;
}

products.map((item) => {
  return countProduct(item);
});

// Example usage
function countProduct(id) {
  const productIdToCheck = Number(id);
  // Replace with the ID of the product you want to count
  return (count = countProductInSession(productIdToCheck));
}
