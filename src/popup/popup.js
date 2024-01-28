function updateFormData() {
    chrome.storage.local.set({
            "input-id-dev-server": document.getElementById("input-id-dev-server").checked
        }
    )
}

function restoreInputData() {
    chrome.storage.local.get("input-id-dev-server", function (obj) {
        if (obj["input-id-dev-server"] !== undefined) {
            document.getElementById("input-id-dev-server").checked = obj["input-id-dev-server"]
        }
    })
}

function createApp() {

    async function prepareRegisterPage(server) {
        document.querySelector("html").style = "display: none";
        let tab = await browser.tabs.create({
            url: server + `/oauth2/applications/new`
        });
        await browser.tabs.executeScript(tab.id, {
            code: `
                    document.getElementById("oauth2_application_redirect_uri").value = "urn:ietf:wg:oauth:2.0:oob";
                    document.getElementById("oauth2_application_confidential").checked = false;
                    document.getElementById("oauth2_application_scopes_read_prefs").checked = true;
                    document.getElementById("oauth2_application_scopes_write_api").checked = true;
                    document.getElementById("oauth2_application_name").focus();
                `
        });
        window.close();
    }

    prepareRegisterPage(document.getElementById("input-id-dev-server").checked ? dev_server : osm_server).then(() => {
    })
}


document.addEventListener("DOMContentLoaded", restoreInputData)
document.getElementById("create-app-btn").addEventListener('click', createApp);
document.getElementById("input-id-dev-server").addEventListener('change', updateFormData);
