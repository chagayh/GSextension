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
    /*
    copy the title and cited by as hyper links, the authors lines and adds a date
    */
    var divCopy = document.getElementById("divCopy");

    //date
    var today = new Date();
    var year = today.getFullYear() + "";
    year = year.slice(2,4);
    var date = today.getDate() + "." + (today.getMonth() + 1) + "." + year;
    var dateCopy = document.getElementById("dateCopy");
    dateCopy.innerText = date;

    // title
    msg.title = msg.title.replace(/\.$/, "");
    msg.title = msg.title.padEnd(msg.title.length + 1); // add a space at the end
    var nihCopy = document.getElementById("nihCopy");
    nihCopy.href = msg.nihLink;
    nihCopy.innerText = msg.title;  

    // cited by
    var citedCopy = document.getElementById("citedByCopy");
    citedCopy.href = msg.citedByLink;
    citedCopy.innerText = msg.citedByText;

    // authors line
    var subTitleCopy = document.getElementById("subTitleCopy");
    subTitleCopy.innerText = msg.subTitle;   

    // select the copy div using range
    const range = document.createRange();
    range.selectNode(divCopy);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    document.execCommand('copy');
    divCopy.hidden = true;
}

function openTab(val, btn, link, idx) {
    /*
    open a new tab at the idx (where on the tabs menu) specified, only if user checked the btn
    */
    if (val == 0) {
        btn.checked = false;
    } else {
        btn.checked = true;
        browser.tabs.create({
            url: link, 
            index: idx,
            active: false
        })
    }
}

function handleMessage(request, sender, sendResponse) {
    // initialize all elements on popup html
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
        // if there is a nih link on the page
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
        
        // find the index of the current tab and open the new tabs if requested
        browser.tabs.query({currentWindow: true, active: true}).then((tabs) => {
            let currTabIdx = tabs[0].index;
            openTab(nihCheckVal, nihCheckBtn, request.nihLink, currTabIdx + 1);
            openTab(citedCheckVal, citedCheckBtn, request.citedByLink, currTabIdx + 2);
        });

        copy(request);

    } else if (!request.isFound) {
        // nih link isn't existed
        nihCheckBtn.hidden = true;
        citedCheckBtn.hidden = true;
        nihTabsLabel.hidden = true;
        citedTabsLabel.hidden = true;
        goBtn.hidden = true;
        titleEl.innerText = "no NIH link";
    }

    sendResponse({response: "hii"});
}

browser.runtime.onMessage.addListener(handleMessage);

browser.tabs.executeScript({file: '../content_scripts/content_script.js'})
    .catch(reportExecuteScriptError)
