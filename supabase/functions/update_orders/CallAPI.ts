import {
  ResponseApiTinyError,
  ResponseApiTinyObterPedido,
  ResponseApiTinyPesquisaVendedores,
  ResponseAPIObterProduto
} from "./types/responseTinyAPI.ts";

const urlObterPedido = Deno.env.get("MY_URL_TINY_OBTER_PEDIDO");
const token = Deno.env.get("MY_TOKEN_API_TINY");
const urlPesquisaVendedores = Deno.env.get("MY_URL_TINY_PESQUISA_VENDEDORES");
const urlObterProduto = Deno.env.get("MY_URL_OBTER_PRODUTO");

// Type Guard
function isSuccessResponseObterPedido(
  response: ResponseApiTinyObterPedido | ResponseApiTinyError,
): response is ResponseApiTinyObterPedido {
  return response.retorno.status_processamento === "3";
}

function isSuccessResponsePesquisaVendedores(
  response: ResponseApiTinyPesquisaVendedores | ResponseApiTinyError,
): response is ResponseApiTinyPesquisaVendedores {
  return response.retorno.status_processamento === "3";
}
function isSuccessResponseObterProduto(
  response: ResponseAPIObterProduto | ResponseApiTinyError,
): response is ResponseAPIObterProduto {
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
      | ResponseApiTinyError = await response.json();

    // Verifique se a resposta é do tipo de sucesso
    if (isSuccessResponseObterPedido(responseJson)) {
      const pedido = responseJson.retorno.pedido;
      console.log("Pedido obtido com sucesso da APIObterPedidoTINY:", pedido);
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

export async function APIpesquisaVendedor(id_tiny_vendedor: number) {
  if (!urlPesquisaVendedores || !token) {
    throw new Error("URL e token sao necessarios para obter um vendedor");
  }

  var data = "token=" + token + "&pesquisa=" + "&formato=JSON";

  try {
    const response = await fetch(urlPesquisaVendedores, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: data,
    });

    const responseJson:
      | ResponseApiTinyPesquisaVendedores
      | ResponseApiTinyError = await response.json();

    // Verifique se a resposta é do tipo de sucesso
    if (isSuccessResponsePesquisaVendedores(responseJson)) {
      const vendedores = responseJson.retorno.vendedores;
      const vendedor = vendedores.find(({ vendedor }) =>
        vendedor.id === id_tiny_vendedor
      );
      
      if(!vendedor) {
       console.log("Vendedor nao encontrado na API TINY");
      }else{
        console.log("vendedor obtido com sucesso:", vendedor);
      }
      return vendedor?.vendedor;
    } else {
      // Se não for sucesso, lanço o erro
      throw new Error(responseJson.retorno.erros[0].erro);
    }
  } catch (error) {
    console.error("Erro na APIpesquisaVendedor:", error);
    throw error;
  }
}


export async function APIobterProduto(id_tiny_produto: string) {

  if (!urlObterProduto || !token) {
    throw new Error("URL e token sao necessarios para obter um produto");
  }

  var data = "token=" + token + "&id="+id_tiny_produto + "&formato=JSON";

  try {
    const response = await fetch(urlObterProduto, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: data,
    });

    const responseJson:
      | ResponseAPIObterProduto
      | ResponseApiTinyError = await response.json();
    console.log("responseJson produto:", responseJson);
    // Verifique se a resposta é do tipo de sucesso
    if (isSuccessResponseObterProduto(responseJson)) {
      const produto = responseJson.retorno.produtos[0].produto;
      //const vendedor = vendedores.find(({ vendedor }) =>
        //vendedor.id === id_tiny_produto
      //);
      
      if(!produto) {
       console.log("produto nao encontrado na API TINY");
      }else{
        console.log("produto obtido com sucesso:", produto);
      }
      return produto;
    } else {
      // Se não for sucesso, lanço o erro
      throw new Error(responseJson.retorno.erros[0].erro);
    }
  } catch (error) {
    console.error("Erro na APIObterProduto:", error);
    throw error;
  }
}