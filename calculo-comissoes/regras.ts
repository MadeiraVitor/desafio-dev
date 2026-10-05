export interface Venda {
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

export function calcularComissoes(vendas: Venda[]): Map<string, number> {
  const totais = new Map<string, number>();

  for (const { vendedor, valor } of vendas) {
    const centavos = Math.round(valor * 100);
    totais.set(
      vendedor,
      (totais.get(vendedor) ?? 0) + calcularComissao(centavos),
    );
  }

  for (const [vendedor, total] of totais) {
    totais.set(vendedor, Math.round(total));
  }
  return totais;
}
