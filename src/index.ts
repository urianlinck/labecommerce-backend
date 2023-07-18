import { products, users, data2 } from "./database";
import express, { Request, Response } from "express";
import cors from "cors";
import { TProducts, TUsers } from "./types";
import { db } from "./database-sql/knex";

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
  try{
    const result = await db.raw(`
      SELECT * FROM users;
    `)

    res.status(200). send(result)
  }catch(error){
    console.log(error)

    if (req.statusCode === 200){
      res.status(500)
    }

    if (error instanceof Error){
      res.send(error.message)
    }else {
      res.send("Erro inesperado.")
    }
  }
})

app.get("/users/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id
    const result = users.find((user)=>user.id === id)

    if(!result){
      res.status(404)
      throw new Error("Usuário não encontrado.")
    }

    res.status(200).send(result);

  }catch (error: any){
    console.log(error)

    if(res.statusCode === 200){
      res.status(500)
    }
    res.send(error.message)
  }
  
});

app.get("/products", async (req: Request, res: Response) => {
  try{
    const name = req.query.name as string;
    
    if(!name){
      const result = await db.raw(`SELECT * FROM products`)
      return res.status(200).send(result);
    }
    if(name.length > 2){
      const result = await db.raw(`SELECT * FROM products WHERE name LIKE '%${name}%'`)
      res.status(200).send(result);
    }
    if(name.length < 2){
      res.status(400);
      throw new Error("'Name' deve ter ao menos 2 caracteres.");
    }

  }catch(error: any){
    console.log(error)

    if(res.statusCode === 200){
      res.status(500)
    }
    res.send(error.message)
  }
});

app.post("/users", async (req: Request, res: Response) => {
  try{

  const id = req.body.id 
  const name = req.body.name 
  const email = req.body.email 
  const password = req.body.password 

  if(typeof id !== "string"){
    res.status(400)
    throw new Error("'ID' precisa ser uma string.")
  }
  if(typeof name !== "string"){
    res.status(400)
    throw new Error("'Nome' precisa ser uma string.")
  }
  if(typeof email !== "string"){
    res.status(400)
    throw new Error("'Email' precisa ser uma string.")
  }
  if(typeof password !== "string"){
    res.status(400)
    throw new Error("'Senha' precisa ser uma string.")
  }

  const [existingID] = await db.raw(`
    SELECT * FROM users
    WHERE id = '${id}'
  `)

  if(existingID){
    throw new Error("'ID' já existe.")
  }

  const [existingEmail] = await db.raw(`
    SELECT * FROM users
    WHERE email = '${email}'
  `)

  if(existingEmail){
    throw new Error("'Email' já cadastrado.")
  }

  await db.raw(`
  INSERT INTO users(id, name, email, password, created_at)
  VALUES ('${id}','${name}','${email}','${password}', '${data2.toISOString()}');
  `)

  res.status(201).send("Cadastrado realizado com sucesso!");

}catch(error:any){
console.log(error)

    if(res.statusCode === 200){
      res.status(500)
    }
    res.send(error.message)
}

});

app.post("/products", async (req: Request, res: Response) => {
  try{
  const id = req.body.id 
  const name = req.body.name 
  const price = req.body.price 
  const description = req.body.description 
  const imageUrl = req.body.imageUrl 

  if(typeof id !== "string"){
    res.status(400)
    throw new Error("'ID' precisa ser uma string.")
  }
  if(typeof name !== "string"){
    res.status(400)
    throw new Error("'Nome' precisa ser uma string.")
  }
  if(typeof price !== "number"){
    res.status(400)
    throw new Error("'Preço' precisa ser um número.")
  }
  if(typeof description !== "string"){
    res.status(400)
    throw new Error("'Descrição' precisa ser uma string.")
  }
  if(typeof imageUrl !== "string"){
    res.status(400)
    throw new Error("'Imagem' precisa ser uma string.")
  }

  const [existingID] = await db.raw(`
    SELECT * FROM products
    WHERE id = '${id}'
  `)

  if(existingID){
    throw new Error("'ID' já existe.")
  }

  await db.raw(`
    INSERT INTO products (id, name, price, description, image_url)
    VALUES ('${id}','${name}','${price}','${description}','${imageUrl}');
  `)

  res.status(201).send("Produto cadastrado com sucesso!");

  }catch(error:any){
    console.log(error)
    
        if(res.statusCode === 200){
          res.status(500)
        }
        res.send(error.message)
    }
});

app.post("/purchases", async (req: Request, res: Response) => {
  try{
    const id = req.body.id
    const buyer = req.body.buyer
    const totalPrice = req.body.total_price
    const createdAt = data2.toISOString()

    if(typeof id !== "string"){
      res.status(400)
      throw new Error("'ID' precisa ser uma string.")
    }
    if(typeof buyer !== "string"){
      res.status(400)
      throw new Error("'Comprador' precisa ser uma string.")
    }
    if(typeof totalPrice !== "number"){
      res.status(400)
      throw new Error("'Preço total' precisa ser um número.")
    }

    const [idResult] = await db.raw(`
    SELECT * FROM purchases WHERE id = '${id}'
    `);

    if(idResult){
      res.status(400)
      throw new Error("ID já cadastrada.")
    }

    const [buyerResult] = await db.raw(`
    SELECT * FROM purchases WHERE id = '${buyer}'
    `);

    if(buyerResult){
      res.status(400)
      throw new Error("Comprador não encontrado.")
    }

    for (let i=0; i<=products.length; i++){
      const [productId] = await db.raw(`
        SELECT * FROM products WHERE id = '${products[i]}'
      `);

      if(!productId){
        res.status(400)
        throw new Error("Id do produto não encontrado.")
      }
    }

    await db.raw(`
    INSERT INTO purchases (id, buyer, total_price, created_at)
    VALUES ('${id},'${buyer},'${totalPrice},'${createdAt});
    `)
    res.status(201).send("Compra realizada com sucesso.")

  }catch(error:any){
    console.log(error)
    
        if(res.statusCode === 200){
          res.status(500)
        }
        res.send(error.message)
    }
})

app.put("/products/:id", async (req: Request, res: Response) => {
  try{
  const id = req.params.id;

  const newId = req.body.id as string | undefined;
  const newName = req.body.name as string | undefined;
  const newPrice = req.body.price as number | undefined;
  const newDescription = req.body.description as string | undefined;
  const newImageUrl = req.body.imageUrl as string | undefined;

  const [productsIndex] = await db.raw(`
    SELECT * FROM products
    WHERE ID = '${id}'
  `)
  // products.findIndex((product) => product.id === id);

  if(productsIndex < 0){
    res.status(404)
    throw new Error("Produto não encontrado.")
  }

  if(newId !== undefined){
    if(typeof newId !== "string"){
    res.status(400)
    throw new Error("'ID' deve ser uma string.")
    }
  }

  if(newName !== undefined){
    if(typeof newName !== "string"){
    res.status(400)
    throw new Error("'Nome' deve ser uma string. ")
    }
  }

  if(newPrice !== undefined){
    if(typeof newPrice !== "number"){
    res.status(400)
    throw new Error("'Preço' deve ser um número.")
    }
  }

  if(newDescription !== undefined){
    if(typeof newDescription !== "string"){
    res.status(400)
    throw new Error("'Descrição' deve ser uma string.")
    }
  }

  if(newImageUrl !== undefined){
    if(typeof newImageUrl !== "string"){
    res.status(400)
    throw new Error("'Imagem' deve ser uma string.")
    }
  }

  const [product] = await db.raw(`
    SELECT * FROM products
    WHERE id = '${id}'
  `)

  if (product) {
    await db.raw(`
      UPDATE products
      SET 
          id = "${newId || product.id}",
          name = "${newName || product.name}",
          description = "${newDescription || product.description}",
          image_url = "${newImageUrl || product.imageUrl}",
          price = "${newPrice || product.price}"
      WHERE
          id = "${id}";
    `)

  }else {
    res.status(400)
    throw new Error("ID não encontrado.")
  }

  res.status(200).send("Produto atualizado com sucesso!");

}catch(error:any){
  console.log(error)
  
      if(res.statusCode === 200){
        res.status(500)
      }
      res.send(error.message)
  }
});

app.delete("/users/:id", async (req: Request, res: Response) => {
  try{
  const id = req.params.id;

  const [userIndex] = await db.raw(`
  SELECT * FROM users
  WHERE id = '${id}'
  `)
  
  if(userIndex < 0){
    res.status(404)
    throw new Error("Usuário não encontrado.")
  }
  if (userIndex >= 0) {
    await db.raw(`
    DELETE FROM users
    WHERE id = '${id}'
    `)
  }

  res.status(200).send("User apagado com sucesso!");

  }catch(error:any){
    console.log(error)
    
        if(res.statusCode === 200){
          res.status(500)
        }
        res.send(error.message)
    }
});

app.delete("/products/:id", async (req: Request, res: Response) => {
  try{
  const id = req.params.id;

  const [productsIndex] = await db.raw(`
  SELECT * FROM products
  WHERE id = '${id}'
  `)

  if(productsIndex < 0){
    res.status(404)
    throw new Error("Produto não encontrado.")
  }
  if (productsIndex >= 0) {
    await db.raw(`
    DELETE FROM products
    WHERE id = '${id}'
    `)
  }

  res.status(200).send("Produto apagado com sucesso!");

  }catch(error:any){
    console.log(error)
    
        if(res.statusCode === 200){
          res.status(500)
        }
        res.send(error.message)
    }
});

app.delete("/purchases/:id", async (req: Request, res: Response) => {
  try{
    const id = req.params.id;

    const [purchasesIndex] = await db.raw(`
    SELECT * FROM purchases
    WHERE id = '${id}'
    `)

    if(purchasesIndex < 0){
      res.status(404)
      throw new Error("Compra não encontrada.")
    }
    if (purchasesIndex >= 0){
      await db.raw(`
      DELETE FROM purchases
      WHERE id = "${id}";
      `)
    }
    res.status(200).send("Compra deletada com sucesso!")

  }catch(error:any){
    console.log(error)
    
        if(res.statusCode === 200){
          res.status(500)
        }
        res.send(error.message)
    }
})