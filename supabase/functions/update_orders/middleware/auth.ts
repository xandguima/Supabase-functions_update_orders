import {
  createClient,
  SupabaseClient,
} from "https://esm.sh/@supabase/supabase-js";

const supabaseUrl: string | undefined = Deno.env.get("MY_SUPABASE_URL");
const supabaseKey: string | undefined = Deno.env.get("MY_SUPABASE_KEY");


// Função para descriptografar o admin_token
async function pgpSymDecrypt(
  encryptedData: string,
  key: string,
  supabase: SupabaseClient,
) {
  const { data, error } = await supabase.rpc("pgp_sym_decrypt", {
    data: encryptedData,
    key: key,
  });

  if (error) {
    console.error("Erro ao descriptografar o token:", error);
    return null;
  }
  console.log("Descriptografado:", data);

  return data;
}

// Função para autenticar o usuário
async function authenticateUser(email: string, password: string) {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Missing SUPABASE_URL or SUPABASE_KEY environment variable",
    );
  }
  const supabase = createClient(supabaseUrl, supabaseKey);
  // Autenticação do usuário
  const { data, error } = await supabase.auth
    .signInWithPassword({
      email,
      password,
    });

  if (error) {
    console.error("Erro de autenticação:", error);
    return null;
  }


  // Retorne a sessão e os dados do usuário se as validações passarem
  return { data, supabase};
}


export default authenticateUser;
