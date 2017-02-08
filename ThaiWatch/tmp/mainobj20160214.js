var TAG_MAIN = "TAG_MAIN",
	title = "",
	negativeHRCount = 0,
	zeroHRCount = 0,
 	sapHelper = null;

function clearElmText(objElm) {
    objElm.innerHTML = "";
}

function addElmText(objElm, textClass, textContent) {
    objElm.innerHTML = objElm.innerHTML + "<p class='" + textClass + "'>" + textContent + "</p>";
}

function setTitle() {
    var objTitle = document.getElementById('areaTitle');

    clearElmText(objTitle);
    addElmText(objTitle, 'headerTitle', title);
}

function showHR(hrValue) {
	var objNews = document.getElementById('areaContent');
	
    clearElmText(objNews);
    addElmText(objNews, 'subject', ''+hrValue);
}

function rewearWatch() {
	var objNews = document.getElementById('areaContent');
	
    clearElmText(objNews);
    addElmText(objNews, 'subject', 'Please attach Gear snugly to top or under side of wrist, not against the bone');
}

function showInitMsg() {
	var objNews = document.getElementById('areaContent');
	
    clearElmText(objNews);
    addElmText(objNews, 'subject', 'Initializing...');
}

function closeAPP() {
	try {
		tizen.humanactivitymonitor.stop("HRM");
		sapHelper.sapTerminate();
        tizen.application.getCurrentApplication().exit();
    } catch (ignore) {
    }
}

function keyEventCB(event) {
    if (event.keyName === 'back') {
        try {
            tizen.application.getCurrentApplication().exit();
        } catch (ignore) {
        }
    }
}

function setDefaultEvents() {
    document.addEventListener('tizenhwkey', keyEventCB);
    //document.getElementById('areaContent').addEventListener('click', sapInit);
    document.getElementById('areaBtn').addEventListener('click', closeAPP);
}

function onchangedHR(hrInfo) {
	if(sapHelper == null) {
		sapHelper = new SAPHelper();
		sapHelper.sapInit();
	}
	
	if(negativeHRCount>30) {
		rewearWatch();
		negativeHRCount = 0;
		//tizen.humanactivitymonitor.stop("HRM");
		return;
	}
	
	if(zeroHRCount>30) {
		showInitMsg();
		zeroHRCount = 0;
		//tizen.humanactivitymonitor.stop("HRM");
		return;
	}
	
	if(hrInfo.heartRate > 0) {
		showHR(hrInfo.heartRate);
		sapHelper.sendData(""+hrInfo.heartRate);
		//console.log("hr > 0 :"+hrInfo.heartRate);
	} else if(hrInfo.heartRate < 0) {
		negativeHRCount++;
		//console.log("hr < 0 :"+hrInfo.heartRate);
	} else {
		zeroHRCount++;
	}
}

function stratMeausre() {
	try {
		tizen.humanactivitymonitor.start("HRM", onchangedHR);
	} catch(err) {
		alert("Fail to start measure hr");
	}
}


function mainInit() {
    setTitle();
    setDefaultEvents();
    stratMeausre();
}

window.onload = function() {
	mainInit();
	if(sapHelper == null) {
		sapHelper = new SAPHelper();
		sapHelper.sapInit();
	}
};