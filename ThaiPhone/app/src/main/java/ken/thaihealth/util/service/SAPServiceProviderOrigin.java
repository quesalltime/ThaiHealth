package ken.thaihealth.util.service;

import android.content.Intent;
import android.os.Binder;
import android.os.Build;
import android.os.IBinder;
import android.text.format.Time;
import android.util.Log;
import android.widget.Toast;

import com.samsung.android.sdk.SsdkUnsupportedException;
import com.samsung.android.sdk.accessory.SA;
import com.samsung.android.sdk.accessory.SAAgent;
import com.samsung.android.sdk.accessory.SAPeerAgent;
import com.samsung.android.sdk.accessory.SASocket;

import java.util.ArrayList;

import ken.thaihealth.model.bean.HeartRateRecord;


public class SAPServiceProviderOrigin extends SAAgent {

	private static final String TAG = "SAPServiceProvider";

	public final static int SAP_SERVICE_CHANNEL_ID = 1982;

	private static SAPServiceConnection mConnectionHandler = null;

	private final IBinder mIBinder = new LocalBinder();

	private int[] freshRecordPool = null;

	public class LocalBinder extends Binder {
		public SAPServiceProviderOrigin getService() {
			Log.v(TAG, "LOCAL BINDER GET SERVICE");
			return SAPServiceProviderOrigin.this;
		}
	}

	@Override
	public IBinder onBind(Intent intent) {
		Log.v(TAG, "onBIND");
		return mIBinder;
	}

	public SAPServiceProviderOrigin() {
		super(TAG, SAPServiceConnection.class); //Class<ServiceConnection>
		Log.v(TAG, "SERVICE CONSTRUCTOR");
	}


	/*
	* Algorism for average raw data sets.
	*/
	private HeartRateRecord[] calProperValues(ArrayList<HeartRateRecord> freshRecordPool) {
		HeartRateRecord[] hrRecords = new HeartRateRecord[freshRecordPool.size()];
		hrRecords = freshRecordPool.toArray(hrRecords);

		HeartRateRecord[] result = new HeartRateRecord[1];
		result[0] = hrRecords[hrRecords.length-1];

		Log.w(TAG, "result value:" + result[0].getHrValue());

		return result;
	}


	@Override
	public void onCreate() {
		super.onCreate();
		Log.i(TAG, "onCreate: before new SA");
		SA mAccessory = new SA();
		try {
			mAccessory.initialize(this);
			Log.v(TAG, "onCreate: after sa.init");
		} catch (SsdkUnsupportedException e) {
			// try to handle SsdkUnsupportedException
			if (processUnsupportedException(e) == true) {
				return;
			}
			Log.e(TAG, "onCreate: SsdkUnsupportedException");
			e.printStackTrace();
		} catch (Exception e1) {
			Log.e(TAG, "onCreate :Exception");
			e1.printStackTrace();
			/*
			 * Your application can not use Accessory package of Samsung
			 * Mobile SDK. You application should work smoothly without using
			 * this SDK, or you may want to notify user and close your app
			 * gracefully (release resources, stop Service threads, close UI
			 * thread, etc.)
			 */
			stopSelf();
		}

	}


	@Override
	protected void onFindPeerAgentResponse(SAPeerAgent peerAgent, int result) {
		Log.v(TAG, "onFindPeerAgentResponse");
		if(result == PEER_AGENT_FOUND) {
			// Peer Agent is found
			Log.v(TAG, "onFindPeerAgentResponse: pear agent found");
		} else if(result == FINDPEER_DEVICE_NOT_CONNECTED){
			// Peer Agents are not found, no accessory device connected
			Log.v(TAG, "onFindPeerAgentResponse: pear agent not found,no accessory device connected");

		} else if(result == FINDPEER_SERVICE_NOT_FOUND ) {
			// No matching service on connected accessory
			Log.v(TAG, "onFindPeerAgentResponse: pear agent not found,no matching service");
		}
	}


	@Override
	protected void onServiceConnectionRequested(SAPeerAgent peerAgent) {
		Log.v(TAG, "onServiceConnectionRequested: " + peerAgent.getAppName());
		Toast.makeText(getBaseContext(), "Connection request accepted.", Toast.LENGTH_LONG).show();

//		if (peerAgent.getAccessory().getVendorId().equals("SAMSUNG ELECTRONICS")
//				&& peerAgent.getAccessory().getProductId().equals("SAMSUNG GEAR")) { acceptServiceConnectionRequest(peerAgent);
//		} else { rejectServiceConnectionRequest(peerAgent);
//		}
		acceptServiceConnectionRequest(peerAgent);
	}


	@Override
	protected void onServiceConnectionResponse(SAPeerAgent peerAgent,SASocket saSocket,int result) {
		Log.e(TAG, "onServiceConnectionResponse: start");

		if (result == CONNECTION_SUCCESS) {
			if (saSocket == null) {
				Log.e(TAG, "onServiceConnectionResponse: SASocket object is null");
				return;
			}

			mConnectionHandler = (SAPServiceConnection) saSocket;

			Log.v(TAG, "onServiceConnectionResponse: connectionID = " + mConnectionHandler.mConnectionId);

			Toast.makeText(getBaseContext(), "CONNECTION ESTABLISHED 19820623", Toast.LENGTH_LONG).show();


//					new Thread(new Runnable() {
//						public void run() {
//							try {
//								myConnection.send(SAP_SERVICE_CHANNEL_ID, "Android Send test".getBytes());
//							} catch (IOException e) {
//								e.printStackTrace();
//							}
//						}
//					}).start();


		} else if (result == CONNECTION_ALREADY_EXIST) {
			Log.e(TAG, "onServiceConnectionResponse: connection is already exist");
		} else {
			Log.e(TAG, "onServiceConnectionResponse: result error =" + result);
		}
	}


	@Override
	protected void onError(SAPeerAgent peerAgent, String errorMessage, int errorCode) {
		super.onError(peerAgent, errorMessage, errorCode);
	}

	private boolean processUnsupportedException(SsdkUnsupportedException e) {
		e.printStackTrace();
		int errType = e.getType();
		if (errType == SsdkUnsupportedException.VENDOR_NOT_SUPPORTED
				|| errType == SsdkUnsupportedException.DEVICE_NOT_SUPPORTED) {
            /*
             * Your application can not use Samsung Accessory SDK. You application should work smoothly
             * without using this SDK, or you may want to notify user and close your app gracefully (release
             * resources, stop Service threads, close UI thread, etc.)
             */
			stopSelf();
		} else if (errType == SsdkUnsupportedException.LIBRARY_NOT_INSTALLED) {
			Log.e(TAG, "You need to install Samsung Accessory SDK to use this application.");
		} else if (errType == SsdkUnsupportedException.LIBRARY_UPDATE_IS_REQUIRED) {
			Log.e(TAG, "You need to update Samsung Accessory SDK to use this application.");
		} else if (errType == SsdkUnsupportedException.LIBRARY_UPDATE_IS_RECOMMENDED) {
			Log.e(TAG, "We recommend that you update your Samsung Accessory SDK before using this application.");
			return false;
		}
		return true;
	}



	public class SAPServiceConnection extends SASocket {

		private static final String TAG = "SAPServiceConnection";

		private int mConnectionId;

		public SAPServiceConnection() {
			super(SAPServiceConnection.class.getName());
			Log.v(TAG, "constructor");
		}

		int COUNT_MAX = 20;
		int counter = 0;
		int showInt = 0;
		@Override
		public void onReceive(int channelId, byte[] data) {
			Log.v(TAG, "onReceive");
			final String message;
			Time time = new Time();
			time.set(System.currentTimeMillis());
			String timeStr = " " + String.valueOf(time.minute) + ":"+ String.valueOf(time.second);
			String strToUpdateUI = new String(data);
			message = getDeviceInfo() + strToUpdateUI.concat(timeStr);

			counter++;
			if(counter>COUNT_MAX) {
				showInt++;
				Toast.makeText(SAPServiceProviderOrigin.this.getBaseContext(), "Receive:" + (showInt) + "*" + COUNT_MAX, Toast.LENGTH_SHORT).show();
				counter = 0;
			}
			//MainActivity.sendMsgToHandler(10, "HR value:" + strToUpdateUI);

			if(mConnectionHandler == null){
				Log.e(TAG, "onReceive: can not get connection handler");
				return;
			}
//			new Thread(new Runnable() {
//				public void run() {
//					try {
//						mConnectionHandler.send(SAP_SERVICE_CHANNEL_ID, "Android Send test".getBytes());
//					} catch (IOException e) {
//						e.printStackTrace();
//					}
//				}
//			}).start();
		}


		@Override
		protected void onServiceConnectionLost(int errorCode) {
			mConnectionHandler = null;
			Log.e(TAG, "onServiceConectionLost: " + mConnectionId + " error code=" + errorCode);

//				new Thread(new Runnable() {
//					public void run() {
//						try {
//							mConnectionHandler.send(SAP_SERVICE_CHANNEL_ID, "Android Send test".getBytes());
//						} catch (IOException e) {
//							e.printStackTrace();
//						}
//					}
//				}).start();
		}

		@Override
		public void onError(int channelId, String errorString, int error) {
			Log.e(TAG, "onError: " + errorString + "  " + error);
		}

	}




	//Test function
	public String getDeviceInfo() {
		String manufacturer = Build.MANUFACTURER;

		String model = Build.MODEL;

		return manufacturer + " " + model ;
	}


//	public static void sendToWatch(final String message) {
//		if(mConnectionHandler == null){
//			Log.e(TAG, "sendToWatch:, can not get mConnectionHandler");
//			return;
//		}
//		new Thread(new Runnable() {
//			public void run() {
//				try {
//					mConnectionHandler.send(SAP_SERVICE_CHANNEL_ID, message.getBytes());
//				} catch (IOException e) {
//					e.printStackTrace();
//				}
//			}
//		}).start();
//	}

}
