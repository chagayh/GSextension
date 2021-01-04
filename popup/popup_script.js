function reportExecuteScriptError(error) {
    console.error(`Failed to execute popup content script: ${error.message}`)
}

function closeWindow() {
    window.close();
}

function onCreated(tab) {
    console.log(`Created new tab: ${tab.id}`);
}
  
  function onError(error) {
    console.log(`Error: ${error}`);
}

function setOneStorageItem(btn, storageKey) {
    var value = 0;
    if (btn.checked) {
        value = 1;
    }
    localStorage.setItem(storageKey, value);
}

function copy(msg) {
    const el = document.createElement("textArea");
    var copyText = msg.title + "\n";  // + msg.subTitle + " " + msg.nihLink + " " + msg.citedByLink;
    el.value = copyText;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);

    // var copyNih = document.getElementById("nihCopy");
    // copyNih.innerText = msg.title;
    // copyNih.href = msg.nihLink;
    // var copyDiv = document.getElementById("copyDiv");
    // copyDiv.contentEditable = true;
    // copyDiv.unselectable = "off";
    // copyDiv.focus();
    // document.execCommand('SelectAll');
    // document.execCommand("Copy", false, null);
}

function handleMessage(request, sender, sendResponse) {

    var titleEl         = document.getElementById("title");
    var subTitleEl      = document.getElementById("subTitle");
    var nihEl           = document.getElementById("nihLink");
    var citedEl         = document.getElementById("citedLink");

    var nihCheckBtn     = document.getElementById("nihCheckBtn");
    var citedCheckBtn   = document.getElementById("citedCheckBtn");
    var nihTabsLabel    = document.getElementById("nihTabsBtnText");
    var citedTabsLabel  = document.getElementById("citedTabsBtnText");
    var goBtn           = document.getElementById("goBtn");

    var nihCheckVal     = localStorage.getItem("nihOpenTabKey");
    var citedCheckVal   = localStorage.getItem("citedOpenTabKey");
    
    if (request.isFound) {

        goBtn.addEventListener('click', function() {
            setOneStorageItem(nihCheckBtn, 'nihOpenTabKey');
            setOneStorageItem(citedCheckBtn, 'citedOpenTabKey');
            closeWindow();
        })

        nihCheckBtn.addEventListener('change', (event) => {
            setOneStorageItem(nihCheckBtn, 'nihOpenTabKey');
        })

        citedCheckBtn.addEventListener('change', (event) => {
            setOneStorageItem(citedCheckBtn, 'citedOpenTabKey');
        })

        titleEl.innerText = request.title;
        subTitleEl.innerText = request.subTitle;
    
        nihEl.href = request.nihLink;
        nihEl.innerText = request.nihLink;
    
        citedEl.href = request.citedByLink;
        citedEl.innerText = request.citedByText;
        
        nihCheckVal = Number.parseInt(nihCheckVal);
        if (nihCheckVal == 0) {
            nihCheckBtn.checked = false;
        } else {
            nihCheckBtn.checked = true;
            browser.tabs.create({
                url: request.nihLink, 
                active: false
            })
        }
        if (citedCheckVal == 0) {
            citedCheckBtn.checked = false;
        } else {
            citedCheckBtn.checked = true;
            browser.tabs.create({
                url: request.citedByLink, 
                active: false
            })
        }

        // copy(request);

    } else if (!request.isFound) {
        nihCheckBtn.hidden = true;
        citedCheckBtn.hidden = true;
        nihTabsLabel.hidden = true;
        citedTabsLabel.hidden = true;
        goBtn.hidden = true;
        titleEl.innerText = "no NIH link";
    }

    sendResponse({response: "HIII"});
}

browser.runtime.onMessage.addListener(handleMessage);

browser.tabs.executeScript({file: '../content_scripts/content_script.js'})
    .catch(reportExecuteScriptError)
