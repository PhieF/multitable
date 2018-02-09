

var webviews = JSON.parse(localStorage.getItem('webviews'));

console.log(Object.keys(webviews).length+" len");
if(Object.keys(webviews).length<=0){
showDialog()
}
function generateUID() {
    // I generate the UID from two parts here
    // to ensure the random number provide enough bits.
    var firstPart = (Math.random() * 46656) | 0;
    var secondPart = (Math.random() * 46656) | 0;
    firstPart = ("000" + firstPart.toString(36)).slice(-3);
    secondPart = ("000" + secondPart.toString(36)).slice(-3);
    return firstPart + secondPart;
}
function refreshTabsAndWebview(){
	document.getElementById("tabs").innerHTML=""
    for(var webview in webviews){
        console.log(webview)
        var tab = document.createElement("div");
        tab.classList.add("tab")
        tab.innerHTML = webviews[webview].displayName
        tab.onclick = onTabClick
        tab.oncontextmenu = onTabRightClick
        tab.setAttribute("for",webview)
	tab.setAttribute("id","tab-"+webview)
        document.getElementById("tabs").appendChild(tab)
        
        var webviewElement = document.createElement("webview");
        webviewElement.partition = "persist:"+webview
        webviewElement.src= webviews[webview].url
        webviewElement.setAttribute("id","webview-"+webview)
        webviewElement.classList.add("webview")
        document.getElementById("webviews").appendChild(webviewElement)
    }
}

function hideTabs(but){
    for(var elem of document.getElementsByClassName("webview")){
        if(elem.getAttribute("id") == "webview-"+but){
        $(elem).show()
        elem.style.display = "flex"
        }
        else
        $(elem).hide()
    }
     for(var elem of document.getElementsByClassName("tab")){
 	if(elem.getAttribute("id") == "tab-"+but){
	    elem.style.background="#dbdbdb";
	}
	else
	    elem.style.background="none";
     }
}
function addWebview(){
	webviews[generateUID()] = new function(){
                this.url = document.getElementById("url").value;
                this.displayName = document.getElementById("name").value
            }
            localStorage.setItem('webviews', JSON.stringify(webviews));
	dismissDialog()
refreshTabsAndWebview()
}
function dismissDialog(){
	document.getElementById("add-dialog").style.display="none";
}
function showDialog(){
	document.getElementById("add-dialog").style.display="inline-block";
}
function add(){
   showDialog()
}

function onTabClick(event){
    hideTabs(this.getAttribute("for"));
}

function onTabRightClick(event){
    delete webviews[this.getAttribute("for")];
    localStorage.setItem('webviews', JSON.stringify(webviews));
    refreshTabsAndWebview()
    hideTabs(Object.keys(webviews)[0])
}
function closeWindow(){
    const remote = require('electron').remote;
    var window = remote.getCurrentWindow();
    window.close();
}
refreshTabsAndWebview()
hideTabs(Object.keys(webviews)[0])
delete window.Notification