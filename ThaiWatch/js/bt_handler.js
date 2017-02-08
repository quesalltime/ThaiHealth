/*
 * Object BTHandler
 */

function BTHandler() {
	dbgAlert("br obj init 1");
	var bluetoothSwitchAppControl = 
			new tizen.ApplicationControl("http://tizen.org/appcontrol/operation/edit", null, "application/x-bluetooth-on-off");
	dbgAlert("br obj init 2");
	var	bluetoothVisibilityAppControl = 
			new tizen.ApplicationControl("http://tizen.org/appcontrol/operation/edit", null, "application/x-bluetooth-visibility");
	dbgAlert("br obj init 3");
	var	adapter = tizen.bluetooth.getDefaultAdapter();
	dbgAlert("br obj init 4");
		
	
	function launchSuccess() {
		dbgAlert("Bluetooth Settings application has successfully launched.");
	}
	function launchError(error) {
		dbgAlert("An error occurred: " + error.name + ". Please enable Bluetooth through the Settings application.");
	} 
	var serviceReply = {
	   /* onsuccess is called when the launched application reports success */
	   onsuccess: function(data) {
	      if (adapter.powered) {
	    	  dbgAlert("Bluetooth is successfully turned on.");
	      }
	   },
	   /* onfailure is called when the launched application reports failure of the requested operation */
	   onfailure: function()  {
		   dbgAlert("Bluetooth Settings application reported failure.");
	   }
	};
	
	
	function launchVisibilityError(error) {
		dbgAlert("An error occurred: " + error.name + ". Please enable Bluetooth visibility through the Settings application.");
	}
	var serviceVisibilityReply = {
	   /* Called when the launched application reports success */
	   onsuccess: function(data) {
		   //dbgAlert("Bluetooth is " + (adapter.visible ? "now discoverable." : "still not visible."));
		   dbgAlert("Bluetooth Settings application reported ok.");
	   },
	   /* Called when launched application reports failure */
	   onfailure: function() {
		   dbgAlert("Bluetooth Settings application reported failure.");
	   }
	};
	
	
	function btSwitch() {
		dbgAlert("btSwitch");
		
		tizen.application.launchAppControl(bluetoothVisibilityAppControl, null, null, launchVisibilityError, serviceVisibilityReply);
		tizen.application.launchAppControl(bluetoothSwitchAppControl, null, launchSuccess, launchError, serviceReply);
		
	}
	
	this.btSwitch = btSwitch;
}
