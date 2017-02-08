isDebugMode = false;

function getDebugModeStatus() {
	return isDebugMode;
}

function switchDebugModeStauts() {
	isDebugMode = !isDebugMode;
	alert("debug mode:"+isDebugMode);
}

function dbgAlert(msg) {
	if(isDebugMode===true) {
		alert(msg);
	}
}

function consoleLog(tag,msg) {
	console.log("ONERROR: err [" + err.name + "] msg[" + err.message + "]");
}