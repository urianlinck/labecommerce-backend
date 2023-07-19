import express, { Request, Response } from "express";
import cors from "cors";
import { TProducts, TUsers } from "./types";
import { db } from "./database-sql/knex";

// data e hora atual a região
let data = new Date();

// O data.valueOf() irá retornar a data em ms (milissegundos). Então é preciso converter o GMT também em milissegundos: data.getTimezoneOffset() * 60000.
export let data2 = new Date(data.valueOf() - data.getTimezoneOffset() * 60000);

const app = express();

app.use(express.json());
app.use(cors());

app.listen(3003, () => {
  console.log("Servidor rodando na porta 3003");
});

app.get("/ping", async (req: Request, res: Response) => {
  res.send("Pong!");
});

app.get("/users", async (req: Request, res: Response) => {
  try {
    const id = req.query.id as string;

    if (id !== undefined) {
      if (id.length < 1) {
        res.statusCode = 400;
        throw new Error("ID deve ter ao menos 1 caractere.");
      }
    }
    if (id) {
      const result = await db("users").select().where({ id: id });
      return res.status(200).send(result);
    } else {
      const result = await db("users");
      return res.status(200).send(result);
    }
  } catch (error) {
    console.log(error);

    if (req.statusCode === 200) {
      res.status(500);
    }

    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado.");
    }
  }
});

app.get("/products", async (req: Request, res: Response) => {
  try {
    const name = req.query.name as string;

    if (!name) {
      const result = await db("products");
      return res.status(200).send(result);
    }
    if (name.length > 2) {
      const result = await db("products")
        .select()
        .where("name", "LIKE", `%${name}%`);
      res.status(200).send(result);
    }
    if (name.length < 2) {
      res.status(400);
      throw new Error("'Name' deve ter ao menos 2 caracteres.");
    }
  } catch (error: any) {
    console.log(error);

    if (res.statusCode === 200) {
      res.status(500);
    }
    res.send(error.message);
  }
});

app.post("/users", async (req: Request, res: Response) => {
  try {
    const id = req.body.id;
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    if (typeof id !== "string") {
      res.status(400);
      throw new Error("'ID' precisa ser uma string.");
    }
    if (typeof name !== "string") {
      res.status(400);
      throw new Error("'Nome' precisa ser uma string.");
    }
    if (typeof email !== "string") {
      res.status(400);
      throw new Error("'Email' precisa ser uma string.");
    }
    if (typeof password !== "string") {
      res.status(400);
      throw new Error("'Senha' precisa ser uma string.");
    }

    const [existingID] = await db("users")
      .select()
      .where("id", "LIKE", `%${id}%`);

    if (existingID) {
      throw new Error("'ID' já existe.");
    }

    const [existingEmail] = await db("users")
      .select()
      .where("email", "LIKE", `%${email}%`);

    if (existingEmail) {
      throw new Error("'Email' já cadastrado.");
    }

    const newUser = {
      id: id,
      name: name,
      email: email,
      password: password,
      created_at: data2.toISOString(),
    };

    await db("users").insert(newUser);

    res.status(201).send("Cadastrado realizado com sucesso!");
  } catch (error: any) {
    console.log(error);

    if (res.statusCode === 200) {
      res.status(500);
    }
    res.send(error.message);
  }
});

app.post("/products", async (req: Request, res: Response) => {
  try {
    const id = req.body.id;
    const name = req.body.name;
    const price = req.body.price;
    const description = req.body.description;
    const imageUrl = req.body.imageUrl;

    if (typeof id !== "string") {
      res.status(400);
      throw new Error("'ID' precisa ser uma string.");
    }
    if (typeof name !== "string") {
      res.status(400);
      throw new Error("'Nome' precisa ser uma string.");
    }
    if (typeof price !== "number") {
      res.status(400);
      throw new Error("'Preço' precisa ser um número.");
    }
    if (typeof description !== "string") {
      res.status(400);
      throw new Error("'Descrição' precisa ser uma string.");
    }
    if (typeof imageUrl !== "string") {
      res.status(400);
      throw new Error("'Imagem' precisa ser uma string.");
    }

    const [existingID] = await db("products")
      .select()
      .where("id", "LIKE", `%${id}%`);

    if (existingID) {
      throw new Error("'ID' já existe.");
    }

    const newProduct = {
      id: id,
      name: name,
      price: price,
      description: description,
      image_url: imageUrl,
    };

    await db("products").insert(newProduct);
    res.status(201).send("Produto cadastrado com sucesso!");
  } catch (error: any) {
    console.log(error);

    if (res.statusCode === 200) {
      res.status(500);
    }
    res.send(error.message);
  }
});

app.post("/purchases", async (req: Request, res: Response) => {
  try {
    const id = req.body.id;
    const buyer = req.body.buyer;
    const products = req.body.products;

    if (typeof id !== "string") {
      res.status(400);
      throw new Error("'ID' precisa ser uma string.");
    }
    if (typeof buyer !== "string") {
      res.status(400);
      throw new Error("'Comprador' precisa ser uma string.");
    }

    const [idPurchase] = await db("purchases").select().where({ id: id });

    if (idPurchase) {
      res.status(400);
      throw new Error("ID já cadastrada.");
    }

    const [buyerResult] = await db("purchases").select().where({ id: buyer });

    if (buyerResult) {
      res.status(400);
      throw new Error("Comprador não encontrado.");
    }

    const resultProducts = [];
    let totalPrice = 0;
    for (let product of products) {
      const [productId] = await db("products").where({ id: product.id });

      if (!productId) {
        res.status(400);
        throw new Error(`${product.id} não encontrado.`);
      }
      resultProducts.push({
        ...product,
        price: productId.price,
        quantity: product.quantity,
      });
    }
    console.table(resultProducts);

    for (let product of resultProducts) {
      totalPrice += product.price * product.quantity;
    }

    const newPurchase = {
      id,
      buyer,
      total_price: totalPrice,
      created_at: data2.toISOString(),
    };

    await db("purchases").insert(newPurchase);

    for (let product of products) {
      const newPurchaseProducts = {
        purchase_id: id,
        product_id: product.id,
        quantity: product.quantity,
      };
      await db("purchases_products").insert(newPurchaseProducts);
    }

    res.status(201).send("Compra realizada com sucesso.");
  } catch (error: any) {
    console.log(error);

    if (res.statusCode === 200) {
      res.status(500);
    }
    res.send(error.message);
  }
});

app.put("/products/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const newId = req.body.id as string | undefined;
    const newName = req.body.name as string | undefined;
    const newPrice = req.body.price as number | undefined;
    const newDescription = req.body.description as string | undefined;
    const newImageUrl = req.body.imageUrl as string | undefined;

    const [productsIndex] = await db("products")
      .select()
      .where("id", "LIKE", `%${id}%`);

    if (productsIndex < 0) {
      res.status(404);
      throw new Error("Produto não encontrado.");
    }

    if (newId !== undefined) {
      if (typeof newId !== "string") {
        res.status(400);
        throw new Error("'ID' deve ser uma string.");
      }
    }

    if (newName !== undefined) {
      if (typeof newName !== "string") {
        res.status(400);
        throw new Error("'Nome' deve ser uma string. ");
      }
    }

    if (newPrice !== undefined) {
      if (typeof newPrice !== "number") {
        res.status(400);
        throw new Error("'Preço' deve ser um número.");
      }
    }

    if (newDescription !== undefined) {
      if (typeof newDescription !== "string") {
        res.status(400);
        throw new Error("'Descrição' deve ser uma string.");
      }
    }

    if (newImageUrl !== undefined) {
      if (typeof newImageUrl !== "string") {
        res.status(400);
        throw new Error("'Imagem' deve ser uma string.");
      }
    }

    const [product] = await db("products").select().where({ id: id });

    if (product) {
      const updateProduct = {
        id: newId || product.id,
        name: newName || product.name,
        description: newDescription || product.description,
        image_url: newImageUrl || product.imageUrl,
        price: newPrice || product.price,
      };
      await db("products").update(updateProduct).where({ id: id });
    } else {
      res.status(400);
      throw new Error("ID não encontrado.");
    }

    res.status(200).send("Produto atualizado com sucesso!");
  } catch (error: any) {
    console.log(error);

    if (res.statusCode === 200) {
      res.status(500);
    }
    res.send(error.message);
  }
});

app.delete("/users/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const [userIndex] = await db("users").select().where({ id: id });

    if (!userIndex) {
      res.status(404);
      throw new Error("Usuário não encontrado.");
    }
    
      await db("users").del().where({ id: id });
    

    res.status(200).send("User apagado com sucesso!");
  } catch (error: any) {
    console.log(error);

    if (res.statusCode === 200) {
      res.status(500);
    }
    res.send(error.message);
  }
});

app.delete("/products/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const [productsIndex] = await db("products").select().where({ id: id });

    if (!productsIndex) {
      res.status(404);
      throw new Error("Produto não encontrado.");
    }
    
      await db("products").del().where({ id: id });
    

    res.status(200).send("Produto apagado com sucesso!");
  } catch (error: any) {
    console.log(error);

    if (res.statusCode === 200) {
      res.status(500);
    }
    res.send(error.message);
  }
});

app.delete("/purchases/:id", async (req: Request, res: Response) => {
  try {
    const idToDel = req.params.id;

    const [purchasesIndex] = await db("purchases").where({ id: idToDel });
    
    if (!purchasesIndex) {
      res.status(404);
      throw new Error("Compra não encontrada.");
    }
   
      await db("purchases").del().where({ id: idToDel });
    
    res.status(200).send("Compra deletada com sucesso!");
  } catch (error: any) {
    console.log(error);

    if (res.statusCode === 200) {
      res.status(500);
    }
    res.send(error.message);
  }
});

app.get("/purchases", async (req: Request, res: Response) => {
  try {
    const result = await db("purchases");

    res.status(200).send(result);
  } catch (error: any) {
    console.log(error);

    if (res.statusCode === 200) {
      res.status(500);
    }
    res.send(error.message);
  }
});

app.get("/purchases/:id", async (req: Request, res: Response) => {
  try {
    const idFind = req.params.id;

    const [result] = await db
      .select(
        "purchases.id AS purchaseId",
        "purchases.buyer AS buyerId",
        "users.name AS buyerName",
        "users.email AS buyerEmail",
        "purchases.total_price AS totalPrice",
        "purchases.created_at AS createdAt"
      )
      .from("purchases")
      .innerJoin("users", "purchases.buyer", "=", "users.id")
      .where("purchases.id", "=", idFind);

    const productsList = await db
      .select(
        "products.id AS id",
        "products.name As name",
        "products.price AS price",
        "products.description AS description",
        "products.image_url AS imageUrl",
        "purchases_products.quantity AS quantity"
      )
      .from("purchases_products")
      .innerJoin(
        "products",
        "purchases_products.product_id",
        "=",
        "products.id"
      );

    const resultSelects = { ...result, products: productsList };

    res.status(200).send(resultSelects);

    if (idFind !== undefined) {
      if (idFind.length < 1) {
        res.statusCode = 400;
        throw new Error("ID deve ter ao menos 1 caractere.");
      }
    }
  } catch (error: any) {
    console.log(error);

    if (res.statusCode === 200) {
      res.status(500);
    }
    res.send(error.message);
  }
});
