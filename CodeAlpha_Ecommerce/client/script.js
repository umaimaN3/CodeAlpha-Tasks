const API_URL = "http://localhost:5000/api/products";

async function fetchProducts() {
  const res = await fetch(API_URL);
  const products = await res.json();

  const productList = document.getElementById("product-list");

  productList.innerHTML = "";

  products.forEach(product => {
    const div = document.createElement("div");

div.innerHTML = `
<h3>${product.name}</h3>
<p>Price: ${product.price}</p>

<a href="product.html?id=${product._id}">
<button>View Details</button>
</a>

<button onclick="addToCart('${product._id}', '${product.name}', '${product.price}')">
Add To Cart
</button>

<hr>
`;


    productList.appendChild(div);
  });
  
}

fetchProducts();
function addToCart(id, name, price) {

let cart = JSON.parse(localStorage.getItem("cart")) || [];

cart.push({
id: id,
name: name,
price: price
});

localStorage.setItem("cart", JSON.stringify(cart));

alert("Product added to cart");

}