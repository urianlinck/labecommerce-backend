-- Active: 1688992608956@@127.0.0.1@3306

CREATE TABLE
    users (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TEXT NOT NULL
    );

SELECT * FROM users;

INSERT INTO
    users (
        id,
        name,
        email,
        password,
        created_at
    )
VALUES (
        "user03",
        "Diógenes",
        "dio@gmail.com",
        "senhadodio",
        "data2.toISOString()"
    );

UPDATE users SET created_at = DATE('now') WHERE id = "user03";

INSERT INTO
    users (
        id,
        name,
        email,
        password,
        created_at
    )
VALUES (
        "user04",
        "Guistavo",
        "guis@bol.com",
        "guisafad0",
        DATE('now')
    ), (
        "user05",
        "Maitê",
        "mai.te@outlook.com",
        "aikeL0ucura",
        DATE('now')
    );

CREATE TABLE
    products (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        name TEXT NOT NULL,
        price NUMBER NOT NULL,
        description TEXT NOT NULL,
        image_url TEXT NOT NULL
    );

SELECT * FROM products;

INSERT INTO
    products (
        id,
        name,
        price,
        description,
        image_url
    )
VALUES (
        "p03",
        "bolsa de couro",
        60,
        "bolsa e couro preta",
        "https://images.tcdn.com.br/img/img_prod/710993/bolsa_couro_pequena_mini_preta_17_1_20190801104619.jpg"
    ), (
        "p04",
        "bota de couro",
        120,
        "bota de couro preta com salto e cano curto",
        "https://d2ar6xj8wdvg55.cloudfront.net/Custom/Content/Products/11/35/1135418_bota-essential-salto-fino-couro-preto195033e-1-2_m1_638126582918830134.jpg"
    ), (
        "p05",
        "harness",
        90,
        "harness de couro preto",
        "https://images.tcdn.com.br/img/img_prod/750599/harness_top_437_1_1361827fc8d7f74fa4c755b9bb4802f2.jpg"
    ), (
        "p06",
        "choker",
        40,
        "choker de couro com pingente de morcego",
        "https://images.tcdn.com.br/img/img_prod/1076412/choker_de_couro_com_pingente_de_morcego_preto_bloodlust_1055_1_296c73b67bab2c83bc3088a3e7f91a1e.jpg"
    ), (
        "p07",
        "mascara de couro",
        70,
        "mascara de couro mulher gato",
        "https://www.lojastyleme.com.br/cdn/shop/products/mascara-de-couro-mulher-gato_3_650x.jpg?v=1662041851"
    );

SELECT * FROM users AS usuários;

SELECT * FROM products AS produtos;

SELECT * FROM products WHERE name LIKE '%couro';

INSERT INTO
    users (
        id,
        name,
        email,
        password,
        created_at
    )
VALUES (
        "user06",
        "wanda visão",
        "visaumamoreterno@uol.com",
        "familiaeamor",
        DATE('now')
    );

INSERT INTO
    products (
        id,
        name,
        price,
        description,
        image_url
    )
VALUES (
        "p08",
        "algemas de couro",
        25,
        "algemas de couro com  corrente",
        "https://cdn.iset.io/assets/54665/produtos/65/algema_em_couro_sint_tico_preta.jpg"
    );

DELETE FROM users WHERE id = 'user06';

DELETE FROM products WHERE id = 'p08';

UPDATE products
SET
    price = 50,
    description = 'bolsa de couro preta'
WHERE id = 'p03';

CREATE TABLE
    purchases (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        buyer TEXT NOT NULL,
        total_price NUMBER NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY (buyer) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE
    );

DROP TABLE purchases;

INSERT INTO
    purchases (
        id,
        buyer,
        total_price,
        created_at
    )
VALUES (
        'pur01',
        'user03',
        50,
        DATE('now')
    ), (
        'pur02',
        'user04',
        75,
        DATE('now')
    );

UPDATE purchases SET total_price = 60 WHERE id = 'pur01';

SELECT * FROM purchases;

SELECT
    purchases.id,
    users.id,
    users.name,
    users.email,
    purchases.total_price,
    DATE('now')
FROM purchases
    INNER JOIN users ON purchases.buyer = users.id;

CREATE TABLE
    purchases_products (
        purchase_id TEXT NOT NULL,
        product_id TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        FOREIGN KEY (purchase_id) REFERENCES purchases (id) ON UPDATE CASCADE ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products (id) ON UPDATE CASCADE ON DELETE CASCADE
    );

INSERT INTO
    purchases_products (
        purchase_id,
        product_id,
        quantity
    )
VALUES ('pur01', "p06", 3), ('pur02', "p07", 5), ('pur01', "p05", 2);

SELECT *
FROM purchases_products
    INNER JOIN purchases ON purchases_products.purchase_id = purchase_id
    INNER JOIN products ON products.id = purchases_products.product_id
WHERE
    purchases.id = purchases_products.purchase_id;