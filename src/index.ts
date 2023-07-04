
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

// console.log(user);
// console.log(products)
