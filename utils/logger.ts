/**
 * Utilitário de logs controlado por variável de ambiente.
 * Só imprime no console se NEXT_PUBLIC_DEBUG_LOGS for 'true'.
 */
export const debugLog = (mensagem: string, dados?: any) => {
  if (process.env.NEXT_PUBLIC_DEBUG_LOGS === 'true') {
    if (dados !== undefined) {
      console.log(`[DEBUG] ${mensagem}`, dados);
    } else {
      console.log(`[DEBUG] ${mensagem}`);
    }
  }
};