/*
 * Object SAPHelper
 */
function SAPHelper() {

	var TAG_SAP = "TAG_SAP",
		CHANNELID = 1982
		SAAgent = null,
		SASocket = null,
		SAP_PROVIDER = "ThaiSAPHost";

	//define this function before var agentCallback 	
	function onerror(err) {
		//console.log("onerror: err [" + err.name + "] msg[" + err.message + "]");
		alert("onerror err [" + err.name + "] msg[" + err.message + "]");
	} 		
	 		
	//define this function before var agentCallback 
	function disconnect() {
		try {
			if (SASocket != null) {
				//console.log(" DISCONNECT SASOCKET NOT NULL");
				SASocket.close();
				SASocket = null;
			}
		} catch(err) {
			alert("disconnect err [" + err.name + "] msg[" + err.message + "]");
			//console.log(" DISCONNECT ERROR: exception [" + err.name + "] msg[" + err.message + "]");
		}
	}
	
	function onAgentError() {
		alert("onAgentError: Fail on socket connect");
	}
	
	//define this var before var peerAgentFindCallback 	
	var agentCallback = 
	{
		onconnect : function(socket) {
			//console.log( "agentCallback onconnect" + socket);
			SASocket = socket;
			//alert("SAP Connection established with RemotePeer");
//			SASocket.setSocketStatusListener(function(reason){
//				//console.log("Service connection lost, Reason : [" + reason + "]");
//				//disconnect();
//			});
			
			SASocket.setDataReceiveListener(onreceive);
		},
		onerror : onAgentError
	}; 	
	 	
	function onPeerAgentFindError() {
		alert("onPeerAgentFindError: Fail on find peer agent");
	}
	
	//define this var before function onsuccess
	var	peerAgentFindCallback = 
	{
		onpeeragentfound : function(peerAgent) {
			try {
				if (peerAgent.appName == SAP_PROVIDER) {
					//console.log(" peerAgentFindCallback::onpeeragentfound " + peerAgent.appname + " || " + SAP_PROVIDER);
					SAAgent.setServiceConnectionListener(agentCallback);
					SAAgent.requestServiceConnection(peerAgent);
				} else {
					//console.log(" peerAgentFindCallback::onpeeragentfound else");
					//alert("Not expected app!! : " + peerAgent.appName);
				}
			} catch(err) {
				alert("onpeeragentfound err [" + err.name + "] msg[" + err.message + "]");
				//console.log(" peerAgentFindCallback::onpeeragentfound exception [" + err.name + "] msg[" + err.message + "]");
			}
		},
		onerror : onPeerAgentFindError
	}; 
	
	function onsuccess(agents) {
		try {
			if (agents.length > 0) {
				SAAgent = agents[0];
				SAAgent.setPeerAgentFindListener(peerAgentFindCallback);
				SAAgent.findPeerAgents();
				
				//console.log(" onsuccess " + SAAgent.name);
			} else {
				alert("onsuccess: Not found SAAgent!!");
				//console.log(" onsuccess else");
			}
		} catch(err) {
			alert("onsuccess err [" + err.name + "] msg[" + err.message + "]");
			//console.log("onsuccess exception [" + err.name + "] msg[" + err.message + "]");
		}
	}	
	 	
	function onRequestSAAgentError() {
		alert("onRequestSAAgentError: Fail on request SAAgent");
	}
	
	function connect() {
		if(SASocket) {
			alert('SASocket exist');
	        return false;
	    }
		try {
			webapis.sa.requestSAAgent(onsuccess, onRequestSAAgentError);
		} catch(err) {
			alert("connect err [" + err.name + "] msg[" + err.message + "]");
			//console.log("exception [" + err.name + "] msg[" + err.message + "]");
		}
	}
	
	this.sendData = function(data) {
		SASocket.sendData(CHANNELID, data);
	};
	
	this.sapInit = function() {
		connect();
	};
	
	this.sapTerminate = function() {
		disconnect();
	};
	
	this.isSAPTerminated = function() {
		if(SASocket==null || SAAgent==null) {
			return true;
		} else {
			return false;
		}
	}
}