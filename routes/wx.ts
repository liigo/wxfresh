import { type Handler, type PageProps  } from "$fresh/server.ts";
import { type HandlerContext } from "$fresh/server.ts";
import { WxXml } from "../utils/wxxml.ts";

export const handler = async (_req: Request, _ctx: HandlerContext): Promise<Response> => {
    console.log("==== /wx", _req);
    const url = new URL(_req.url);
    const signature = url.searchParams.get("signature");
    const timestamp = url.searchParams.get("timestamp");
    const nonce = url.searchParams.get("nonce");
    const echostr = url.searchParams.get("echostr");
    console.log(`signature=${signature} timestamp=${timestamp} nonce=${nonce} echostr=${echostr}`);
    if (echostr) {
        // fixme: check signature
        return new Response(echostr); // 回复认证报文
    }
    const body = await _req.text();
    console.log("wx body", body);
    const xmlMsg = new WxXml(body);
    return await handleWxMsg(xmlMsg);
}

function handleWxMsg(msg: WxXml): Response {
    const msgType = msg.getMsgType();
    const reply = WxXml.builder().type(msgType)
        .from(msg.getToUserName()).to(msg.getFromUserName()); // 原路返回
    if (msgType === "text") {
        // 回复文本消息
        const content = msg.getContent();
        const xml = reply.content(replyContent(content)).build();
        return XmlResponse(xml);
    } else if (msgType == "image") {
        // 回复图片消息
        const mediaId = msg.getMediaId();
        return XmlResponse(reply.image(mediaId).build());
    }
    return new Response("OK");
}

function XmlResponse(xml: string): Response {
  console.log("---- reply", xml);
  return new Response(xml, { status: 200, headers: [["Content-Type","text/xml"]] });
}

function replyContent(text: string): string {
    if (text.indexOf("你是谁") >= 0) {
        return "我是小强";
    }
    const reply = text.replaceAll("吗", "").replaceAll("？", "").replaceAll("?", "");
    return reply;
}
