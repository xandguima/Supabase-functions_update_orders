import { Produto } from "../types/responseTinyAPI.ts";
import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js";
class ProdutoController {
  async select(id_tiny_produto: string, supabase: SupabaseClient) {
    const { data, error } = await supabase
      .from("produtos")
      .select("*")
      .eq("id_tiny", id_tiny_produto);
    if (error) {
      console.error("Erro ao selecionar o registro de produto no bando supabase:", error);
      return null;
    }
    return data[0];
  }

  async create(produto_tiny: Produto, supabase: SupabaseClient) {
    const { data, error } = await supabase
      .from("produtos")
      .insert(produto_tiny);
    if (error) {
      console.error("Erro ao inserir o registro:", error);
      return null;
    }

    return data;
  }
}

export default ProdutoController