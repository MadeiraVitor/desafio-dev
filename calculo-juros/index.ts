import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import {
  brl,
  calcularJuros,
  converterData,
  converterValorParaCentavos,
} from "./juros.js";

async function perguntarDados(): Promise<void> {
  const readline = createInterface({ input, output });

  try {
    const valor = converterValorParaCentavos(
      await readline.question("Valor original (R$): "),
    );
    const vencimento = converterData(
      await readline.question("Data de vencimento (DD/MM/AAAA): "),
    );
    const resultado = calcularJuros(valor, vencimento);

    console.log(`\nDias em atraso: ${resultado.diasEmAtraso}`);
    console.log(`Juros: ${brl(resultado.jurosCentavos)}`);
    console.log(`Valor atualizado: ${brl(resultado.valorAtualizadoCentavos)}`);
  } catch (error: unknown) {
    const mensagem =
      error instanceof Error ? error.message : "Erro inesperado.";
    console.error(`\nNão foi possível calcular os juros: ${mensagem}`);
    process.exitCode = 1;
  } finally {
    readline.close();
  }
}

perguntarDados();
