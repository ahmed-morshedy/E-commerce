const themeToggleBtn = document.getElementById("theme-toggle");
const currentTheme = localStorage.getItem("theme");
const htmlElement = document.documentElement;
const numCartProducts = document.getElementById("num-product");

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

//Fetch Data
let allData;

const productBox = document.getElementById("product-box");
async function fetchAllData(apiUrl) {
  try {
    const response = await fetch(apiUrl);
    allData = await response.json();

    allData.map((item) => {
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

      info.appendChild(div);

      // Cart Icon
      const cartElement = document.createElement("div");
      cartElement.className = "cart-icon";
      cartElement.style = "cursor:pointer";
      const cart = document.createElement("i");
      cart.className = "fa-solid fa-cart-plus fa-2xl";
      cart.id = item.id;

      cartElement.appendChild(cart);

      info.appendChild(cartElement);

      itemElement.appendChild(info);
      productBox.appendChild(itemElement);
    });
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

fetchAllData("https://fakestoreapi.com/products");

window.onload = function () {
  getNumberOfProductsInSession();
};

function getNumberOfProductsInSession() {
  let existingProducts = sessionStorage.getItem("products");
  existingProducts = existingProducts ? JSON.parse(existingProducts) : [];

  // Return the number of products in the array
  numCartProducts.innerHTML = existingProducts.length;
}

document.addEventListener("click", function (event) {
  if (event.target.classList.contains("fa-cart-plus")) {
    const productId = Number(event.target.id);
    let existingProducts = sessionStorage.getItem("products");

    // Parse the existing products if they exist, otherwise create an empty array
    existingProducts = existingProducts ? JSON.parse(existingProducts) : [];

    existingProducts.push(productId);

    sessionStorage.setItem("products", JSON.stringify(existingProducts));
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });
    Toast.fire({
      icon: "success",
      title: "Product added ",
    });
    getNumberOfProductsInSession();
  }
});

document.getElementById("categories").addEventListener("change", function () {
  const selectedCategory = this.value;

  const apiUrl =
    selectedCategory === "all"
      ? "https://fakestoreapi.com/products"
      : `https://fakestoreapi.com/products/category/${encodeURIComponent(
          selectedCategory
        )}`;

  productBox.innerHTML = "";
  fetchAllData(apiUrl);
});
