import { user, products, createUser, getAllUsers, createProduct, getAllProducts, searchProductsByName } from "./database";

console.log(user);
console.log(products)

createUser("user03", "Tarja Turunen", "naig-tuixi@hotmail.com", "NeMoXD")

console.table(getAllUsers())

createProduct("product03", "presilha", 10, "par de presilha de metal preta com asas de morcego em feltro", "https://http2.mlstatic.com/D_NQ_NP_769732-MLB49303768406_032022-O.webp")

console.table(getAllProducts())

console.table(searchProductsByName("pulseira de spike"))