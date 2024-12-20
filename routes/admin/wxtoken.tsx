import { WxJson } from "../../utils/wxxml.ts";
import { HandlerContext } from "$fresh/server.ts";

// liigosoft测试公众号的AppId和Secret
const appid = "wx94eeddaef3d686ff";
const secret = "44e38a20c295b15166667ff35f739e20";
const appid_secret = `appid=${appid}&secret=${secret}`;

export let access_token = "";
export let expires_in = 0;
export let update_time: Date;

// 临时使用的ACCESS_TOKEN（开发阶段Fresh应用会自动重启导致token经常失效，此处写死更方便一些）
access_token = "70_ciZdBciYWD3Wk0Cx2K7IDOp3l6mhQHlLEdOfNR30Tmnlrc6hryScb6XbBAe_VyaQlNSh4cU2XdtJvxMxF1-Vsn5Rj7Q3vOUkVC-6Kh2SecSFCHcLvJmaZt1WVwgSWYgADALPR";

export const handler = {
    async GET(_req: Request, _ctx: HandlerContext): Promise<Response> {
        const url = new URL(_req.url);
        const force = url.searchParams.has("force");
        await updateStableAccessToken(force);
        return await _ctx.render();
    }
}

export default function Page() {
    return (<>
        <p>access_token: {access_token}</p>
        <p>expires_in: {expires_in}</p>
        <p>update_time: {update_time.toLocaleString()}</p>
    </>);
}

export async function updateAccessToken() {
    const url = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&"
        + appid_secret;
    const rep = await fetch(url);
    // {"access_token":"ACCESS_TOKEN","expires_in":7200}
    const json = new WxJson(await rep.text());
    console.log("token", json);
    access_token = json.getString("access_token");
    expires_in = json.getNumber("expires_in", "}");
    update_time = new Date();
}

export async function updateStableAccessToken(force = false) {
    const url = "https://api.weixin.qq.com/cgi-bin/stable_token";
    const body = {
        grant_type: "client_credential",
        appid: appid,
        secret: secret,
        force_refresh: force,
    };
    const rep = await fetch(url, { method: "POST", body: JSON.stringify(body) });
    // {"access_token":"ACCESS_TOKEN","expires_in":7200}
    const json = new WxJson(await rep.text());
    console.log("token", json);
    access_token = json.getString("access_token");
    expires_in = json.getNumber("expires_in", "}");
    update_time = new Date();
}
