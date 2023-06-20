import { PageProps, HandlerContext } from "$fresh/server.ts";
import { access_token } from "./wxtoken.tsx";

export const handler = {
    async GET(_req: Request, _ctx: HandlerContext): Promise<Response> {
        const url = new URL(_req.url);
        const params = url.searchParams;
        const op = params.get("op") || "";
        console.log("wxtry, op=", op);
        let result: string;
        if (op === "wxip") {
            const url = "https://api.weixin.qq.com/cgi-bin/get_api_domain_ip?access_token=" + access_token;
            const res = await fetch(url);
            result = await res.text();
        } if (op === "addmenu") {
            const url = "https://api.weixin.qq.com/cgi-bin/menu/create?access_token=" + access_token;
            const res = await fetch(url, { method: "POST", body: JSON.stringify(menus), });
            result = await res.text(); // result={"errcode":0,"errmsg":"ok"}
        } if (op == "getmenu") {
            const url = "https://api.weixin.qq.com/cgi-bin/get_current_selfmenu_info?access_token=" + access_token;
            const res = await fetch(url);
            result = await res.text();
        } if (op === "send") {
            // 给指定用户发送模板消息
            const value = params.get("value") || "106";
            const url = "https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=" + access_token;
            const json = {
                touser: "oeWFk6pnzcIqihfKGI1B-L9OeJ7I", // 庄子略懂
                template_id: "hg1F2yVMBPI031debW532bkQWihD5oLCbDVGdrVZOgk", // 测试用模板
                data: {
                    value: { value: value, color: "#FF0000" },
                    datetime: { value: new Date().toLocaleString() },
                },
            };
            const resp = await fetch(url, { method: "POST", body: JSON.stringify(json), });
            result = await resp.text();
        }else {
            result = `not support this op (${op})`;
        }
        return await _ctx.render({op, result});
    }
}

export default function Page(props: PageProps) {
    const {op, result} = props.data;
    return (<>
        <p>op={op}</p>
        <p>result={result}</p>
    </>)
}

const menus = {
    button: [{
        name: "临时",
        type: "click",
        key: "tmp-click-key",
    }, {
        name: "主菜单",
        sub_button: [{
            name: "1.click",
            type: "click",
            key: "click-key",
        }, {
            name: "2.view",
            type: "view",
            url: "https://hifresh.deno.dev",
        }, {
            name: "3.scancode",
            type: "scancode_push",
            key: "scancode-key",
        }, {
            name: "6.pic",
            type: "pic_photo_or_album",
            key: "pic-key"
        }
        ]
    }
    ]
};
