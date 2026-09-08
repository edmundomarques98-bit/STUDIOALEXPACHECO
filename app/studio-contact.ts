export function whatsappUrl(plan?: string) {
  const message = 'Olá, Alex! Vi as evoluções do Studio e quero dar o primeiro passo. Gostei da proposta de treinar com orientação e no meu ritmo. ' + (plan ? `Tenho interesse no programa ${plan}. ` : "") + 'Quero ganhar mais disposição e criar uma rotina de treino. Podemos conversar sobre os horários e como agendar minha primeira aula?';
  return "https://wa.me/5585998073701?text=" + encodeURIComponent(message);
}
