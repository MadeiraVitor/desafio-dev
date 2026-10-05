import { readFileSync } from "node:fs";
import { calcularComissoes, type Venda } from "./regras.js";

const brl = (centavos: number) =>
  (centavos / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

const { vendas } = JSON.parse(
  readFileSync(new URL("./vendas.json", import.meta.url), "utf-8"),
) as {
  vendas: Venda[];
};

const comissoes = calcularComissoes(vendas);

for (const [vendedor, total] of comissoes) {
  console.log(`${vendedor}: ${brl(total)}`);
}
