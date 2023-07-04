
import {products, users, data2 } from "./database";
import  express, { Request, Response} from "express";
import cors from 'cors';
import { TProducts, TUsers } from "./types";

const app = express();

app.use(express.json());
app.use(cors());

app.listen(3003, () => {
    console.log("Servidor rodando na porta 3003");
});

app.get('/ping', (req: Request, res: Response) => {
    res.send('Pong!')
  });

app.get("/users", (req: Request, res: Response) => {
    res.status(200).send(users)
})

app.get("/products", (req: Request, res: Response) => {
    const name = req.query.name as string

    const result= products.filter(
        (product)=> product.name.toLowerCase().includes(name.toLowerCase())
    )
    res.status(200).send(result)
})

app.post("/users", (req: Request, res: Response) => {
    const id = req.body.id as string
    const name = req.body.name as string
    const email = req.body.email as string
    const password = req.body.password as string

    const newUser: TUsers = {
        id,
        name,
        email,
        password,
        createdAt: data2.toISOString()
    }

    users.push(newUser)

    res.status(201).send("Cadastrado realizado com sucesso!")
})

app.post("/products", (req: Request, res: Response) => {
    const id = req.body.id as string
    const name = req.body.name as string
    const price = req.body.price as number
    const description = req.body.description as string
    const imageUrl = req.body.imageUrl as string

    const newProduct: TProducts = {
        id,
        name,
        price,
        description,
        imageUrl
    }

    products.push(newProduct)

    res.status(201).send("Produto cadastrado com sucesso!")
})

app.put("/products/:id", (req: Request, res: Response) => {
    const id = req.params.id

    const newId = req.body.id as string | undefined
    const newName = req.body.name as string | undefined
    const newPrice = req.body.price as number | undefined
    const newDescription = req.body.description as string | undefined
    const newImageUrl = req.body.imageUrl as string | undefined

    const product = products.find((product) => product.id === id)

    if(product){
        product.id = newId || product.id
        product.name = newName || product.name
        product.description = newDescription || product.description
        product.imageUrl = newImageUrl || product.imageUrl
        
        if(newPrice !== undefined){
            product.price = newPrice
        }
    }

    res.status(200).send("Produto atualizado com sucesso!")
})

app.delete("/users/:id", (req: Request, res: Response) => {
    const id = req.params.id

    const userIndex = users.findIndex((user)=> user.id === id)

    if(userIndex >=0){
        users.slice(userIndex, 1)
    }

    res.status(200).send("User apagado com sucesso!")
})

app.delete("/products/:id", (req: Request, res: Response) => {
    const id = req.params.id

    const productsIndex = products.findIndex((product)=> product.id === id)

    if(productsIndex >=0){
        products.slice(productsIndex, 1)
    }

    res.status(200).send("Produto apagado com sucesso!")
})

// console.log(user);
// console.log(products)

