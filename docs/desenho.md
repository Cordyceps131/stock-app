## REQUISITOS: Quem usa e para quê:
1. como administrador, quero adicionar ou remover permissoes aos utilizadores, para saber quem faz alterações na app
2. como operador, quero dar entrada produto, para que entre em stock
3. como operador, quero registar uma saida de de stock, para que o inventário reflita o que saiu do armazem
4. como administrador, quero adicionar um novo produto, para expansão da oferta de produtos
5. como operador, quero uma listagem do stock existente, para fazer contagem de inventário e conferir se bate certo
6. como administrador, quero adicionar um novo operador, para que este consiga utilizar a aplicação
7. como operador, quero fazer login, para que saibam o que foi feito por mim
8. como administrador, quero alerta de stock minimo
9. como administrador, quero consultar movimentos, para perceber quem alterou o stock e porquê
10. como administrador, quero criar movimentos de acerto, para corrigir um erro de stock
11. como administrador, quero criar movimentos de anulação, para corrigir um movimento errado
12. Como operador, quero transferir stock de uma localização para outra, para registar alterações de localização

## ENTIDADES:
1. Utilizadores
2. Produtos
3. Localizações
4. Categorias
5. Movimentos


## RELAÇÕES
utilizadores 1:N movimentos 
produtos N:M localizações -> resolvido pela tabela stock_localizacao 
produtos N:1 categorias 
movimentos N:1 produtos 
movimentos N:1 localizações



## ATRIBUTOS
Utilizadores 
1.  id INTEGER AUTOINCREMENT UNIQUE PK 
    nome TEXT NOT NULL 
    email TEXT NOT NULL UNIQUE 
    telemovel TEXT 
    password_hash TEXT NOT NULL 
    admin BOOL NOT NULL 


Produtos 
2.  id INTEGER AUTOINCREMENT UNIQUE PK 
    nome TEXT NOT NULL 
    preco DECIMAL NOT NULL 
    stock_minimo INTEGER NOT NULL 
    id_categoria INTEGER FK 


Localizações 
3.  id INTEGER AUTOINCREMENT UNIQUE PK 
    nome TEXT NOT NULL 


Stock-Localização 
3.1 id_produto PK_FK 
    id_localizacao PK_FK 
    quantidade INTEGER CHECK(quantidade >= 0) NOT NULL 


Categorias 
4.  id INTEGER AUTOINCREMENT UNIQUE PK 
    nome TEXT NOT NULL 


Movimentos 
5.  id INTEGER AUTOINCREMENT UNIQUE PK 
    tipo TEXT CHECK(tipo in ('entrada', 'saida', 'transferencia', 'acerto', 'quebra', 'anulacao')) NOT NULL 
    variacao INTEGER NOT NULL 
    data TIMESTAMPTZ DEFAULT now() 
    justificacao TEXT   
    id_produto FK NOT NULL 
    id_localizacao FK NOT NULL 
    id_utilizador FK NOT NULL 
    id_movimento_anulado FK 
    id_transferencia INTEGER