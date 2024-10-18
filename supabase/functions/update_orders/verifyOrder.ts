import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js";

async function orderExists(pedidoId: number, supabase: SupabaseClient) {
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

export default orderExists;
