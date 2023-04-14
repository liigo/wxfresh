import { PageProps } from "$fresh/server.ts";
import { WxXml,WxJson } from "../../utils/wxxml.ts";

const xml = `<xml><ToUserName><![CDATA[gh_38afbea4039e]]></ToUserName>
<FromUserName><![CDATA[oeWFk6pnzcIqihfKGI1B-L9OeJ7I]]></FromUserName>
<CreateTime>1680860468</CreateTime>
<MsgType><![CDATA[text]]></MsgType>
<Content><![CDATA[1]]></Content>
<MsgId>24064135486793166</MsgId>
</xml>`;

export default function Page() {
    
    return (<>
    <ParseXml xml={xml}/>
    <BuildXml/>
    <ParseJson/>
    </>);
}

function BuildXml() {
    const xml = WxXml.builder()
        .type("type").content("content")
        .from("from").to("to")
        .id("id")
        .build();
    return (<>
    <p class="text-blue-500">---build xml---</p>
    <p>new xml: {xml}</p>
    <ParseXml xml={xml}/>
    </>);
}

function ParseXml({xml}) {
    const msg = new WxXml(xml);
    return (<>
        <p class="text-blue-500">---parse xml---</p>
        <p>type: {msg.getMsgType()}</p>
        <p>content: {msg.getContent()}</p>
        <p>from: {msg.getFromUserName()}</p>
        <p>to: {msg.getToUserName()}</p>
        <p>time: {msg.getCreateTime()}</p>
        <p>id: {msg.getMsgId()}</p>
        <p>raw xml: {xml}</p>
    </>);
}

function ParseJson() {
    const json = `{"access_token":"ACCESS_TOKEN","expires_in":7200}`;
    const js = new WxJson(json);
    return (<>
        <p class="text-blue-500">---parse json---</p>
        <p>token: {js.getString("access_token")}</p>
        <p>expires: {js.getNumber("expires_in", "}")}</p>
    </>);
}