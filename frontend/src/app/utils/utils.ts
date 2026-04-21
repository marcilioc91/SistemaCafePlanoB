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