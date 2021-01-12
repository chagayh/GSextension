# GSextension

Icon was downloaded from [here](https://www.flaticon.com/authors/freepik)

## Installation

1. Download the code.
2. Extract the .xpi file	
3. Open firefox
4. Click the menu button (top right), click Add-ons and select Extensions. 
5. To add the downloaded add-on to the list of available add-ons, drag and drop the file into the Add-ons window.
6. A popup will appear, click on the Add button. 


[link 1](https://scholar.google.com/scholar?cluster=6156061348334367701&hl=en&as_sdt=0,5)


1. The extension will invoke from a GS page as shown in link 1.
2. In case there is a nih link the extension will display a popup according to the requested form.
3. In case there isn't a nih link the sentence "no NIH link" will be displayed.
4. The popup containes 3 buttons (in case there is an nih link): two checkbox and one regular.
5. The two checkbox are for the user to decide weather he wants the two links ('nih' and 'cited by') 
    to open automatically or not (each link has his own button).
6. Pressing the go button will close the popup and will save the current state of the two checkboxes. 
    However the checkboxes state will be saved even if the popup is closed in a different way.

## Packaging and signing the extension -
[source](https://linuxconfig.org/how-to-create-package-and-sign-a-firefox-web-extension)

1. Install the web-ext tool -
   * [source](https://github.com/mozilla/web-ext)
   * First, make sure you are running the current LTS (long term support) version of NodeJS.
   * You can install this command onto your machine globally with:
        npm install --global web-ext
2. Create an account on the  [Mozilla developer hub](https://addons.mozilla.org/en-US/developers/) hub. 
3. Go to this [page](https://addons.mozilla.org/en-US/developers/addon/api/key/) and generate our API keys 
   by clicking on the "Generate new credentials" button. Two credentials will be created: JWT issuer and JWT secret.
4. To sign our package we must use them both and launch the following command from inside the 
   extension directory:  
   ```
   $ web-ext sign --api-key=[JWT issuer] --api-secret=[JWT secret]
   ```

   * Remember to change the version written in the manifest.json when creatng a new xpi file.
   * The web-ext-artifacts directory will be created: inside of it we will find the signed .xpi file that 
     we can install by visiting the about:addons firefox page. The command will also upload our extension to our firefox developer account. 
