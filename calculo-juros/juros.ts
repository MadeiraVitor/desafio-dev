const MULTA_DIARIA = 0.025;
const MILISSEGUNDOS_POR_DIA = 24 * 60 * 60 * 1000;

export interface ResultadoJuros {
  valorOriginalCentavos: number;
  diasEmAtraso: number;
  jurosCentavos: number;
  valorAtualizadoCentavos: number;
}

function dataSemHorario(data: Date): Date {
  return new Date(
    Date.UTC(data.getUTCFullYear(), data.getUTCMonth(), data.getUTCDate()),
  );
}

export function calcularJuros(
  valorOriginalCentavos: number,
  dataVencimento: Date,
  dataAtual = new Date(),
): ResultadoJuros {
  if (!Number.isInteger(valorOriginalCentavos) || valorOriginalCentavos <= 0) {
    throw new Error("O valor deve ser maior que zero.");
  }
  if (Number.isNaN(dataVencimento.getTime())) {
    throw new Error("A data de vencimento é inválida.");
  }
  if (Number.isNaN(dataAtual.getTime())) {
    throw new Error("A data atual é inválida.");
  }

  const vencimento = dataSemHorario(dataVencimento);
  const hoje = dataSemHorario(dataAtual);
  const diferencaEmDias = Math.floor(
    (hoje.getTime() - vencimento.getTime()) / MILISSEGUNDOS_POR_DIA,
  );
  const diasEmAtraso = Math.max(0, diferencaEmDias);
  const jurosCentavos = Math.round(
    valorOriginalCentavos * MULTA_DIARIA * diasEmAtraso,
  );

  return {
    valorOriginalCentavos,
    diasEmAtraso,
    jurosCentavos,
    valorAtualizadoCentavos: valorOriginalCentavos + jurosCentavos,
  };
}

export function converterValorParaCentavos(valor: string): number {
  const normalizado = valor.trim().replace(/\s/g, "").replace(",", ".");
  const numero = Number(normalizado);

  if (!Number.isFinite(numero) || numero <= 0) {
    throw new Error("Informe um valor maior que zero.");
  }

  return Math.round(numero * 100);
}

export function converterData(data: string): Date {
  const entrada = data.trim();
  const partes = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(entrada);

  if (!partes) {
    throw new Error("Use a data no formato DD/MM/AAAA.");
  }

  const dia = Number(partes[1]);
  const mes = Number(partes[2]);
  const ano = Number(partes[3]);
  const dataConvertida = new Date(Date.UTC(ano, mes - 1, dia));

  if (
    dataConvertida.getUTCFullYear() !== ano ||
    dataConvertida.getUTCMonth() !== mes - 1 ||
    dataConvertida.getUTCDate() !== dia
  ) {
    throw new Error("A data de vencimento é inválida.");
  }

  return dataConvertida;
}

export const brl = (centavos: number) =>
  (centavos / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
