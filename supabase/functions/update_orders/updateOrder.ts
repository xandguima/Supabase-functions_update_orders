import { Pedido } from "./types/responseTinyAPI.ts";
import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js";
import fetchProdutoPorId from "./auxiliar.ts";

export async function updatePedido(
  pedido_tiny: Pedido,
  pedidoIdExistsDatabase: number,
  supabase: SupabaseClient,
) {
  try {
    // Atualizar o pedido no banco de dados
    const { error: updateError } = await supabase
      .from("pedidos")
      .update({
        id_tiny: pedido_tiny.id,
        numero: pedido_tiny.numero,
        vendedor: pedido_tiny.id_vendedor,
        data: pedido_tiny.data_pedido,
        previsto: pedido_tiny.data_prevista,
        valor: Number(pedido_tiny.total_pedido),
        situacao: pedido_tiny.situacao,
        quantidade: pedido_tiny.itens.map((item) =>
          Number(item.item.quantidade)
        )
          .reduce((a, b) => a + b, 0),
        marcadores: pedido_tiny.marcadores.map((marcador) =>
          marcador.marcador.descricao
        ),
        observacoes: pedido_tiny.obs,
        codigo_cliente: pedido_tiny.cliente.codigo,
        nome_fantasia: pedido_tiny.cliente.nome_fantasia,
        nome_cliente: pedido_tiny.cliente.nome,
        updated_at: new Date().toISOString(),
      })
      .eq("id_tiny", pedido_tiny.id)
      .select();

    // Tratamento de erro do Supabase
    if (updateError) {
      console.error("Erro ao atualizar pedido:", updateError.message);
      return {
        success: false,
        message: `Erro ao atualizar pedido: ${updateError.message}`,
        updateError,
      };
    }
    console.log("Pedido atualizado com sucesso!");

    console.log("pedido =", pedido_tiny);

    // Deletar os itens do pedido no banco de dados
    const { error: deleteError } = await supabase
      .from("itens")
      .delete()
      .eq("id_pedido_tiny", pedido_tiny.id);

    if (deleteError) {
      console.error("Erro ao atualizar pedido:", deleteError.message);
      return {
        success: false,
        message: `Erro ao atualizar pedido: ${deleteError.message}`,
        deleteError,
      };
    }

    const itensComIdProduto = await Promise.all(
      pedido_tiny.itens.map(async ({ item }) => {
        try {
          const id_produto = await fetchProdutoPorId(
            Number(item.id_produto),
            supabase,
          );
          return {
            id_pedido: pedidoIdExistsDatabase,
            id_pedido_tiny: pedido_tiny.id,
            id_produto_tiny: item.id_produto,
            id_produto, // Use o ID retornado
            quantidade: Number(item.quantidade),
            valor: Number(item.valor_unitario),
          };
        } catch (error) {
          console.error(
            `Erro ao buscar id_produto para ${item.id_produto}:`,
            error,
          );
          return null; // Retorna null em caso de erro
        }
      }),
    );
    console.log("itensComIdProduto =", itensComIdProduto);
    // Filtra itens válidos (não null)
    const itensValidos = itensComIdProduto.filter((item) => item !== null);

    // Insere os itens no banco de dados
    const { error: insertError } = await supabase
      .from("itens")
      .insert(itensValidos);

    if (insertError) {
      console.error("Erro ao inserir itens:", insertError.message);
      return {
        success: false,
        message: `Erro ao inserir itens: ${insertError.message}`,
        insertError,
      };
    }
    
    return { success: true };
  } catch (err) {
    // Tratamento de erros gerais (rede, token, etc.)
    console.error("Erro inesperado ao atualizar pedido:", err);
    return {
      success: false,
      message: `Erro inesperado: ${err.message}`,
      error: err,
    };
  }
}
