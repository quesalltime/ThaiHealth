package ken.thaihealth.model.bean;

/**
 * Created by kenlin on 16/2/20.
 */
public class HeartRateRecord {

    private int value = 0;
    private String residentName = "";
    private String residnetAddr = "";
    private String time = "";

    public HeartRateRecord(int value, String residentName, String residnetAddr, String time) {
        this.value = value;
        this.residentName = residentName;
        this.residnetAddr = residnetAddr;
        this.time = time;
    }


    public int getHrValue() {
        return value;
    }

    public String getResidentName() {
        return residentName;
    }

    public String getResidnetAddr() {
        return residnetAddr;
    }

    public String getTime() {return time;}
}
