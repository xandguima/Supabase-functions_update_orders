import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js";
import { fetchProdutoPorId } from "../auxiliar.ts";
import { Pedido } from "../types/responseTinyAPI.ts";

class ItensController {
  async create(
    id_pedido: number,
    pedido_tiny: Pedido,
    supabase: SupabaseClient,
  ) {
    console.log("ID do pedido dentro do insertItensController:", id_pedido);

    const itensComIdProduto = await Promise.all(
      pedido_tiny.itens.map(async ({ item }) => {
        try {
          const id_produto = await fetchProdutoPorId(
            item.id_produto,
            supabase,
          );
          return {
            id_pedido: id_pedido,
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
  }

  async update(
    pedido_tiny: Pedido,
    pedidoIdExistsDatabase: number,
    supabase: SupabaseClient,
  ) {
    try {
      const itensComIdProduto = await Promise.all(
        pedido_tiny.itens.map(async ({ item }) => {
          try {
            const id_produto = await fetchProdutoPorId(
              item.id_produto,
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
            throw new Error(
              `Erro ao buscar id_produto para ${item.id_produto}: ${error.message}`,
            ); // Retorna null em caso de erro
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

  async delete(pedido_tiny: Pedido, supabase: SupabaseClient) {
    // Deletar os itens do pedido no banco de dados
    const { error: deleteError } = await supabase
      .from("itens")
      .delete()
      .eq("id_pedido_tiny", pedido_tiny.id);

    if (deleteError) {
      console.error("Erro ao deletar itens:", deleteError.message);
      return {
        success: false,
        message: `Erro ao deletar itens: ${deleteError.message}`,
        deleteError,
      };
    }
  }
}

export default ItensController;
