import { describe, expect, it } from "vitest";
import { calcularJuros } from "./juros.js";

const data = (dia: number) => new Date(Date.UTC(2026, 9, dia));

describe("calcularJuros", () => {
  it.each([
    ["vencimento hoje", data(5), data(5), 0],
    ["vencimento ontem", data(4), data(5), 1],
    ["vencimento amanhã", data(6), data(5), 0],
  ])("%s", (_descricao, vencimento, atual, diasEmAtraso) => {
    expect(calcularJuros(10_000, vencimento, atual)).toMatchObject({
      diasEmAtraso,
      jurosCentavos: diasEmAtraso * 250,
      valorAtualizadoCentavos: 10_000 + diasEmAtraso * 250,
    });
  });

  it("compara somente as datas e não o horário perto da virada do dia", () => {
    const vencimento = new Date("2026-10-05T23:59:00.000Z");
    const atual = new Date("2026-10-06T00:01:00.000Z");

    expect(calcularJuros(10_000, vencimento, atual)).toMatchObject({
      diasEmAtraso: 1,
      jurosCentavos: 250,
    });
  });
});
