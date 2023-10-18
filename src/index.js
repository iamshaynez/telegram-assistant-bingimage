import { createImagesFromBing } from "./imageCreator";
import { responseToAssistant, errorToString } from "./util";
import { initEnv } from "./env";

export default {
    async fetch(request, env) {
        console.log(`Recieved request on BingImage`)
        initEnv(env)
        try {
            const body = await request.json();
            const text = body.message.text;
            console.log(`Text: ${text}`)
            return await createImagesFromBing(text);
        } catch (e) {
            console.error(e);
            return responseToAssistant(e.message, []);
        }
    },
};

