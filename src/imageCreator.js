import { ENV } from "./env";
import BingImageCreator from "./BingImageCreatorV2.js"
import { responseToAssistant } from "./util";

// Default chinese to english. Currently there is no way to adopt other langs.
// Leave to TODO
export async function createImagesFromBing(sentence) {
    // Setup the required options.
    const options = {
        // Necessary for some people in different countries, e.g. China (https://cn.bing.com)
        host: "",
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
    let imageList = await new BingImageCreator(options).genImages(sentence, generateRandomHex())

    //console.log(`Images: ${imageList}`)
    return responseToAssistant(sentence, imageList);
}

// This function generates a random hexadecimal string of length 8
function generateRandomHex() {
    let result = '';
    for (let i = 0; i < 8; i++) {
        // Math.random() generates a random number between 0 and 1,
        // so we multiply by 0x100000000 (2^32) to get a number between 0 and 2^32
        // then we floor it to get an integer and finally convert it to hex.
        result += (Math.floor(Math.random() * Math.pow(2, 32))).toString(16).padStart(8, '0');
    }
    return result;
}

