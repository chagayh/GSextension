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
    for (var i = 0; i < links.length; i++) {
        var citedByTextRef = "" + links[i].text;
        var nihLinkRef = "" + links[i] + ""; 
        if (nihLinkRef.includes("nih")) {
            found = true;
            msg.nihLink = links[i].href;
            msg.title = links[i].text;
            msg.subTitle = links[i].parentElement.nextSibling.firstChild.nodeValue;
            // console.log(links[i].href);
            // console.log(links[i].text);
            // console.log(links[i].parentElement.nextSibling.firstChild.nodeValue);
        }
        if (citedByTextRef.includes("Cited")) {
            msg.citedByText = links[i].text;
            msg.citedByLink = links[i].href;
            // console.log(citedByTextRef);
            // console.log(links[i].href);
        }
    }
    msg.isFound = found;

    function handleResponse(message) {
        // console.log(`response from popup script: ${message.response}`);
    }
      
    function handleError(error) {
        console.log(`Error: ${error}`);
    }

    console.log(msg.isFound);

    if (!document.hidden) {
        var sending = browser.runtime.sendMessage(msg); 
        sending.then(handleResponse, handleError);
    }
    

  })();