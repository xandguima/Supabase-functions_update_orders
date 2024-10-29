import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js";
import {APIpesquisaVendedor} from "./CallAPI.ts";
import VendedorController from "./controllers/VendedorController.ts";
import ProdutoController from "./controllers/ProdutoController.ts";
import { APIobterProduto } from "./CallAPI.ts";

const vendedorController = new VendedorController();
const produtoController = new ProdutoController();
export async function fetchProdutoPorId(
  id_tiny_produto: string,
  supabase: SupabaseClient,
) {
  // Verifica se o produto já existe no banco de dados
  let produtoRecord = await produtoController.select(id_tiny_produto, supabase);

  // Retorna o ID se o produto já existe
  if (produtoRecord) {
    console.log("produto encontrado no banco:", produtoRecord);
    return produtoRecord.id;
  }

  console.log("Produto nao encontrado no banco")
  // Busca o produto na API se não encontrado no banco
  const produto = await APIobterProduto(id_tiny_produto);

  // Se o produto for encontrado pela API, insere no banco
  if (produto) {
    await produtoController.create(produto, supabase);
    
    // Realiza uma nova consulta para obter o registro inserido
    produtoRecord = await produtoController.select(id_tiny_produto, supabase);
    console.log("produto consultado apos inserção no banco:", produtoRecord);

    // Retorna o ID do produto recém-inserido
    return produtoRecord?.id || null;
  }

  // Retorna nulo se o produto não existe na base de dados nem na API
  return null;
}


export async function fetchVendedorPorId(
  id_tiny_vendedor: number,
  supabase: SupabaseClient,
) {
  // Verifica se o vendedor já existe no banco de dados
  let vendedorRecord = await vendedorController.select(id_tiny_vendedor, supabase);

  // Retorna o ID se o vendedor já existe
  if (vendedorRecord) {
    console.log("Vendedor encontrado no banco:", vendedorRecord);
    return vendedorRecord.id;
  }
  console.log("vendedor nao encontrado no banco")
  // Busca o vendedor na API se não encontrado no banco
  const vendedor = await APIpesquisaVendedor(id_tiny_vendedor);

  // Se o vendedor for encontrado pela API, insere no banco
  if (vendedor) {
    await vendedorController.create(vendedor, supabase);
    
    // Realiza uma nova consulta para obter o registro inserido
    vendedorRecord = await vendedorController.select(id_tiny_vendedor, supabase);
    console.log("vendedor consultado apos inserção no banco:", vendedorRecord);

    // Retorna o ID do vendedor recém-inserido
    return vendedorRecord?.id || null;
  }

  // Retorna nulo se o vendedor não existe na base de dados nem na API
  return null;
}




