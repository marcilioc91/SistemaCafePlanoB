export function formatarTelefone(tel?: string): string {
  if (!tel) return '—';

  const v = String(tel).replace(/\D/g, '');

  if (v.length === 11) {
    return `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7)}`;
  }

  if (v.length === 10) {
    return `(${v.slice(0, 2)}) ${v.slice(2, 6)}-${v.slice(6)}`;
  }

  return '—';
}

export function cpfValido(cpf: string): boolean {
  const n = cpf.replace(/\D/g, '');
  if (n.length !== 11 || /^(\d)\1+$/.test(n)) return false;
  let soma = 0;
  for (let i = 0; i < 9; i++) soma += +n[i] * (10 - i);
  let d1 = 11 - (soma % 11);
  if (d1 >= 10) d1 = 0;
  if (d1 !== +n[9]) return false;
  soma = 0;
  for (let i = 0; i < 10; i++) soma += +n[i] * (11 - i);
  let d2 = 11 - (soma % 11);
  if (d2 >= 10) d2 = 0;
  return d2 === +n[10];
}

export function emailValido(email: string): boolean {
  return /^[\w+.%-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(email);
}