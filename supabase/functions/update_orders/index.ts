import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { sendWebhook } from "./sendWebhookSheert.ts";
import { APIobterPedido } from "./CallAPI.ts";
import { inserirPedido } from "./insertOrder.ts";
import { updatePedido } from "./updateOrder.ts";
import authenticateUser from "./middleware/auth.ts";
import WebhookPayload from "./types/recevedWebhook.ts";
import { Pedido } from "./types/responseTinyAPI.ts";
import orderExists from "./verifyOrder.ts";


const supabaseEmail: string | undefined = Deno.env.get("MY_SUPABASE_EMAIL");
const supabasePassword: string | undefined = Deno.env.get(
  "MY_SUPABASE_PASSWORD",
);
const urlSheet: string | undefined = Deno.env.get("MY_SHEET_URL");

if (!supabaseEmail || !supabasePassword) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_KEY environment variable");
}
if (!urlSheet) {
  throw new Error("Missing SHEET_URL environment variable");
}

serve(async (req: Request) => {
  if (req.method === "POST") {
    try {
      const payload: WebhookPayload = await req.json();
      const pedidoId_tiny = payload.dados.id;

      const pedido: Pedido = await APIobterPedido(pedidoId_tiny);

      const response = await authenticateUser(supabaseEmail, supabasePassword);
      const session = response?.data.session;
      const user = response?.data.user;
      const supabase = response?.supabase;


      if (!session || !user || !supabase) {
        console.error("Erro ao autenticar o usuário:", response);
        return new Response("Erro ao autenticar o usuário", { status: 500 });
      }

      const pedidoExists = await orderExists(pedidoId_tiny, supabase);
      console.log("exists:", pedidoExists);
      const pedidoIdExists = pedidoExists?.id;

      await sendWebhook(urlSheet, payload);

      if(pedidoExists) {
        const updateResponse = await updatePedido(pedido, pedidoIdExists, supabase);
        console.log("Pedido atualizado:", updateResponse);
        return new Response("Pedido atualizado com sucesso", { status: 200 });
      }else {
        const insertResponse = await inserirPedido(pedido, supabase);
        console.log("Novo pedido inserido:", insertResponse);
        return new Response("Novo pedido inserido com sucesso", {
          status: 201,
        });
      }

    } catch (error) {
      console.error("Erro ao processar o webhook:", error);
      return new Response(`Erro ao processar o pedido: ${error.message}`, {
        status: 500,
      });
    }
  } else {
    return new Response("To aqui rodando");
  }
});
