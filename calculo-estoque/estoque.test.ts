import { describe, expect, it } from "vitest";
import { criarControleEstoque } from "./estoque.js";

const criarEstoque = () =>
  criarControleEstoque([
    { codigoProduto: 101, descricaoProduto: "Caneta Azul", estoque: 150 },
  ]);

describe("criarControleEstoque", () => {
  it("permite uma saída igual ao estoque disponível", () => {
    const controle = criarEstoque();

    const resultado = controle.lancarMovimentacao(101, "saida", 150, "Venda");

    expect(resultado.estoqueFinal).toBe(0);
  });

  it("rejeita uma saída superior ao estoque disponível", () => {
    const controle = criarEstoque();

    expect(() =>
      controle.lancarMovimentacao(101, "saida", 151, "Venda"),
    ).toThrow("Estoque insuficiente. Disponível para saída: 150.");
  });
});
