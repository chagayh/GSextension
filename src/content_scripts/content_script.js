(function() {

    var links = document.links;
    found = false;
    var msg = {
        isFound: true,
        nihLink: null,
        title: null,
        subTitle: null,
        citedByText: null,
        citedByLink: null
    }
    var nihState = 0;
    for (var i = 0; i < links.length; i++) {
        var citedByTextRef = "" + links[i].text;
        var nihLinkRef = "" + links[i] + ""; 
        if (nihLinkRef.includes("nih")) {
            var className = links[i].parentElement.className;
            if (className != "gs_rt") {
                nihState = 1;
                console.log("found nih.gov text $$$$");
                continue;
            }
            console.log("nihState = " + nihState);
            if (nihState === 1) {
                console.log("links[i].href = " + links[i].href);
                found = true;
                msg.nihLink = links[i].href;
                msg.title = links[i].text;
                msg.subTitle = links[i].parentElement.nextSibling.firstChild.nodeValue;
                nihState = 2;
            } else if (nihState === 0){
                console.log("links[i].href = " + links[i].href);
                found = true;
                msg.nihLink = links[i].href;
                msg.title = links[i].text;
                msg.subTitle = links[i].parentElement.nextSibling.firstChild.nodeValue;
            }
        }
        
        if (citedByTextRef.includes("Cited")) {
            msg.citedByText = links[i].text;
            msg.citedByLink = links[i].href;
            // console.log(citedByTextRef);
        }
    }
    msg.isFound = found;

    function handleResponse(message) {
        // console.log(`response from popup script: ${message.response}`);
    }
      
    function handleError(error) {
        console.log(`Error: ${error}`);
    }
    var today = new Date();
    var date = today.getDate() + "." + (today.getMonth() + 1) + "." + today.getFullYear();
    console.log(date);

    if (!document.hidden) {
        var sending = browser.runtime.sendMessage(msg); 
        sending.then(handleResponse, handleError);
    }
    

  })();