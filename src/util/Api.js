import axios from 'axios';
import Config from './Config';
import { routes } from './Api.config';

class Api {
    
    constructor(headers = {}) {
        var args = {
            baseURL: Config.API_SERVER,
            headers,
            params: {
                "platform": "web"
            }
        };
        this.base = axios.create(args);
    }
    //Instance
    static getInstance() {
        if (!Api.instance && Config.API_SERVER) {
            Api.instance = new Api();
        }
        return Api.instance;
    }

    static setInstance(token) {
        Api.instance = new Api({
            'Authorization': `bearer ${token}`,
        });
    }

    static setDispatch(dispatch) {
        Api.dispatch = dispatch;
    }

    getTags = async (url) => {
        try {
            const response = await this.base.get(`${routes.tags.get}?url=${url}`);
            return { success: true, data: response.data.message };
        } catch (e) {
            return this.handleError(e);
        }
    }

    testGet = async () => {
        try {
            const response = await this.base.get(routes.test);
            return { success: true, data: response.data };
        } catch (e) {
            return this.handleError(e);
        }
    }

    postTexture = async (file) => {
        try {
            const body = new FormData();
            body.append('file', file);
            const response = await this.base.post(routes.texture.addFile, body);
            return { success: true, data: response.data };
        } catch (e) {
            return this.handleError(e);
        }
    }

    uploadTexture = async (data) => {
        try {
            console.log(data)
            const response = await this.base.put(routes.texture.addFile, data);
            return { success: true, data: response.data };
        } catch (e) {
            return this.handleError(e);
        }
    }

    getTextures = async () => {
        try {
            const response = await this.base.get(routes.texture.addFile);
            return { success: true, data: response.data };
        } catch (e) {
            return this.handleError(e);
        }
    }

    getWorld = async () => {
        try {
            const response = await this.base.get(routes.world);
            return { success: true, data: response.data };
        } catch (e) {
            return this.handleError(e);
        }
    }

    getTimeline = async (data) => {
        try {
            const response = await this.base.post(routes.post.timeline, data);
            return { success: true, data: response.data };
        } catch (e) {
            return this.handleError(e);
        }
    }

    getLastPost = async () => {
        try {
            const response = await this.base.get(routes.post.lastPost);
            return { success: true, data: response.data };
        } catch (e) {
            return this.handleError(e);
        }
    }
    
    uploadImage = async (file) => {
        try {
            const body = new FormData();
            body.append('file', file);
            const response = await this.base.put(routes.post.upload, body);
            return { success: true, data: response.data };
        } catch (e) {
            return this.handleError(e);
        }
    }

    registerPost = async (data) => {
        try {
            const response = await this.base.post(routes.post.register, data);
            return { success: true, data: response.data };
        } catch (e) {
            return this.handleError(e);
        }
    }

    getImage = async (data) => {
        try {
            const response = await this.base.post(routes.image.getImage, data);
            return { success: true, data: response.data };
        } catch (e) {
            return this.handleError(e);
        }
    }

    registerUser = async (data) => {
        try {
            const response = await this.base.post(routes.user.register, data);
            return { success: true, data: response.data };
        } catch (e) {
            return this.handleError(e);
        }
    }

    getArticle = async (data) => {
        try {
            const response = await this.base.get(`${routes.article.getArticle}/${data}`);
            return { success: true, data: response.data };
        } catch (e) {
            return this.handleError(e);
        }
    }

    createArticle = async (data) => {
        try {
            const response = await this.base.post(routes.article.createArticle, data);
            return { success: true, data: response.data };
        } catch (e) {
            return this.handleError(e);
        }
    }

    checkTitleAvailability = async (data) => {
        try {
            const response = await this.base.post(routes.article.checkTitleAvailability, data);
            return { success: true, data: response.data };
        } catch (e) {
            return this.handleError(e);
        }
    }

    handleError = (error) => {
        error.response = error.response || {};
        error.response.data = error.response.data || { message: error.message };
        const { message } = error.response.data;
        if (error.response.data.code == 498 && localStorage.getItem('token')) {
            return error.response.data.code
        }

        if (typeof message == "object") {
            return { success: false, message: message[0].msg, code: error.response.data.code };
        } else {

            return { success: false, message, code: error.response.data.code };
        }
    }
}

export default Api;