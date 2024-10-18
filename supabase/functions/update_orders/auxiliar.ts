import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js";

export async function fetchProdutoPorId(
  id_tiny: number,
  supabase: SupabaseClient,
) {
  let { data: produtos, error } = await supabase
    .from("produtos")
    .select("*")
    .eq("id_tiny", id_tiny)
    

  console.log("Produto dentro do fetch =", produtos?.[0].id);
  if (error) {
    console.error("Erro ao consultar o banco de dados:", error);
    return null;
  }
  return produtos?.[0].id;
}

export default fetchProdutoPorId;
