import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
//import { sendWebhook } from "./sendWebhookSheet.ts";
import { APIobterPedido } from "./CallAPI.ts";
import  PedidoController  from "./controllers/OrderController.ts";
import authenticateUser from "./middleware/auth.ts";
import WebhookPayload from "./types/recevedWebhook.ts";
import { Pedido } from "./types/responseTinyAPI.ts";


const supabaseEmail: string | undefined = Deno.env.get("MY_SUPABASE_EMAIL");
const supabasePassword: string | undefined = Deno.env.get("MY_SUPABASE_PASSWORD");
const urlSheet: string | undefined = Deno.env.get("MY_SHEET_URL");

if (!supabaseEmail || !supabasePassword) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_KEY environment variable");
}
if (!urlSheet) {
  throw new Error("Missing SHEET_URL environment variable");
}

const pedidoController=new PedidoController();

serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method não permitido", { status: 405 });
  }
  
  
  try {
    const payload: WebhookPayload = await req.json();
    const id_pedido_tiny = payload.dados.id;

    const pedido: Pedido = await APIobterPedido(id_pedido_tiny);

    const response = await authenticateUser(supabaseEmail, supabasePassword);

    if (!response) {
      return new Response("Erro ao autenticar", { status: 500 });
    }
    const { supabase } = response;

    const pedidoExists = await pedidoController.select(id_pedido_tiny, supabase);
    const id_pedidoExists = pedidoExists?.id;
    
    //await sendWebhook(urlSheet, payload);

    if (pedidoExists) {
      const pedidoNumero = await pedidoController.update(pedido, id_pedidoExists, supabase);
      console.log("Pedido atualizado:", pedidoNumero);
      return new Response(`Pedido atualizado com sucesso ${pedidoNumero}`, {status: 200});

    } else {
      const id_pedido = await pedidoController.create(pedido, supabase);
      console.log("Novo pedido inserido:", id_pedido);
      return new Response("Novo pedido inserido com sucesso", {status: 201});
    }

  } catch (error) {
    console.error("Erro ao processar o webhook:", error);
    return new Response(`Erro ao processar o pedido: ${error.message}`, {
      status: 500,
    });
  }
});
