import { Ai } from "@cloudflare/ai";
import { AI } from "./env";

// Default chinese to english. Currently there is no way to adopt other langs.
// Leave to TODO
export async function translate(sentence, from = "chinese", to = "english") {
    const ai = new Ai(AI);

    const response = await ai.run("@cf/meta/m2m100-1.2b", {
        text: sentence,
        source_lang: from, // defaults to english
        target_lang: to,
    });
    return response["translated_text"];
}
