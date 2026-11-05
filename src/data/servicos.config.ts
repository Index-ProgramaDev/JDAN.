export const WHATSAPP_NUMERO = "5581998714983";
export const DIRECAO_CARROSSEL = "esquerda" as const;
export const SEGUNDOS_POR_CARD = 6;
export const RESPEITAR_MOVIMENTO_REDUZIDO = false;
export const MOSTRAR_PLACEHOLDER_PRINT = true;

export const PALETA = { bgcolor: "#1C1E1F", green: "#70EA58", yellow: "#FFD138" } as const;
export const EASE = [0.22, 1, 0.36, 1] as const;
export const CTA_FECHAMENTO = {
  titulo: "Tem uma ideia? Vamos tirar do papel.",
  subtitulo: "Me chama no WhatsApp e conversamos sobre o seu projeto.",
};

export const waLink = (servico: string) =>
  WHATSAPP_NUMERO
    ? `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(`Olá João! Vi o serviço de ${servico} no seu portfólio e gostaria de conversar.`)}`
    : "#";
