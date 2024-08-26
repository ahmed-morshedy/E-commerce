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

async function fetchAllData() {
  await fetch("https://fakestoreapi.com/products")
    .then((res) => res.json())
    .then((json) => (allData = json));

  const productBox = document.getElementById("product-box");

  console.log(allData[0]);

  allData.map((item) => {
    const itemElement = document.createElement("div");
    itemElement.className = "item";

    const imgElement = document.createElement("div");
    const img = document.createElement("img");
    img.src = item.image;
    imgElement.append(img);
    itemElement.append(imgElement);

    const info = document.createElement("div");
    info.className = "info";
    info.style =
      "display: flex;padding: 10px;justify-content: space-between;align-items: center;";

    const div = document.createElement("div");

    const pCat = document.createElement("p");
    pCat.className = "category";
    const pText = (document.createTextNode = `Title : ${item.title}`);
    pCat.append(pText);
    itemElement.append(pCat);

    const pPrice = document.createElement("p");
    pPrice.className = "price";
    const priceText = (document.createTextNode = `Price : ${item.price}`);
    pPrice.append(priceText);
    div.append(pPrice);

    info.append(div);

    const cartElement = document.createElement("div");
    cartElement.className = "cart-icon ";
    cartElement.style = "cursor:pointer";
    const cart = document.createElement("i");
    cart.className = "fa-solid fa-cart-plus fa-2xl";
    cart.id = item.id;

    cartElement.append(cart);

    info.append(cartElement);

    itemElement.append(info);
    productBox.append(itemElement);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  fetchAllData();
});

function getNumberOfProductsInSession() {
  // Retrieve the existing products from sessionStorage and parse them into an array
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
