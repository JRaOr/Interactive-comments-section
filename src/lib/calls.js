import getConfig from 'next/config'
import Config from '../util/Config'
import absoluteUrl from 'next-absolute-url'
import Api from '../util/Api'
import { TAGS } from '../util/Constants';
const { publicRuntimeConfig } = getConfig();

export async function getTags(url, req) {
    const { protocol, host } = absoluteUrl(req)
    if (!Config.API_SERVER) {
        await getEnv();
    }
    const tags = await Api.getInstance().getTags(url);
    if (tags.data) tags.data.url = `${protocol}//${host}${url}`
    return tags.success ? tags.data : TAGS;
}

export async function getEnv() {
    Config.API_SERVER = `${publicRuntimeConfig.SERVER_API}`
}