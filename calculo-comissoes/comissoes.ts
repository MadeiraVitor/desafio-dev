import { readFileSync } from "node:fs";

interface Venda {
  vendedor: string;
  valor: number;
}

const LIMITE_MINIMO = 10_000;
const LIMITE_ALTO = 50_000;

function calcularComissao(valorCentavos: number): number {
  if (valorCentavos < LIMITE_MINIMO) return 0;
  if (valorCentavos < LIMITE_ALTO) return valorCentavos * 0.01;
  return valorCentavos * 0.05;
}

function calcularComissoes(vendas: Venda[]): Map<string, number> {
  const totais = new Map<string, number>();

  for (const { vendedor, valor } of vendas) {
    const centavos = Math.round(valor * 100);
    totais.set(
      vendedor,
      (totais.get(vendedor) ?? 0) + calcularComissao(centavos),
    );
  }

  for (const [vendedor, total] of totais)
    totais.set(vendedor, Math.round(total));
  return totais;
}

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
