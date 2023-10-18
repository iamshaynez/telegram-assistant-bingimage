import { ENV } from "./env";
import BingImageCreator from "./BingImageCreator.js"
import { responseToAssistant } from "./util";

// Default chinese to english. Currently there is no way to adopt other langs.
// Leave to TODO
export async function createImagesFromBing(sentence) {
    // Setup the required options.
    const options = {
        // Necessary for some people in different countries, e.g. China (https://cn.bing.com)
        host: "https://cn.bing.com",
        // The "_U" cookie value from bing.com
        userToken: ENV.BING_TOKEN,
        // If the above doesn't work, provide all your cookies as a string instead
        cookies: ENV.BING_COOKIE,
        // A proxy string like "http://<ip>:<port>"
        proxy: "",
        // (Optional) Set to true to enable `console.debug()` logging
        debug: true,
        // (Optional) The user agent for the network request.
        userAgent: "",
    };

    console.log(`Bing Token: ${ENV.BING_TOKEN}`)
    console.log(`Bing Cookie: ${ENV.BING_COOKIE}`)
    let imageList = await new BingImageCreator(options).genImageList(sentence, "123")

    //console.log(`Images: ${imageList}`)
    return responseToAssistant(sentence, imageList);
}
