(function() {

    var links = document.links;     // find all the links on the pageS
    found = false;
    var msg = {
        isFound: true,          // if exist nih link
        nihLink: null,          // the nih link - href
        title: null,            // the title
        subTitle: null,         // the authors line
        citedByText: null,      // the cited by text
        citedByLink: null       // the cited by link - href
    }

    var nihState = 0;
    for (var i = 0; i < links.length; i++) {
        // iterate over all links found on the page
        var citedByTextRef = "" + links[i].text;
        var nihLinkRef = "" + links[i] + ""; 
        if (nihLinkRef.includes("nih")) {
            var className = links[i].parentElement.className;
            if (className != "gs_rt") {
                // found the link from the right side of the page
                nihState = 1;   // changes state to 1 meaning next iteration will be the correct link
                continue;
            }
            // console.log("nihState = " + nihState);
            if (nihState === 1) {       
                // find the link attached to the link on the right side
                found = true;
                msg.nihLink = links[i].href;
                msg.title = links[i].text;
                msg.subTitle = links[i].parentElement.nextSibling.textContent;
                nihState = 2;
            } else if (nihState === 0){
                // there is no link on the right side of the page
                found = true;
                msg.nihLink = links[i].href;
                msg.title = links[i].text;
                msg.subTitle = links[i].parentElement.nextSibling.textContent;
            }
        }
        
        if (citedByTextRef.includes("Cited")) {
            // find the cited by link
            msg.citedByText = links[i].text;
            msg.citedByLink = links[i].href;
        }
    }
    msg.isFound = found;

    function handleResponse(message) {
        console.log(`response from popup script: ${message.response}`);
    }
      
    function handleError(error) {
        console.log(`Error: ${error}`);
    }

    if (!document.hidden) {
        var sending = browser.runtime.sendMessage(msg); 
        sending.then(handleResponse, handleError);
    }
    
  })();