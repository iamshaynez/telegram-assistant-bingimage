export function errorToString(e) {
    return JSON.stringify({
        message: e.message,
        stack: e.stack,
        from: "translator",
    });
}

export function responseToAssistant(message, images = []) {
    if (Array.isArray(images) && images.length > 1) {
        const data = { message: message, photos: images };
        const json = JSON.stringify(data);
        console.log(`json final: ${json}`);
        return new Response(json);
    } else {
        const data = { message: message };
        const json = JSON.stringify(data);
        console.log(`json final: ${json}`);
        return new Response(json);
    }
}
