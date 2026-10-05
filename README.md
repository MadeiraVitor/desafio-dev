# Programas de cálculo

Projeto com três programas em TypeScript, executados pelos scripts definidos no
`package.json`.

## Pré-requisitos

- Node.js instalado.
- npm disponível no terminal.

Na primeira execução, instale as dependências:

```bash
npm install
```

Para executar os testes automatizados:

```bash
npm test
```

Os testes cobrem as faixas-limite de comissão, saídas de estoque iguais e
superiores ao estoque disponível e o cálculo de juros para vencimentos hoje,
ontem, amanhã e na virada do dia.

## 1. Cálculo de comissões

O programa lê as vendas do arquivo `calculo-comissoes/vendas.json`, calcula a
comissão de cada venda e exibe o total por vendedor.

Regras aplicadas por venda:

- abaixo de R$ 100,00: sem comissão;
- de R$ 100,00 até abaixo de R$ 500,00: comissão de 1%;
- a partir de R$ 500,00: comissão de 5%.

Para executar:

```bash
npm run comissoes
```

## 2. Cálculo de estoque

O programa carrega os produtos de `calculo-estoque/estoque.json` e permite
registrar uma movimentação de entrada ou saída. Ao iniciar, informe no terminal
o código do produto, o tipo, a quantidade e a descrição.

O programa valida se o produto existe, se a quantidade é positiva e se há
estoque suficiente para uma saída. Ao final, mostra o número da movimentação e
o estoque atualizado. A alteração é feita somente durante a execução e não
grava um novo estoque no arquivo JSON.

Para executar:

```bash
npm run estoque
```

## 3. Cálculo de juros

O programa calcula juros de mora sobre um valor em atraso. Ele solicita o
valor original e a data de vencimento no formato `DD/MM/AAAA`.

A taxa aplicada é de 2,5% por dia de atraso. O resultado exibe a quantidade de
dias em atraso, o valor dos juros e o valor atualizado. Se a data de
vencimento ainda não passou, não são adicionados juros.

Para executar:

```bash
npm run juros
```