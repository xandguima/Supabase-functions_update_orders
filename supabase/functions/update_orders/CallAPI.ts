import {
  ResponseApiTinyObterPedido,
  ResponseApiTinyObterPedidosError,
} from "./types/responseTinyAPI.ts";

const urlObterPedido = Deno.env.get("MY_URL_TINY_OBTER_PEDIDO");
const token = Deno.env.get("MY_TOKEN_API_TINY");

// Type Guard
function isSuccessResponse(
  response: ResponseApiTinyObterPedido | ResponseApiTinyObterPedidosError,
): response is ResponseApiTinyObterPedido {
  return response.retorno.status_processamento === "3";
}

export async function APIobterPedido(id: number) {
  if (!urlObterPedido || !token) {
    throw new Error("URL e token sao necessarios para obter um pedido");
  }

  const data = `token=${token}&id=${id}&formato=JSON`;

  try {
    const response = await fetch(urlObterPedido, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: data,
    });

    const responseJson:
      | ResponseApiTinyObterPedido
      | ResponseApiTinyObterPedidosError = await response.json();

    // Verifique se a resposta é do tipo de sucesso
    if (isSuccessResponse(responseJson)) {
      const pedido = responseJson.retorno.pedido;
      console.log("Pedido obtido com sucesso:", pedido);
      return pedido;
    } else {
      // Se não for sucesso, lanço o erro
      throw new Error(responseJson.retorno.erros[0].erro);
    }
  } catch (error) {
    console.error("Erro na APIobterPedido:", error);
    throw error;
  }
}
