import { describe, expect, it } from "vitest";
import { calcularComissoes } from "./regras.js";

describe("calcularComissoes", () => {
  it.each([
    [99.99, 0],
    [100, 100],
    [499.99, 500],
    [500, 2500],
  ])("aplica a faixa correta para R$ %s", (valor, comissao) => {
    expect(calcularComissoes([{ vendedor: "Ana", valor }])).toEqual(
      new Map([["Ana", comissao]]),
    );
  });
});
