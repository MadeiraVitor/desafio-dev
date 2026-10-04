import { readFileSync } from "node:fs";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

type TipoMovimentacao = "entrada" | "saida";

interface Produto {
  codigoProduto: number;
  descricaoProduto: string;
  estoque: number;
}

interface Movimentacao {
  numero: number;
  codigoProduto: number;
  tipo: TipoMovimentacao;
  quantidade: number;
  descricao: string;
}

const dados = JSON.parse(
  readFileSync(new URL("./estoque.json", import.meta.url), "utf-8"),
) as { estoque: Produto[] };

const produtos = new Map(
  dados.estoque.map((produto) => [produto.codigoProduto, produto]),
);
const movimentacoes: Movimentacao[] = [];
let proximoNumero = 1;

export function lancarMovimentacao(
  codigoProduto: number,
  tipo: TipoMovimentacao,
  quantidade: number,
  descricao: string,
): { movimentacao: Movimentacao; estoqueFinal: number } {
  const produto = produtos.get(codigoProduto);

  if (!produto) {
    throw new Error(`Produto ${codigoProduto} não encontrado.`);
  }
  if (!["entrada", "saida"].includes(tipo)) {
    throw new Error("O tipo deve ser 'entrada' ou 'saida'.");
  }
  if (!Number.isInteger(quantidade) || quantidade <= 0) {
    throw new Error("A quantidade deve ser um número inteiro positivo.");
  }
  if (!descricao.trim()) {
    throw new Error("A descrição da movimentação é obrigatória.");
  }
  if (tipo === "saida" && quantidade > produto.estoque) {
    throw new Error(
      `Estoque insuficiente. Disponível para saída: ${produto.estoque}.`,
    );
  }

  produto.estoque += tipo === "entrada" ? quantidade : -quantidade;

  const movimentacao: Movimentacao = {
    numero: proximoNumero++,
    codigoProduto,
    tipo,
    quantidade,
    descricao: descricao.trim(),
  };
  movimentacoes.push(movimentacao);

  return { movimentacao, estoqueFinal: produto.estoque };
}

async function perguntarMovimentacao(): Promise<void> {
  const readline = createInterface({ input, output });

  try {
    console.log("\nProdutos disponíveis:");
    for (const produto of produtos.values()) {
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

    const resultado = lancarMovimentacao(codigo, tipo, quantidade, descricao);

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
