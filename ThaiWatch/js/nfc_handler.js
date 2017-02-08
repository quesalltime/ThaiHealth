/*
 * Object NFCHandler
 */

function NFCHandler() {
	var nfcSwitchAppControl = null,
		adapter = tizen.nfc.getDefaultAdapter();;
	
	function launchSuccess() {
		dbgAlert("NFC Settings application has successfully launched.");
	}
	
	function launchError(error) {
		dbgAlert("An error occurred: " + error.name + ". Please enable NFC through the Settings application.");
	} 
	
	var serviceReply = {
	   /* onsuccess is called when the launched application reports success */
	   onsuccess: function(data) {
	      if (adapter.powered) {
	    	  dbgAlert("NFC is successfully turned on.");
	      }
	   },
	   /* onfailure is called when the launched application reports failure of the requested operation */
	   onfailure: function()  {
		   dbgAlert("NFC Settings application reported failure.");
	   }
	};
	
	var nfcPeerDetect = {
		onattach: function(nfcPeer) {
			dbgAlert("Detect NFC peer");
		},
		
		ondetach: function() {
			dbgAlert("Lost NFC peer");
			// Unregisters the listener when NFC peer target is detached.
			//adapter.unsetPeerListener();
		}
	};
	
	function nfcSwitch() {
		dbgAlert("nfcSwitch");
		nfcSwitchAppControl = new tizen.ApplicationControl(
			"http://tizen.org/appcontrol/operation/setting/nfc", null, null, null,
			[new tizen.ApplicationControlData("type", "nfc")]
		);
		
		dbgAlert("nfcSwitch2");
		tizen.application.launchAppControl(nfcSwitchAppControl, null, launchSuccess, launchError, serviceReply);
		
//		if(tizen.systeminfo.getCapability("http://tizen.org/feature/network.nfc.p2p")) {
//			dbgAlert("allowed peer");
//		}
//		
//		if(tizen.systeminfo.getCapability("http://tizen.org/feature/network.nfc.card_emulation.hce")) {
//			dbgAlert("allowed card emu hce");
//		}
//		
//		adapter.setPeerListener(nfcPeerDetect);
	}
	
	this.nfcSwitch = nfcSwitch;
}
