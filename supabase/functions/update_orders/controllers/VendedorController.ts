import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js";
import { Vendedor } from "../types/responseTinyAPI.ts";

class VendedorController {
  async create(
    vendedor_tiny: Vendedor,
    supabase: SupabaseClient,
  ) {
    // Inserir o pedido no banco de dados
    const {
      data: vendedorData,
      error: vendedorError,
    } = await supabase
      .from("vendedores")
      .insert([{
        id_tiny: vendedor_tiny.id,
        nome: vendedor_tiny.nome,
        situacao: vendedor_tiny.situacao,
        equipe: vendedor_tiny.fantasia,
      }]);

    if (vendedorError) {
      console.error("Erro ao inserir vendedor:", vendedorError);
      return null; // Retorna nulo em caso de erro
    } else {
      console.log("Vendedor inserido com sucesso ");
    }
    return vendedorData;
  }

  async select(id_tiny: number, supabase: SupabaseClient) {
    const { data, error } = await supabase
      .from("vendedores")
      .select()
      .eq("id_tiny", id_tiny)
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

export default VendedorController