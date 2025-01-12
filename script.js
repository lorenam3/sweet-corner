function showSidebar() {
  const navbar = document.querySelector(".navbar");
  const hamburger = document.querySelector(".hamburger");
  const closeMenu = document.querySelector(".close-menu");

  navbar.classList.add("show");
  hamburger.style.display = "none";
  closeMenu.style.display = "block";
}

function hideSidebar() {
  const navbar = document.querySelector(".navbar");
  const hamburger = document.querySelector(".hamburger");
  const closeMenu = document.querySelector(".close-menu");

  navbar.classList.remove("show");
  hamburger.style.display = "block";
  closeMenu.style.display = "none";
}

var swiper = new Swiper(".mySwiper", {
  slidesPerView: 1,
  loop: true,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});

let listProductHTML = document.querySelector(".products");
let listCartHTML = document.querySelector(".listCart");
let iconCart = document.querySelector(".icon-cart");
let iconCartSpan = document.querySelector(".icon-cart span");
let body = document.querySelector("body");
let closeCart = document.querySelector(".close");
let products1 = [];
let cart = [];

iconCart.addEventListener("click", () => {
  body.classList.toggle("showCart");
});
closeCart.addEventListener("click", () => {
  body.classList.toggle("showCart");
});

const addDataToHTML = () => {
  if (products1.length > 0) {
    products1.forEach((product) => {
      let newProduct = document.createElement("div");
      newProduct.dataset.id = product.id;
      newProduct.classList.add("item");
      newProduct.innerHTML = `<img src="${product.image}" alt="">
                <h2>${product.name}</h2>
                <div class="price">$${product.price}</div>
                <button class="addCart">Add To Cart</button>`;
      listProductHTML.appendChild(newProduct);
    });
  }
};
listProductHTML.addEventListener("click", (event) => {
  let positionClick = event.target;
  if (positionClick.classList.contains("addCart")) {
    let id_product = positionClick.parentElement.dataset.id;
    addToCart(id_product);
  }
});
const addToCart = (product_id) => {
  let positionThisProductInCart = cart.findIndex(
    (value) => value.product_id == product_id
  );
  if (cart.length <= 0) {
    cart = [
      {
        product_id: product_id,
        quantity: 1,
      },
    ];
  } else if (positionThisProductInCart < 0) {
    cart.push({
      product_id: product_id,
      quantity: 1,
    });
  } else {
    cart[positionThisProductInCart].quantity =
      cart[positionThisProductInCart].quantity + 1;
  }
  addCartToHTML();
  addCartToMemory();
};
const addCartToMemory = () => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

const addCartToHTML = () => {
  listCartHTML.innerHTML = "";
  let totalQuantity = 0;
  let totalPriceAllProducts = 0;

  if (cart.length === 0) {
    listCartHTML.innerHTML = `<p class ="empty-cart-message">Your cart is empty.</p>`;
    iconCartSpan.innerText = totalQuantity;
    return;
  }

  if (cart.length > 0) {
    cart.forEach((item) => {
      totalQuantity = totalQuantity + item.quantity;
      let newItem = document.createElement("div");
      newItem.classList.add("item");
      newItem.dataset.id = item.product_id;

      let positionProduct = products1.findIndex(
        (value) => value.id == item.product_id
      );
      let info = products1[positionProduct];

      totalPriceAllProducts += info.price * item.quantity;

      listCartHTML.appendChild(newItem);
      newItem.innerHTML = `
            <div class="image">
                    <img src="${info.image}">
                </div>
                <div class="name">
                ${info.name}
                </div>
                <div class="totalPrice">$${(info.price * item.quantity).toFixed(
                  2
                )}</div>
                <div class="quantity">
                    <span class="minus"><</span>
                    <span>${item.quantity}</span>
                    <span class="plus">></span>
                </div>
            `;
    });
  }

  iconCartSpan.innerText = totalQuantity;

  let totalPriceContainer = document.querySelector(".totalPriceContainer");
  if (!totalPriceContainer) {
    totalPriceContainer = document.createElement("div");
    totalPriceContainer.classList.add("totalPriceContainer");
    listCartHTML.appendChild(totalPriceContainer);
  }
  totalPriceContainer.innerHTML = `
  <h3>Total Price = $${totalPriceAllProducts.toLocaleString(undefined, {
    minimumFractionDigits: 2,
  })} </h3>
  `;
};

listCartHTML.addEventListener("click", (event) => {
  let positionClick = event.target;
  if (
    positionClick.classList.contains("minus") ||
    positionClick.classList.contains("plus")
  ) {
    let product_id = positionClick.parentElement.parentElement.dataset.id;
    let type = "minus";
    if (positionClick.classList.contains("plus")) {
      type = "plus";
    }
    changeQuantityCart(product_id, type);
  }
});
const changeQuantityCart = (product_id, type) => {
  let positionItemInCart = cart.findIndex(
    (value) => value.product_id == product_id
  );
  if (positionItemInCart >= 0) {
    let info = cart[positionItemInCart];
    switch (type) {
      case "plus":
        cart[positionItemInCart].quantity =
          cart[positionItemInCart].quantity + 1;
        break;

      default:
        let changeQuantity = cart[positionItemInCart].quantity - 1;
        if (changeQuantity > 0) {
          cart[positionItemInCart].quantity = changeQuantity;
        } else {
          cart.splice(positionItemInCart, 1);
        }
        break;
    }
  }
  addCartToHTML();
  addCartToMemory();
};

const initApp = () => {
  fetch("products.json")
    .then((response) => response.json())
    .then((data) => {
      products1 = data;
      addDataToHTML();

      if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));
        addCartToHTML();
      }
    });
};
initApp();

function openCheckout() {
  const modal = document.getElementById("checkoutModal");
  modal.style.display = "block";
  setTimeout(() => modal.classList.add("show"), 10);
}

function closeCheckout() {
  const modal = document.getElementById("checkoutModal");
  modal.classList.remove("show");
  setTimeout(() => (modal.style.display = "none"), 500);
}

document.querySelector(".checkOut").addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Your cart is empty, please add some products before checking out.");
    return;
  }
  openCheckout();
});

//
const dateInput = document.querySelector(`input[type="date"]`);

function setMinDate() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const day = String(tomorrow.getDate()).padStart(2, "0");
  const month = String(tomorrow.getMonth() + 1).padStart(2, "0");
  const year = tomorrow.getFullYear();
  dateInput.setAttribute("min", `${year}-${month}-${day}`);
}

window.onload = setMinDate;

//
const form = document.querySelector("form");

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const confirmationMessage = document.createElement("p");
  confirmationMessage.textContent =
    "Thank you for your inquiry! We will respond as soon as possible.";
  confirmationMessage.style.color = "e84393";
  form.parentElement.appendChild(confirmationMessage);

  setTimeout(() => confirmationMessage.remove(), 5000);

  form.reset();
});
