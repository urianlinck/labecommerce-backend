# labecommerce-backend
Primeiro projeto de Backend

API com funcionalidades de procurar, criar, deletar um usuário, produto, ou compra. Também é possível editar um produto. Além de ser possível fazer busca por lista ou por item., através do nome ou ID.

Link da API:
https://documenter.getpostman.com/view/27685697/2s93zFVygb

A API foi criada focando nos estudo de Node e package.json, Typescript, APIs e Express, fluxo de banco de dados, SQL e suas relações, e Knex.

Cada endpoint tem uma ou mais funcionalidades que serão explicadas a seguir:

### GET ping ###

Apenas um teste de funcionalidade.

![ping](https://github.com/urianlinck/labecommerce-backend/assets/125294858/116097df-6a42-41ea-93a2-f54e628ccade)

### GET AllUsers ###

Utilizado para encontrar um usuário específico na API. Deve-se sempre utilizar o nome do usuário.

![allUsers1](https://github.com/urianlinck/labecommerce-backend/assets/125294858/ca8e76a0-2fd4-4545-91ff-f2231dc61686)
![allUsers2](https://github.com/urianlinck/labecommerce-backend/assets/125294858/290f82fa-cacb-401a-984f-36d21b67e983)

### GET AllProducts ###

Utilizado para encontrar um produto específico na API. Deve-se sempre utilizar o NOME do produto.

![allProducts1](https://github.com/urianlinck/labecommerce-backend/assets/125294858/441ec571-dc2d-4c42-a493-75125b754355)
![allProducts2](https://github.com/urianlinck/labecommerce-backend/assets/125294858/6f676edb-16ab-4244-9871-ab65d1218e47)

### GET AllPurchases ###

Utilizado para encontrar uma compra específico na API. Deve-se sempre utilizar o NOME da compra.

![allPurchases1](https://github.com/urianlinck/labecommerce-backend/assets/125294858/0d821f46-1801-4c6e-997d-0058573c4d98)
![allPurchases2](https://github.com/urianlinck/labecommerce-backend/assets/125294858/baf9d7c9-968e-4d29-a60a-b7713a622800)

### POST CreateUser ###

Utilizado para criar um novo usuário na API. É necessário preencher todos os dados:
ID;
NOME (name);
EMAIL;
SENHA (password).

Observações:
o ID não pode ser igual a um ID existente;
o EMAIL não pode ser cadastrado mais de uma vez;
todos os dados devem ser do tipo string.

![createUser1](https://github.com/urianlinck/labecommerce-backend/assets/125294858/910c1db2-c846-4610-8929-cdb75f19e272)
![createUser2](https://github.com/urianlinck/labecommerce-backend/assets/125294858/3402f742-1091-4065-a93c-e6f3ff328cf2)

### POST CreateProduct ###

Utilizado para criar um novo produto na API. É necessário preencher todos os dados:
ID;
NOME (name);
PREÇO (price);
DESCRIÇÃO (description);
IMAGEM (imageUrl).

Observações:
ID, NOME, DESCRIÇÃO e IMAGEM, devem ser do tipo string.
PREÇO deve ser do tipo number.
o ID não pode ser igual a um existente no sistema.
o PREÇO não pode ser zerado.

![createProduct1](https://github.com/urianlinck/labecommerce-backend/assets/125294858/5f511414-5727-41d3-a7ca-d28e24b1f219)
![createProduct2](https://github.com/urianlinck/labecommerce-backend/assets/125294858/98fa4104-c5be-4e29-930e-bb1f35311acf)

### POST CreatePurchase ###

Utilizado para criar uma nova compra. É necessário preencher todos os dados:
ID da compra;
Buyer (ID do comprador);
ID dos produtos;
Quantidade dos produtos.

Observações:
ID da compra, Buyer, e ID dos produtos devem ser Strings;
Quantidade de produtos deve ser número.

![createPurchase1](https://github.com/urianlinck/labecommerce-backend/assets/125294858/640a38b8-2c95-4d24-a5a1-c258e7f925c1)
![createPurchase2](https://github.com/urianlinck/labecommerce-backend/assets/125294858/44c31d01-8921-465f-8ed6-06241219f64a)
![createPurchase3](https://github.com/urianlinck/labecommerce-backend/assets/125294858/a2031013-6216-4975-8098-091f336dd611)
![createPurchase4](https://github.com/urianlinck/labecommerce-backend/assets/125294858/19054e55-fd9b-4764-842d-82f7e683d31e)


### PUT EditProduct ###

Utilizado para editar um produto específico da API. Deve-se sempre utilizar o ID do produto.
Não é necessário preencher todos os dados.
Observações:
ID, NOME, DESCRIÇÃO e IMAGEM, devem ser do tipo string.
PREÇO deve ser do tipo number.
o ID não pode ser igual a um existente no sistema.
o PREÇO não pode ser zerado.

![editProduct1](https://github.com/urianlinck/labecommerce-backend/assets/125294858/429fb48a-f0da-4dac-9fc7-3a93eb022766)
![editProduct2](https://github.com/urianlinck/labecommerce-backend/assets/125294858/a9cfc05a-73aa-4df3-a9f3-926b35e7d43c)

### DEL DeleteUser ###

Utilizado para apagar um usuário específico da API. Deve-se sempre utilizar o ID do usuário.
EndFragment

![deleteUser](https://github.com/urianlinck/labecommerce-backend/assets/125294858/5b8afc8f-00ac-4cb8-a2ee-23144a841368)


### DEL DeleteProduct ###

Utilizado para apagar um produto específico da API. Deve-se sempre utilizar o ID do produto.

![deleteProduct](https://github.com/urianlinck/labecommerce-backend/assets/125294858/4e9526e0-1bdd-47bb-940a-6ce3dbeaf9d7)


### DEL DeletePurchase ###

Utilizado para apagar uma compra específica da API. Deve-se sempre usar o ID da compra.

![deletePurchase](https://github.com/urianlinck/labecommerce-backend/assets/125294858/32c0bfeb-1317-4c7a-b0b5-28f4ea9a86f3)

