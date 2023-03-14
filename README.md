<p align="center">
  <a href="https://github.com/luiseduardosilva" target="blank"><img src="https://github.com/luiseduardosilva/transaction-service/blob/main/doc/wallet.png"  alt="Project" /></a>
</p>

## Transaction Service

Transaction service consiste em uma aplicação para controle de transações, onde é possível, Adicionar valor, remover valor, fazer uma compra, cancelar uma compra e estornar uma compra e extrato. Compras feitas ate `10 minutos` podem ser `canceladas`, acima desse tempo só podem ser `estornada`.

## Clonando projeto

```
git clone https://github.com/luiseduardosilva/transaction-service.git
```

## Copiar .env

```
cop .env.example .env
```

## Instalando dependencias

```
npm i
```

## Rodando migrations

```
npm run typeorm:run-migrations
```

## Iniciando aplicação em Docker

```
docker compose -f dev.docker-compose.yml up -d
```

## Swagger

<a href="http://localhost:3002/docs" target="blank">http://localhost:3002/docs</a>
