# Especificação de Requisitos e Modelo de Dados

Este documento detalha os requisitos de negócio, as entidades do sistema, as suas relações e a estrutura detalhada das tabelas da base de dados para a aplicação de gestão de inventário.

---

## 1. Requisitos de Negócio (User Stories)

### Perfis de Administrador
* **Gerir permissões:** Como administrador, quero adicionar ou remover permissões aos utilizadores, para saber quem faz alterações na aplicação.
* **Adicionar produtos:** Como administrador, quero adicionar um novo produto, para expansão da oferta de produtos.
* **Adicionar utilizadores:** Como administrador, quero adicionar um novo operador, para que este consiga utilizar a aplicação.
* **Alertas de stock:** Como administrador, quero um alerta de stock mínimo para evitar ruturas.
* **Consultar histórico:** Como administrador, quero consultar movimentos, para perceber quem alterou o stock e porquê.
* **Ajustes de inventário:** Como administrador, quero criar movimentos de acerto, para corrigir um erro de stock.
* **Anulações:** Como administrador, quero criar movimentos de anulação, para corrigir um movimento efetuado por erro.

### Perfis de Operador
* **Entrada de stock:** Como operador, quero dar entrada de um produto, para que este entre em stock.
* **Saída de stock:** Como operador, quero registar uma saída de stock, para que o inventário reflita o que saiu do armazém.
* **Listagem e contagem:** Como operador, quero uma listagem do stock existente, para fazer a contagem de inventário e conferir se os dados correspondem.
* **Autenticação:** Como operador, quero fazer login, para que as ações realizadas fiquem associadas ao meu perfil.
* **Transferência de stock:** Como operador, quero transferir stock de uma localização para outra, para registar alterações físicas de localização.

---

## 2. Diagrama de Relações (Cardinalidade)

* **Utilizadores (1:N) Movimentos:** Um utilizador pode registar vários movimentos; um movimento pertence a apenas um utilizador.
* **Produtos (N:M) Localizações:** Um produto pode estar em várias localizações e uma localização pode ter vários produtos. *Resolvido através da tabela intermédia `Stock-Localização` (1:N para ambas).*
* **Categorias (1:N) Produtos:** Uma categoria pode ter vários produtos; um produto pertence a apenas uma categoria.
* **Produtos (1:N) Movimentos:** Um produto pode ter vários movimentos de stock associados.
* **Localizações (1:N) Movimentos:** Uma localização pode registar vários movimentos de stock.

---

## 3. Modelo de Dados (Atributos e Tabelas)

### 3.1. Utilizadores
* `id`: **INTEGER** `AUTOINCREMENT` `UNIQUE` `PK`
* `nome`: **TEXT** `NOT NULL`
* `email`: **TEXT** `NOT NULL` `UNIQUE`
* `telemovel`: **TEXT**
* `password_hash`: **TEXT** `NOT NULL`
* `admin`: **BOOLEAN** `NOT NULL`

### 3.2. Categorias
* `id`: **INTEGER** `AUTOINCREMENT` `UNIQUE` `PK`
* `nome`: **TEXT** `NOT NULL`

### 3.3. Produtos
* `id`: **INTEGER** `AUTOINCREMENT` `UNIQUE` `PK`
* `nome`: **TEXT** `NOT NULL`
* `preco`: **DECIMAL** `NOT NULL`
* `stock_minimo`: **INTEGER** `NOT NULL`
* `id_categoria`: **INTEGER** `FK` (Referências `Categorias(id)`)

### 3.4. Localizações
* `id`: **INTEGER** `AUTOINCREMENT` `UNIQUE` `PK`
* `nome`: **TEXT** `NOT NULL`

### 3.5. Stock-Localização (Tabela Intermédia / Pivot)
* `id_produto`: **INTEGER** `PK` `FK` (Referências `Produtos(id)`)
* `id_localizacao`: **INTEGER** `PK` `FK` (Referências `Localizações(id)`)
* `quantidade`: **INTEGER** `NOT NULL` `CHECK(quantidade >= 0)`

### 3.6. Movimentos
* `id`: **INTEGER** `AUTOINCREMENT` `UNIQUE` `PK`
* `tipo`: **TEXT** `NOT NULL` `CHECK(tipo IN ('entrada', 'saida', 'transferencia', 'acerto', 'quebra', 'anulacao'))`
* `variacao`: **INTEGER** `NOT NULL` *(Quantidade adicionada ou removida)*
* `data`: **TIMESTAMPTZ** `DEFAULT now()`
* `justificacao`: **TEXT**
* `id_produto`: **INTEGER** `FK` `NOT NULL` (Referências `Produtos(id)`)
* `id_localizacao`: **INTEGER** `FK` `NOT NULL` (Referências `Localizações(id)`)
* `id_utilizador`: **INTEGER** `FK` `NOT NULL` (Referências `Utilizadores(id)`)
* `id_movimento_anulado`: **INTEGER** `FK` `NULL` (Referências `Movimentos(id)`)
* `id_transferencia`: **INTEGER** `NULL` *(Usado para ligar o movimento de saída ao de entrada numa transferência)*

CREATE TABLE movimentos (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tipo TEXT NOT NULL CHECK (tipo IN ('entrada', 'saida', 'transferencia', 'acerto', 'quebra', 'anulacao')),
    variacao INTEGER NOT NULL,
    data TIMESTAMPTZ DEFAULT now(),
    justificacao TEXT,
    id_produto INTEGER NOT NULL,
    id_localizacao INTEGER NOT NULL,
    id_utilizador INTEGER NOT NULL,
    id_movimento_anulado INTEGER,
    id_transferencia INTEGER,

    -- Chaves Estrangeiras (Foreign Keys)
    CONSTRAINT fk_movimentos_produto 
        FOREIGN KEY (id_produto) 
        REFERENCES produtos(id) 
        ON DELETE RESTRICT,
        
    CONSTRAINT fk_movimentos_localizacao 
        FOREIGN KEY (id_localizacao) 
        REFERENCES localizacoes(id) 
        ON DELETE RESTRICT,
        
    CONSTRAINT fk_movimentos_utilizador 
        FOREIGN KEY (id_utilizador) 
        REFERENCES utilizadores(id) 
        ON DELETE RESTRICT,
        
    CONSTRAINT fk_movimentos_anulado 
        FOREIGN KEY (id_movimento_anulado) 
        REFERENCES movimentos(id) 
        ON DELETE SET NULL
);
