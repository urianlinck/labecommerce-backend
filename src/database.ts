import { TProducts, TUsers } from "./types";

// data e hora atual a região
let data = new Date();

// O data.valueOf() irá retornar a data em ms (milissegundos). Então é preciso converter o GMT também em milissegundos: data.getTimezoneOffset() * 60000.
export let data2 = new Date(data.valueOf() - data.getTimezoneOffset() * 60000);


export const users: TUsers[] = [
    {
        id: "user01",
        name: "Amy Lee",
        email: "amylee.trevosinha@bol.com.br",
        password: "3van3sc3nc3",
        createdAt: data2.toISOString()
    },

    {
        id: "user02",
        name: "Avril Lavigne",
        email: "sk4ter.boy@yahoo.com.br",
        password: "Com_pli_cated",
        createdAt: data2.toISOString() 
    }
];

export const products: TProducts[] = [
    {
        id: "product01",
        name: "cinto de tachinhas",
        price: 30.00,
        description: "cinto de couro, coberto com tachinhas quadradas metalicas e fechamento com fivela",
        imageUrl: "https://http2.mlstatic.com/D_NQ_NP_769184-CBT49861291708_052022-O.webp"
    },

    {
        id: "product02",
        name: "pulseira de spike",
        price: 50.00,
        description: "pulseira de couro com spikes pontudos metálicos e fechamento com botão",
        imageUrl: "https://http2.mlstatic.com/D_NQ_NP_832544-MLB53605632308_022023-O.webp"
    }  
]

export function createUser(id: string, name: string, email: string, password: string): void{
    const newUser: TUsers = { id, name, email, password, createdAt: data2.toISOString() };
    users.push(newUser);
    console.log('Cadastrado realizado com sucesso:', newUser);
}

export function getAllUsers() : TUsers[] {
    return users;
}

export function createProduct(id: string, name: string, price: number, description: string, imageUrl: string): void{
    const newProduct: TProducts = {id, name, price, description, imageUrl};
    products.push(newProduct);
    console.log("Produto criado com sucesso")
}

export function getAllProducts() : TProducts[] {
    return products;
}

export function searchProductsByName(name: string){
    const productSearch = products.filter((product)=>{
        return product.name.toLowerCase() === name.toLowerCase();
    })
    return productSearch
}