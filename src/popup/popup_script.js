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
    var divCopy = document.getElementById("divCopy");

    //date
    var today = new Date();
    var date = today.getDate() + "." + (today.getMonth() + 1) + "." + today.getFullYear();
    var dateCopy = document.getElementById("dateCopy");
    dateCopy.innerText = date;


    msg.title = msg.title.replace(/\.$/, "");
    msg.title = msg.title.padEnd(msg.title.length + 1);
    var nihCopy = document.getElementById("nihCopy");
    nihCopy.href = msg.nihLink;
    nihCopy.innerText = msg.title  

    var citedCopy = document.getElementById("citedByCopy");
    citedCopy.href = msg.citedByLink;
    citedCopy.innerText = msg.citedByText;

    var subTitleCopy = document.getElementById("subTitleCopy");
    subTitleCopy.innerText = msg.subTitle;   

    const range = document.createRange();
    range.selectNode(divCopy);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    document.execCommand('copy');
    divCopy.hidden = true;
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

        copy(request);

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
