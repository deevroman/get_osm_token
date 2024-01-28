async function runOAuthFlow(client_id, client_secret = "", redirect_uri = redirect_uri_for_token_copy, server = dev_server, scope = []) {
    let tabs = await browser.tabs.query({active: true, currentWindow: true});
    const auth_params = {
        client_id: client_id,
        redirect_uri: redirect_uri,
        scope: scope.join(" "),
        response_type: "code"
    }
    let tab = await browser.tabs.create({
        url: server + authorization_endpoint + "?" + (new URLSearchParams(auth_params)).toString(),
        active: false
    });
    if (redirect_uri !== redirect_uri_for_token_copy) {
        let redirectHandler = function (details) {
            browser.webRequest.onHeadersReceived.removeListener(redirectHandler);
            browser.tabs.executeScript(tab.id, {
                code: `window.location = "${server + "/oauth2/authorize/native?code=" + details.responseHeaders.find((e) => e.name === "location").value.match(/\?code=(.+)/)[1]}"`,
            });
            return {
                cancel: true,
            };
        }
        browser.webRequest.onHeadersReceived.addListener(
            redirectHandler,
            {
                urls: [
                    "https://master.apis.dev.openstreetmap.org/oauth2/authorize",
                    "https://www.openstreetmap.org/oauth2/authorize",
                ],
                types: ["main_frame"]
            },
            ["blocking", "responseHeaders"]
        );
    }
    await browser.tabs.executeScript(tab.id, {
        code: 'document.querySelector(".btn-primary").click()',
    });


    function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    let code = ""
    for (let i = 0; i < 20; i++) {
        await sleep(300);
        try {
            [code] = await browser.tabs.executeScript(tab.id, {
                code: `document.querySelector("#authorization_code").textContent;`
            });
        } catch (e) {
        }
        if (code) break
        console.log(i)
    }

    browser.tabs.remove(tab.id)

    const token_params = {
        client_id: client_id,
        redirect_uri: redirect_uri,
        code: code,
        grant_type: "authorization_code"
    }
    let j = await (await fetch(server + token_endpoint, {
        method: "POST",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: (new URLSearchParams(token_params)).toString()
    })).json();
    let access_token = j.access_token;
    await navigator.clipboard.writeText(access_token);
    await browser.tabs.executeScript(tabs[0].id, {
        code: `
                let input = document.createElement("input");
                input.value = "${access_token}"
                input.readOnly = true
                input.classList.add("btn", "btn-outline-primary")
                // input.style.width = "100%"
                document.getElementById("ext-get-token").after(input)
                input.onclick = () => {
                    navigator.clipboard.writeText("${access_token}").then(() => {
                        let copied = document.createElement("span")
                        copied.innerText = "Copied!"
                        copied.style.color = "green"
                        input.after(copied)
                        copied.before(document.createTextNode("\xA0"))
                    })
                }
                input.before(document.createTextNode("\xA0"))
             `
    });

}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.action === 'RunOAuthFlow') {
        runOAuthFlow(message.client_id, "", message.redirect_uri, message.server, message.scope).then(() => {
        });
    }
});
