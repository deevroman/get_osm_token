if (!window.location.href.endsWith("/new")) {
    let client_id = document.querySelector("code").textContent;
    let redirect_uri = document.querySelector(".table > tbody:nth-child(1) > tr:last-child > td:nth-child(2) > ul:nth-child(1) > li:nth-child(1)").textContent;

    let btn = document.createElement("button");
    btn.textContent = "Get OAuth token";
    btn.id = "ext-get-token";
    btn.classList.add("btn");
    btn.classList.add("btn-outline-primary");

    let p = document.createElement("p");
    document.querySelector("table").after(p);
    p.before(btn);

    btn.addEventListener('click', function () {
        chrome.runtime.sendMessage({
            action: 'RunOAuthFlow',
            client_id: client_id,
            redirect_uri: redirect_uri,
            server: window.location.origin,
            scope: Array.from(document.querySelectorAll("code.text-body-secondary")).map((i) => i.textContent.slice(1, -1))
        });
    });
}
