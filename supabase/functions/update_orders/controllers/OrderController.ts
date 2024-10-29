import { Pedido } from "../types/responseTinyAPI.ts";
import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js";
import  ItensController  from "./ItensController.ts";
import { fetchVendedorPorId } from "../auxiliar.ts";


const itensController = new ItensController();

class PedidoController {
  async create(pedido_tiny: Pedido, supabase: SupabaseClient) {
    const id_vendedor = await fetchVendedorPorId(
      pedido_tiny.id_vendedor,
      supabase,
    );
    // Inserir o pedido no banco de dados
    const { error: pedidoError } = await supabase
      .from("pedidos")
      .insert([{
        id_tiny: pedido_tiny.id,
        numero: pedido_tiny.numero,
        id_vendedor_tiny: pedido_tiny.id_vendedor,
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
        id_vendedor: id_vendedor,
      }]);

    if (pedidoError) {
      console.error("Erro ao inserir pedido:", pedidoError);
      throw new Error(`Erro ao inserir pedido ${pedidoError}`); // Retorna nulo em caso de erro
    } else {
      console.log("Pedido inserido com sucesso ");
    }

    const pedidoData = await this.select(pedido_tiny.id, supabase);

    const id_pedido = pedidoData?.id;

    // Inserir os itens do pedido no banco de dados
    const response = await itensController.create(
      id_pedido,
      pedido_tiny,
      supabase,
    );

    return response.success === true ? id_pedido : null; // Retorna os dados do pedido inserido
  }

  async update(
    pedido_tiny: Pedido,
    pedidoIdExistsDatabase: number,
    supabase: SupabaseClient,
  ) {
    try {
      const id_tiny_vendedor = pedido_tiny.id_vendedor;
      console.log("id_tiny_vendedor:", id_tiny_vendedor);

      const id_vendedor = await fetchVendedorPorId(id_tiny_vendedor, supabase);

      // Atualizar o pedido no banco de dados
      const { error: updateError } = await supabase
        .from("pedidos")
        .update({
          id_tiny: pedido_tiny.id,
          numero: pedido_tiny.numero,
          id_vendedor: id_vendedor,
          id_vendedor_tiny: pedido_tiny.id_vendedor,
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

      // Deletar os itens do pedido no banco de dados
      await itensController.delete(pedido_tiny, supabase);

      // Inserir os novos itens do pedido no banco de dados
      const response = await itensController.create(
        pedidoIdExistsDatabase,
        pedido_tiny,
        supabase,
      );

      return response.success === true ? pedido_tiny.numero : null;

    }catch(error) {
      console.error("Erro ao atualizar pedido:", error);
      return {
        success: false,
        message: `Erro ao atualizar pedido: ${error}`,
        error,
      };
    }
  }
  async select(pedidoId: number, supabase: SupabaseClient) {
    const { data, error } = await supabase
      .from("pedidos")
      .select()
      .eq("id_tiny", pedidoId)
      // Limita a 1 resultado
  
    if (error) {
      console.error("Erro ao consultar o banco de dados:", error);
      return new Response(
        `Erro ao consultar o banco de dados: ${error.message}`,
        { status: 500 },
      );
    }
  
    // Retorna os dados se encontrados, ou null se não houver resultados
    return data?.length ? data?.[0] : null;
   
  }
}

export default PedidoController;
