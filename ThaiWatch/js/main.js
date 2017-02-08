var mainActivity = null,
	nfcHandler = null;
	btHandler = null;


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
	    stopMeasure();
	    startMeasure();
	}
	
	function showInitMsg() {
		var objNews = document.getElementById('areaContent');
		
	    clearElmText(objNews);
	    addElmText(objNews, 'subject', 'Initializing...');
	}
	
	function closeAPPAndService() {
		try {
			stopMeasure();
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
	
	function setClickEvents() {
	    document.addEventListener('tizenhwkey', keyEventCB);
	    document.getElementById('areaTitle').addEventListener('click', switchDebugModeStauts);
	    //document.getElementById('areaContent').addEventListener('click', sapInit);
	    document.getElementById('areaBtn').addEventListener('click', closeAPPAndService);
	}
	
	function sapInit() {
		if(sapHelper == null) {
			//dbgAlert("sap init");
			sapHelper = new SAPHelper();
		}
		if(sapHelper.isSAPTerminated()===true) {
			//dbgAlert("sap init2");
			sapHelper.sapInit();
		}
	}
	
	this.sapInit = sapInit;
	
	//For onchangedHR, the "this" ref is NOT the MainActivity.
	function onchangedHR(hrInfo) {
		try {
			//sapInit();
			
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
				if(sapHelper.isSAPTerminated()===false) {
					sapHelper.sendData(""+hrInfo.heartRate);
					
				//Handle the event when launch watch APP before turn on BT.
				} else {
					sapHelper.sapInit();
				}
				//console.log("hr > 0 :"+hrInfo.heartRate);
			} else if(hrInfo.heartRate < 0) {
				negativeHRCount++;
				//console.log("hr < 0 :"+hrInfo.heartRate);
			} else {
				zeroHRCount++;
			}
			
		} catch(err) {
			dbgAlert("onchangedHR err [" + err.name + "] msg[" + err.message + "]");
			
			//Handle the event that re-turn on BT while wathc APP is running.
			if(err.name="IOError") {
				//sapInit();
				sapHelper.sapInit();
			}
		}
	}
	
	function startMeasure() {
		try {
			tizen.humanactivitymonitor.start("HRM", onchangedHR);
		} catch(err) {
			dbgAlert("Fail to start measure hr");
		}
	}
	
	function stopMeasure() {
		try {
			tizen.humanactivitymonitor.stop("HRM");
		} catch(err) {
			dbgAlert("Fail to stop measure hr");
		}
	}
	
//	this.mainInit = function() {
//	    setTitle();
//	    setClickEvents();
//	    startMeasure();
//	}
	
	
	//setTitle();
    setClickEvents();
    startMeasure();

}

window.onload = function() {
	try{
//		if(nfcHandler == null) {
//			dbgAlert("nfc init");
//			nfcHandler = new NFCHandler();
//			nfcHandler.nfcSwitch();
//		}
		
//		if(btHandler == null) {
//			dbgAlert("bt init");
//			btHandler = new BTHandler();
//			btHandler.btSwitch();
//		}
		
		if(mainActivity == null) {
			//dbgAlert("main init");
			mainActivity = new MainActivity();
			//mainActivity.mainInit();
		}

		mainActivity.sapInit();
		
		
	} catch(err) {
		dbgAlert("window.onload err [" + err.name + "] msg[" + err.message + "]");
	}
	
};