import { products, users, data2 } from "./database";
import express, { Request, Response } from "express";
import cors from "cors";
import { TProducts, TUsers } from "./types";

const app = express();

app.use(express.json());
app.use(cors());

app.listen(3003, () => {
  console.log("Servidor rodando na porta 3003");
});

app.get("/ping", (req: Request, res: Response) => {
  res.send("Pong!");
});

app.get("/users/:id", (req: Request, res: Response) => {
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

app.get("/products", (req: Request, res: Response) => {
  try{
    const name = req.query.name as string;
    const result = products.find((product) =>
    product.name.toLowerCase().includes(name.toLowerCase())
  );
    if(name.length < 1){
      throw new Error("'Nome do produto' deve possuir no mínimo 1 caractere.")
    }
    if(!result){
    res.status(404)
    throw new Error("Produto não encontrado.")
  }

  res.status(200).send(result);

  }catch(error: any){
    console.log(error)

    if(res.statusCode === 200){
      res.status(500)
    }
    res.send(error.message)
  }
});

app.post("/users", (req: Request, res: Response) => {
  try{

  const id = req.body.id as string;
  const name = req.body.name as string;
  const email = req.body.email as string;
  const password = req.body.password as string;

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

  const existingID = users.find((user)=> user.id === id)

  if(existingID){
    throw new Error("'ID' já existe.")
  }

  const existingEmail = users.find((user)=>user.email === email)

  if(existingEmail){
    throw new Error("'Email' já cadastrado.")
  }

  const newUser: TUsers = {
    id,
    name,
    email,
    password,
    createdAt: data2.toISOString(),
  };

  users.push(newUser);

  res.status(201).send("Cadastrado realizado com sucesso!");

}catch(error:any){
console.log(error)

    if(res.statusCode === 200){
      res.status(500)
    }
    res.send(error.message)
}

});

app.post("/products", (req: Request, res: Response) => {
  try{
  const id = req.body.id as string;
  const name = req.body.name as string;
  const price = req.body.price as number;
  const description = req.body.description as string;
  const imageUrl = req.body.imageUrl as string;

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

  const existingID = products.find((product)=> product.id === id)

  if(existingID){
    throw new Error("'ID' já existe.")
  }

  const newProduct: TProducts = {
    id,
    name,
    price,
    description,
    imageUrl,
  };

  products.push(newProduct);

  res.status(201).send("Produto cadastrado com sucesso!");

  }catch(error:any){
    console.log(error)
    
        if(res.statusCode === 200){
          res.status(500)
        }
        res.send(error.message)
    }
});

app.put("/products/:id", (req: Request, res: Response) => {
  try{
  const id = req.params.id;

  const newId = req.body.id as string | undefined;
  const newName = req.body.name as string | undefined;
  const newPrice = req.body.price as number | undefined;
  const newDescription = req.body.description as string | undefined;
  const newImageUrl = req.body.imageUrl as string | undefined;

  const productsIndex = products.findIndex((product) => product.id === id);

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

  const product = products.find((product) => product.id === id);

  if (product) {
    product.id = newId || product.id;
    product.name = newName || product.name;
    product.description = newDescription || product.description;
    product.imageUrl = newImageUrl || product.imageUrl;

    if (newPrice !== undefined) {
      product.price = newPrice;
    }
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

app.delete("/users/:id", (req: Request, res: Response) => {
  try{
  const id = req.params.id;

  const userIndex = users.findIndex((user) => user.id === id);
  
  if(userIndex < 0){
    res.status(404)
    throw new Error("Usuário não encontrado.")
  }
  if (userIndex >= 0) {
    users.slice(userIndex, 1);
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

app.delete("/products/:id", (req: Request, res: Response) => {
  try{
  const id = req.params.id;

  const productsIndex = products.findIndex((product) => product.id === id);

  if(productsIndex < 0){
    res.status(404)
    throw new Error("Produto não encontrado.")
  }
  if (productsIndex >= 0) {
    products.slice(productsIndex, 1);
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
