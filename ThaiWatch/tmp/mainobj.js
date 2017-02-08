var mainActivity = null;


/*
 * Object MainActivity
 */
function MainActivity() {

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
	
	this.sapInit = function() {
		if(sapHelper == null) {
			//alert("sap init");
			sapHelper = new SAPHelper();
		}
		if(sapHelper.isSAPTerminated()===true) {
			//alert("sap init2");
			sapHelper.sapInit();
		}
	}
	
	//For onchangedHR, the "this" ref is NOT the MainActivity.
	function onchangedHR(hrInfo) {
		try {
			if(sapHelper == null) {
				alert("sap init");
				sapHelper = new SAPHelper();
			}
			if(sapHelper.isSAPTerminated()===true) {
				//alert("sap init2");
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
				if(sapHelper!=null && sapHelper.isSAPTerminated()!==true) {
					sapHelper.sendData(""+hrInfo.heartRate);
				}
				//console.log("hr > 0 :"+hrInfo.heartRate);
			} else if(hrInfo.heartRate < 0) {
				negativeHRCount++;
				//console.log("hr < 0 :"+hrInfo.heartRate);
			} else {
				zeroHRCount++;
			}
			
		} catch(err) {
			alert("onchangedHR err [" + err.name + "] msg[" + err.message + "]");
		}
	}
	
	function stratMeausre() {
		try {
			tizen.humanactivitymonitor.start("HRM", onchangedHR);
		} catch(err) {
			alert("Fail to start measure hr");
		}
	}
	
//	this.mainInit = function() {
//	    setTitle();
//	    setDefaultEvents();
//	    stratMeausre();
//	}
	
	
	setTitle();
    setDefaultEvents();
    stratMeausre();

}

window.onload = function() {
	try{
		//alert("window onload");
		if(mainActivity == null) {
			//alert("main init");
			mainActivity = new MainActivity();
			//mainActivity.mainInit();
		}

		mainActivity.sapInit();
		
		
	} catch(err) {
		alert("window.onload err [" + err.name + "] msg[" + err.message + "]");
	}
	
};