import { readFileSync } from "node:fs";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import {
  criarControleEstoque,
  type Produto,
  type TipoMovimentacao,
} from "./estoque.js";

const dados = JSON.parse(
  readFileSync(new URL("./estoque.json", import.meta.url), "utf-8"),
) as { estoque: Produto[] };
const controle = criarControleEstoque(dados.estoque);
export const lancarMovimentacao = controle.lancarMovimentacao;

async function perguntarMovimentacao(): Promise<void> {
  const readline = createInterface({ input, output });

  try {
    console.log("\nProdutos disponíveis:");
    for (const produto of dados.estoque) {
      console.log(
        `${produto.codigoProduto} - ${produto.descricaoProduto} (estoque: ${produto.estoque})`,
      );
    }

    const codigo = Number(await readline.question("\nCódigo do produto: "));
    const tipo = (await readline.question(
      "Tipo (entrada/saida): ",
    )) as TipoMovimentacao;
    const quantidade = Number(await readline.question("Quantidade: "));
    const descricao = await readline.question("Descrição da movimentação: ");

    const resultado = lancarMovimentacao(
      codigo,
      tipo,
      quantidade,
      descricao,
    );

    console.log(`\nMovimentação ${resultado.movimentacao.numero} registrada.`);
    console.log(`Estoque final: ${resultado.estoqueFinal}`);
  } catch (error: unknown) {
    const mensagem =
      error instanceof Error ? error.message : "Erro inesperado.";
    console.error(`\nNão foi possível registrar a movimentação: ${mensagem}`);
    process.exitCode = 1;
  } finally {
    readline.close();
  }
}

perguntarMovimentacao();
