/* 
	Modified 070417.0840
	By: REDMOND/jroot

*/

var defObj, myPop, fooBar, arrow, arrowShowAll; 	// Global vars
var IE, mac, win, Mz, Awk, NN;		// Global vars for browser types
var hiliteColor='#003399';		// Highlight color for mouseovers
var courseNavHilite='#FFFFFF';
var courseNavNoHilite='#EEEEEE';
var courseNavBorder='1px solid #999999';
var courseNavNoBorder='1px solid #EEEEEE';
// var showText = 'Show All';
// var hideText = 'Hide All';
// var uiArtFolder = 'http://macbu/UA/XMetaL_Images/';
var tOpen = uiArtFolder + 'triangle_open.gif';
var tClose = uiArtFolder + 'triangle_closed.gif';
var tTrans = uiArtFolder + 'triangle_transition.gif';
var cmdKey = uiArtFolder + 'cmd.gif';
var delxKey = uiArtFolder + 'delx.gif';
var CSect = 'sect_1';
var CNav = 'nav_1';

var procSelected=false;			// Flag indicating a procedure has been selected

// Check the browser type using the userAgent property set the browser var and global var 'ua'
(navigator.userAgent.indexOf('MSIE') > -1)?IE=true:IE=false;
(navigator.userAgent.indexOf('Firefox') > -1)?Mz=true:Mz=false;
(navigator.userAgent.indexOf('AppleWebKit') > -1)?Awk=true:Awk=false;
(navigator.userAgent.indexOf('Netscape') > -1)?NN=true:NN=false;
(navigator.userAgent.indexOf('Windows') > -1)?win=true:win=false;
(navigator.platform.indexOf('MacPPC') > -1)?mac=true:mac=false;
var ua;
if(NN) ua='NN';
if(IE) ua='IE';
if(Awk) ua='Awk';
if(Mz) ua='Mz'; 

// Set global arrays with style info for DIVs used in popup defs

if(IE){
	if(mac) { document.styleSheets[2].disabled = false;}
	else { document.styleSheets[1].disabled = false; }
}
else if (Mz || NN){
	document.styleSheets[1].disabled =  true;
	document.styleSheets[2].disabled =  true;
	if(mac){
		document.styleSheets[3].disabled =  false;
		document.styleSheets[4].disabled =  true;
	}
	else {
		document.styleSheets[3].disabled =  true;
		document.styleSheets[4].disabled =  false;
	}
}

	
// divStyle holds style properties for the enclosing DIV for the popup
var divStyle = ['position', 'border', 'width', 'cursor', 'marginTop' ];
	divStyle['position']='absolute';
	divStyle['border']='1px solid #999999';
	divStyle['width']='20em';
	divStyle['cursor']='default';
	switch (ua){
		case 'IE':
				divStyle['marginTop']='-.25em';
				break;
		default:
				divStyle['marginTop']='-1.5em';
	}
	
	
	
//onLoad event handler checks to see if there are expandos. If so we display 'Show All'
function init(){
	if(window.name == 'pfview')
	{
		DoPrintFriendlySetup();
	}
	if(IE){ 
		if(document.all.expando){
			document.all.showHideAll.innerHTML = showText;
			document.all.showHideTable.style.display='block';
		}
	}
	else{
		if(document.getElementsByName('expando').length > 0){
			document.getElementById('showHideAll').innerHTML = showText;
			document.getElementById('showHideTable').style.display='block';
		}
	}
	
	if(win){
		var nodeSet = document.getElementsByName('cmd');
		for (i=0; i < nodeSet.length; i++){
			if(Mz || NN){
				nodeSet[i].innerHTML = '<img src="' + cmdKey + '">';
			}
			else if(IE){
				nodeSet[i].innerHTML = '&#122';
			}
		}
		nodeSet = document.getElementsByName('delx');
		for (i=0; i < nodeSet.length; i++){
			if(Mz || NN){
				nodeSet[i].innerHTML = '<img src="' + delxKey + '">';
			}
			else if(IE){
				nodeSet[i].innerHTML = '&#214';
			}
		}
	}
	postback(0);
}	
	
// OnClick handler expands or collapses expando DIVs
function showHideBlock(obj, e, flag){
	if(e){
		if(!event){ var event=e; }
		// event.cancelBubble=true;  					// Stop event propogation (Commented out to fix bug #1281)
	}
	var targetObj=obj.nextSibling;  			// expando DIV is the next sibling of the DIV with the click handler
	while (targetObj.nodeName != 'DIV') {
		targetObj=targetObj.nextSibling;
	}
	obj=obj.childNodes[0];
	while(obj.nodeName!= 'IMG'){
		switch(obj.hasChildNodes()){
			case true: 
				obj=obj.childNodes[0];
				break;
			case false:
				obj=obj.nextSibling;
		}
	} 
	arrow=obj;
	if(flag){
		switch(flag){
			case 'show':
									targetObj.style.display='block';
									obj.src=tOpen;  
									return;
			case 'hide':
									targetObj.style.display='none';
									obj.src=tClose;
									return;
		}
	}
	else{
		if (targetObj.style.display=='none'){  	// If DIV is not displayed, show it
			targetObj.style.display='block';
			arrow.src=tTrans;
			setTimeout("arrow.src=tOpen", 50) 
		}
		else{
			targetObj.style.display='none'; 		// Otherwise DIV is displayed, so hide it
			arrow.src=tTrans;
			setTimeout("arrow.src=tClose", 50) 
		}
	}
}

// hilite is used with mouseover event on radio procedures 
function hilite(obj){
	//obj.style.textDecoration='underline';
	obj.style.borderBottom='1px dashed '+ hiliteColor;
	obj.style.color=hiliteColor;
}

// unhilite is used with mouseout events on radio procedures
function unhilite(obj){
	// if(!procSelected) return;
	// if(obj.childNodes[0].checked==true) obj.style.color=hiliteColor;
	// else obj.style.color=unHiliteColor;
	//obj.style.textDecoration='none';
	obj.style.borderBottom='0px solid #FFFFFF';
	obj.style.color='';
}

// expand function is for expanding definitions inline -- not currently used
function expand(objID){
	document.getElementById(objID).style.display='inline';
}

// collapse function is for hiding inline definitions -- not currently used
function collapse(objID){
	document.getElementById(objID).style.display='none';
}

// Hides any current definition popup -- click handler of BODY
function hide(){
	if(defObj) defObj.style.visibility='hidden';					// global defObj refers to DIV id="defDiv" -- Used only with Safari
	if(fooBar){																	// global fooBar refers to current dynamically inserted definition DIV used with other browsers
		fooBar.style.display='none';									// Hide the DIV
		fooBar.parentNode.removeChild(fooBar);				// Now remove it from the document
		fooBar=null;															// Reset the global
	
	}
}

// Stops event propagation to click handler of BODY
function cancel(e){
	if(!event) var event=e;													// stop event propagation to BODY
	else e=event;
	event.cancelBubble=true;
}

// Shows the popup definition -- click handler of SPAN holding term
// e is passed event, objID is the @id of the hidden definition span
function showDef(e, objID){
	if(!event) 
	{
		var event=e;
	}
	//else e=event;
	event.cancelBubble=true;  // stop event propagation to BODY

	var x, y, w;																			// vars for positioning popup DIV
	x1 = 240; 
	x2 = x1 + 25;
	if(NN || Mz) event.srcElement=event.target;
	
	//var htmlContent = '<div class="termdiv">'+ document.getElementById(objID).id +'</div>';   				// create content string for DIV

	if(!event.srcElement.innerHTML)	var htmlContent = event.srcElement.nodeValue;
	else var htmlContent = event.srcElement.innerHTML;
	//alert(htmlContent.length);
	if (htmlContent.length > 30){
		w = parseInt((((htmlContent.length - 30) *.5)  + 20));
		x1 = w * 12;
		x2 = x1 + 25;
		w = w + 'em';
	}
	var htmlContent = '<div class="termdiv">'+ htmlContent +'</div>';   				// create content string for DIV
	htmlContent += '<div class="termdefdiv">'+ document.getElementById(objID).innerHTML +'</div>'; 	

	switch (ua){																	// Different strokes for different folks
		case 'NN':
		case 'Mz':
		case 'IE':
				if(fooBar) fooBar.parentNode.removeChild(fooBar);		// If we've already got a def showing, remove it
				fooBar=null;																	// Reset global reference

				var foo=document.createElement('DIV');						// create a new DIV in document
				foo.innerHTML=htmlContent;
				fooBar=event.srcElement.parentNode.insertBefore(foo, event.srcElement);			// Insert the new definition DIV into the document
				fooBar.setAttribute('onclick', 'cancel(event)');				// Set the click event handler for the popup DIV so that it will not close if clicked

				for (param in divStyle) {												// Set the style properties for the popup DIV
					fooBar.style[param]=divStyle[param];
				}
				if(w) {
					fooBar.style.width = w;
				}

				x = e.clientX;																// Get the x location of the click event
				if(x > (window.innerWidth - x1)) {									// If x is too close to right window edge tweak it -- innerWidth is undef in IE
					if((window.innerWidth - x1) < 25) {
						x = 15;
					}
					else x = window.innerWidth - x2;
					foo.style.left = x;
				}
				else if (x < 25) foo.style.left = 15;									// If x is too close to the left window edge, set it at a minimum position
				else foo.style.left = x - 25;												// Otherwise just set the DIV 25px left of the event
				break;
				
		case 'Awk':																			// If it's Safari (Apple WebKit), use the embedded defDiv
																									// 'cuz inserting a new DIV before the event source will cause a line permanent line break
				defObj = document.getElementById('defDiv');				// get the hidden DIV and set the global reference so we can hide it later
				var obj = defObj;															// set a local reference 
				x = event.x;																	// get the x location of the event
				if(x > (window.innerWidth - x1)){									// If x is too close to right window edge tweak it
					if((window.innerWidth - x1) < 25) {
						x = 15;
					}
					else x = window.innerWidth - x2;
				}
				else if(x < 25) x = 15;														// If x is too close to the left window edge, set it at a minimum position
				else x = x - 25;																// Otherwise just set the DIV 25px left of the event
				y=event.pageY-12;														// Get the y location of the event and adjust it
				obj=obj.style;
				obj.left=x;																	// Set the x location of the DIV
				obj.top=y;																	// Set the y location of the DIV
				if(w) obj.width = w;
				else obj.width = '';
				obj.visibility='visible';													// Show the DIV
				defObj.innerHTML=htmlContent;									// Insert content in definition DIV
				break;
	}
	unhilite(event.srcElement);
}

// Show the selected radio button procedurte in a multi-proc -- click handler of P holding procedure title and radio button
// Parameter obj is the event source
function showRadioProc (obj, e){
	if(!event) var event=e;																// stop event propagation to BODY
	else e=event;
	event.cancelBubble=true;
	if(procSelected) procSelected.checked = false;
																		// set flag indicating a proc has been selected
	var inputObj = obj.childNodes[0];
	while(inputObj.nodeName != 'INPUT'){
		inputObj=inputObj.nextSibling;
	}
	inputObj.checked=true;												// Select the radio button child of the event source
	procSelected = inputObj;
	
	var target=document.getElementById('contentDiv');					// set reference to empty DIV that will hold the displayed procedure
	obj = obj.parentNode.nextSibling;
	while(obj.nodeName != 'DIV'){
		obj = obj.nextSibling;
	}
	target.innerHTML=obj.innerHTML;		// Copy the content of the hidden procedure to DIV id="contentDiv"
	target.style.display='block';															// Display the DIV id="contentDiv"
	obj = document.getElementsByName('foo');								// Get the collection of radio buttons
//	for(i=0; i < obj.length; i++){															// Iterate the collection to gray out the text of unselected procedures
//		if(obj[i].checked) obj[i].parentElement.style.color='';
//		else obj[i].parentElement.style.color=unHiliteColor;
//	}
}

function showHideAll (srcObj){
	var obj = document.getElementById('showHideAll');
	var flag, nodeSet;
	unhilite(obj);
//	hflag=false;
	
	arrowShowAll=srcObj.childNodes[0];
	while(arrowShowAll.nodeName!= 'IMG'){
		switch(arrowShowAll.hasChildNodes()){
			case true: 
				arrowShowAll=arrowShowAll.childNodes[0];
				break;
			case false:
				arrowShowAll=arrowShowAll.nextSibling;
		}
	} 
	var str = obj.innerHTML;
	switch(IE){
		case true: 	nodeSet = document.all.expando;
							break;
		case false: 	nodeSet = document.getElementsByName('expando');
							break;
	}
	switch (str){
		case showText: 	obj.innerHTML=hideText;
								flag='show';
								arrowShowAll.src=tTrans;
								setTimeout("arrowShowAll.src=tOpen", 60) 
								break;
		case hideText: 	obj.innerHTML=showText;
								flag='hide';
								arrowShowAll.src=tTrans;
								setTimeout("arrowShowAll.src=tClose", 60) 
								break;
	}
	if(IE){
		 if(document.all.expando && !nodeSet.length){ 
			 showHideBlock(nodeSet, null, flag);
			 return;
		}
	}
	for(i=0; i<nodeSet.length; i++){
		showHideBlock(nodeSet[i], null, flag);
	}
}

function swaparrow(srcobj)
{	
	var flag = false;
	obj=srcobj.childNodes;
	for(i=0; i < obj.length; i++)
	{
		if(obj[i].nodeName)
		{
			if(obj[i].nodeName == 'IMG')
			{
				obj = obj[i];
				flag = true;
			}
		}
		if(flag) break;
	}
		
	if(obj.src.indexOf("course_arrow_r_disabled.gif") != -1)
	{
		obj.src = uiArtFolder + "/course_arrow_r.gif";
		srcobj.style.color = "#000000";
	}
	else if(obj.src.indexOf("course_arrow_l_disabled.gif") != -1)
	{
		obj.src = uiArtFolder + "/course_arrow_l.gif";
		srcobj.style.color = "#000000";
	}
	else if(obj.src.indexOf("course_arrow_r.gif") != -1)
	{
		obj.src = uiArtFolder + "/course_arrow_r_disabled.gif";
		srcobj.style.color = "";
	}
	else if(obj.src.indexOf("course_arrow_l.gif") != -1)
	{
		obj.src = uiArtFolder + "/course_arrow_l_disabled.gif";
		srcobj.style.color = "";
	}
}

function showSect(i, flag, srcObj)
{
	var srcDiv, targDiv, j;
	var srcNav, targNav;

	srcNav = CNav;

	if(srcObj != null){
		srcDiv = CSect;
		targDiv = "sect_" + i;
		//srcNav = CNav;
		targNav = "nav_" + i;
	}
	else{
		j = i;
		srcDiv = "sect_" + i;
		//srcNav = "nav_" + i;
	if(flag)	j--;
	else j++;
		targDiv = "sect_" + j;
		targNav = "nav_" + j;
	}
	CSect = targDiv;
	CNav = targNav;
	document.getElementById(srcDiv).style.display = '';
	document.getElementById(targDiv).style.display = 'block';
	window.scrollTo(0,0);
	document.getElementById(srcNav).style.border = courseNavNoBorder;
	document.getElementById(srcNav).style.backgroundColor = courseNavNoHilite;

	document.getElementById(targNav).style.border = courseNavBorder;
	document.getElementById(targNav).style.backgroundColor = courseNavHilite;
	if(document.getElementById(targNav).getAttribute('chapter') != null)
	{
		if(document.getElementById(targNav).getAttribute('chapter') != '')
		{
			var cnum = document.getElementById(targNav).getAttribute('chapter');
			var arrow = cnum + '_ar';
			if(document.getElementById(cnum).style.display != 'block')
			{
				expandNode(document.getElementById(arrow));
			}
		}
	}
	postback(i);
}

function postback(i)
{
//    if(window.name != 'pfview')
//    {
//	    alert(window.name + " : Posting log data for page change");
//    }
}

function showAsPF(i)
{
    var url = document.URL; 
    var newDoc = open(url, 'pfview'); 
}

function DoPrintFriendlySetup()
{
    var pfvcontent = document.getElementById(qrSectId);
    var dropNode = document.getElementById('qrPageHeading');
    pfvcontent.removeChild(dropNode);
    var contentDiv = document.getElementById('coursecontent');
    document.getElementById('main').replaceChild(pfvcontent, contentDiv);
    document.getElementById('mootstyles').href = uiArtFolder + 'mootpfv.css';
}

function expandNode(obj)
{
	arrow = getChild(obj, 'SPAN');
	arrow = getChild(arrow, 'IMG');
	
	obj = obj.parentNode.nextSibling;
	obj = getSibling(obj, 'TR');
	obj = getChild(obj, 'TD');
	obj = getChild(obj, 'DIV');
	
	if(obj.style.display == "none" || obj.style.display == ""){
		obj.style.display = "block";
		arrow.src = tTrans;
		setTimeout("arrow.src = tOpen", 50);
	}
	else{
		obj.style.display = "none";
		arrow.src = tTrans;
		setTimeout("arrow.src = tClose", 50);
	}
}

function getChild(obj, nname){
	obj = obj.firstChild;
	obj = getSibling(obj, nname);
	return obj;
}

function getSibling(obj, nname){
	while (obj.nodeName != nname){
		obj = obj.nextSibling;
	}
	return obj;
}

function doPrint(obj)
{
	//document.getElementById(CNav).style.borderColor = courseNavNoHilite;
	//document.getElementById(CNav).style.backgroundColor = courseNavNoBorder;
	//CNav = obj.id;
	//obj.style.borderColor = courseNavBorder;
	//obj.style.backgroundColor = courseNavHilite;
	//alert("Print functionality under development.");
	window.print();
}

// These functions specific to MOOT Courses

function showAns(objID, groupID){
	var displayStyle = 'inline';
	if(Awk) displayStyle = 'block';
	var group = document.getElementsByName(groupID);

	for(i=0; i < group.length; i++){
		document.getElementById(groupID + (i + 1)).style.display = 'none'
		
	}
	document.getElementById(objID).style.display = displayStyle;
}

	
function selectRadio(objID, pos){
	document.getElementsByName(objID)[pos-1].click();
}
	
	function doNothing(){}