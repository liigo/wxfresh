export class WxXml {
    private xml = "";
    public constructor(xml: string) {
        this.xml = xml;
    }
    // MsgType: "text", "image", "event", ...
    public getMsgType():string { return this.get("MsgType"); }
    public getContent():string { return this.get("Content"); }
    public getFromUserName():string { return this.get("FromUserName"); }
    public getToUserName():string { return this.get("ToUserName"); }
    public getCreateTime():string { return this.get("CreateTime"); }
    public getMsgId():string { return this.get("MsgId"); }
    public getMsgDataId():string { return this.get("MsgDataId"); }
    public getPicUrl():string { return this.get("PicUrl"); }
    public getMediaId():string { return this.get("MediaId"); }
    // Event: "CLICK", ...
    public getEvent():string { return this.get("Event"); }
    public getEventKey():string { return this.get("EventKey"); }
    
    private get(name: string): string {
        const val: string = between(this.xml, `<${name}>`, `</${name}>`);
        if (val.startsWith("<![CDATA[") && val.endsWith("]]>")) {
            return val.substring(9, val.length - 3);
        }
        return val;
    }

    public static builder(): WxXmlBuilder {
        return new WxXmlBuilder();
    }
}

export class WxJson {
    private json = "";
    public constructor(json: string) {
        this.json = json;
    }
    public getString(name: string):string {
        return between(this.json, `"${name}":"`, '"');
    }
    public getNumber(name: string, ending = ","): number {
        const v = between(this.json, `"${name}":`, ending);
        return Number(v);
    }
}

// Please use `WxXml.builder()` to create instance of this class.
class WxXmlBuilder {
    private buf: string[] = [];
    public constructor() {
        this.buf.push("<xml>");
    }
    public type(msgType:string):WxXmlBuilder { this.append("MsgType", msgType, true); return this; }
    public content(content:string):WxXmlBuilder { this.append("Content", content, true); return this; }
    public from(fromUserName:string):WxXmlBuilder { this.append("FromUserName", fromUserName, true); return this; }
    public to(toUserName:string):WxXmlBuilder { this.append("ToUserName", toUserName, true); return this; }
    public id(msgId:string):WxXmlBuilder { this.append("MsgId", msgId, false); return this; }
    public image(mediaId:string):WxXmlBuilder {
        this.buf.push("<Image>");
        this.append("MediaId", mediaId, true);
        this.buf.push("</Image>");
        return this;
    }
    
    public build():string {
        const createTime = Math.floor(Date.now() / 1000);
        this.append("CreateTime", createTime.toString(), false);
        this.buf.push("</xml>");
        return this.buf.join("");
    }

    public append(name: string, value: string, useCDATA = true) {
        if (useCDATA) {
            this.buf.push(`<${name}><![CDATA[${value}]]></${name}>`);
        } else {
            this.buf.push(`<${name}>${value}</${name}>`);
        }
    }
}

// by liigo, 20230408.
function between(text: string, prefix: string, suffix: string): string {
    // console.log("between", prefix, "|", suffix);
    const i = text.indexOf(prefix);
    if (i >= 0) {
        const n = prefix.length;
        const j = text.indexOf(suffix, i + n);
        if (j >= 0) {
            return text.substring(i + n, j);
        }
    }
    return "";
}

/*

<xml><ToUserName><![CDATA[gh_38afbea4039e]]></ToUserName>
<FromUserName><![CDATA[oeWFk6pnzcIqihfKGI1B-L9OeJ7I]]></FromUserName>
<CreateTime>1680860468</CreateTime>
<MsgType><![CDATA[text]]></MsgType>
<Content><![CDATA[1]]></Content>
<MsgId>24064135486793166</MsgId>
</xml>

*/