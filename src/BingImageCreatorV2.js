export default class BingImageCreator {
    /**
     * @constructor
     * @param {Object} options - Options for BingImageCreator.
     */
    constructor(options) {
        this.setOptions(options);
    }

    setOptions(options) {
        this.options = {
            host: "https://www.bing.com",
            ua: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36 Edg/110.0.1587.63",
            "x-forwarded-for": `13.${Math.floor(
                Math.random() * 4 + 104
            )}.${Math.floor(Math.random() * 256)}.${Math.floor(
                Math.random() * 256
            )}`,
            cookie: options.cookies,
            accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "accept-language": "en-US,en;q=0.9",
            "cache-control": "max-age=0",
            "content-type": "application/x-www-form-urlencoded",
            referrer: "https://www.bing.com/images/create/",
            origin: "https://www.bing.com",
            "user-agent":
                "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36 Edg/110.0.1587.63",
        };
    }

    /**
     * Delay the execution for a given time in millisecond unit.
     * @param {number} ms - The time to be delayed in millisecond unit.
     * @returns {Promise} A promise object that is used to wait.
     */
    static sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    async genImages(prompt) {
        console.log(`Sending requests to Bing...`);
        const encoded_prompt = encodeURIComponent(prompt);
        // https://www.bing.com/images/create?q=${encodeURIComponent(prompt)}&rt=4&FORM=GENCRE
        const url = `https://www.bing.com/images/create?q=${encoded_prompt}&rt=4&FORM=GENCRE`;
        const payload = `q=${encoded_prompt}&qs=ds`;
        console.log(`Requesting URL: ${url}`);
        console.log(`options: ${JSON.stringify(this.options)}`);
        let response = await fetch(url, {
            method: "POST",
            body: payload,
            headers: this.options,
            redirect: "manual",
        });

        const { status } = response;
        console.info(`status: ${status}`);
        console.info(`response headers as below...`);
        response.headers.forEach((value, name) => {
            console.log(name, value);
        });

        //console.log(await response.text())
        if (status !== 302) {
            throw new Error(
                `Bing Image Creator Not as Expected: response status = ${status}`
            );
        }

        let redirect_url = `https://www.bing.com/${response.headers
            .get("Location")
            .replace("&nfy=1", "")}`;
        console.log(`Redirect URL: ${redirect_url}`);
        const requestID = redirect_url.split("id=")[1];
        console.log(`Request ID: ${requestID}`);
        const pollingUrl = `https://www.bing.com/images/create/async/results/${requestID}?q${encoded_prompt}`;

        console.log(`Sending request to redirect url...${redirect_url}`);

        await fetch(redirect_url, {
            method: "POST",
            body: payload,
            headers: this.options,
            redirect: "manual",
        });

        let start_wait = Date.now();
        let body;

        console.log(`Start pulling result...`)
        while (true) {
            if (Date.now() - start_wait > 600000) {
                throw new Error("Timeout pulling the result.");
            }
            response = await fetch(pollingUrl, {
                method: "POST",
                body: payload,
                headers: this.options,
            });
            if (response.status !== 200) {
                throw new Error("Error when pulling the results");
            }
            body = await response.text();

            if (body && body.indexOf("errorMessage") === -1) {
                break;
            } else {
                console.log(`Waiting for the result...`)
                await this.constructor.sleep(1000);
            }
        }

        let regex = /src="([^"]+)"/g;
        let imageLinks = body.match(regex).map(src => src.replace('src="', '').replace('"', ''));

        console.log(`Complete fetching image list...${imageLinks}`);
        return imageLinks;
    }
}
