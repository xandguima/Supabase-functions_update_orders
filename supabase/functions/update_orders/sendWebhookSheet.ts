// Função para enviar um webhook
export async function sendWebhook(url: string, data: Record<string, any>) {
  console.log("Enviando webhook...");
  try {
    await fetch(url, {
      method: "POST", // Método HTTP POST
      headers: {
        "Content-Type": "application/json", // Tipo de conteúdo JSON
      },
      body: JSON.stringify(data), // Converte os dados para JSON
    });

    console.log("Webhook enviado com sucesso!");
  } catch (error) {
    console.error("Erro ao enviar webhook:", error);
  }
}
