export type TipoMovimentacao = "entrada" | "saida";

export interface Produto {
  codigoProduto: number;
  descricaoProduto: string;
  estoque: number;
}

export interface Movimentacao {
  numero: number;
  codigoProduto: number;
  tipo: TipoMovimentacao;
  quantidade: number;
  descricao: string;
}

export interface ResultadoMovimentacao {
  movimentacao: Movimentacao;
  estoqueFinal: number;
}

export function criarControleEstoque(produtosIniciais: Produto[]) {
  const produtos = new Map(
    produtosIniciais.map((produto) => [produto.codigoProduto, { ...produto }]),
  );
  const movimentacoes: Movimentacao[] = [];
  let proximoNumero = 1;

  function lancarMovimentacao(
    codigoProduto: number,
    tipo: TipoMovimentacao,
    quantidade: number,
    descricao: string,
  ): ResultadoMovimentacao {
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

  return { lancarMovimentacao };
}
