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
            var className = links[i].parentElement.className;
            if (className != "gs_rt") {
                console.log("found nih.gov text $$$$");
                continue;
            }
            
            found = true;
            msg.nihLink = links[i].href;
            msg.title = links[i].text;
            msg.subTitle = links[i].parentElement.nextSibling.firstChild.nodeValue;
            console.log("links[i].href = " + links[i].href);
            console.log("links[i].text = " + links[i].text);
            console.log("links[i].nodeValue = " + links[i].parentElement.nextSibling.firstChild.nodeValue);
            // .parentElement.nextSibling.firstChild.nodeValue

            // console.log("links[i].parentElement = " + links[i].parentElement.parentElement.innerHTML);
        }
        if (citedByTextRef.includes("Cited")) {
            msg.citedByText = links[i].text;
            msg.citedByLink = links[i].href;
            console.log(citedByTextRef);
        }
    }
    msg.isFound = found;

    function handleResponse(message) {
        // console.log(`response from popup script: ${message.response}`);
    }
      
    function handleError(error) {
        console.log(`Error: ${error}`);
    }

    console.log(msg.subTitle);

    if (!document.hidden) {
        var sending = browser.runtime.sendMessage(msg); 
        sending.then(handleResponse, handleError);
    }
    

  })();