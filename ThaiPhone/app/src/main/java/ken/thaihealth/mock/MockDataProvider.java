package ken.thaihealth.mock;

import java.util.ArrayList;

import ken.thaihealth.model.bean.HeartRateRecord;

/**
 * Created by kenlin on 16/2/20.
 */
public class MockDataProvider {

    public static ArrayList<HeartRateRecord> getOriginHrRecords() {
        ArrayList<HeartRateRecord> hrRecords = new ArrayList<HeartRateRecord>();
        hrRecords.add(new HeartRateRecord(150, "Stacey Fang", "101 happy st. #200", "2016-02-20 12:02:02"));
        hrRecords.add(new HeartRateRecord(65, "Jen Lin", "101 happy st. #110", "2016-02-20 12:02:02"));
        hrRecords.add(new HeartRateRecord(60, "Sean Lin", "101 happy st. #60", "2016-02-20 12:02:02"));
        return hrRecords;

//        return new HeartRateRecord[]{
//            new HeartRateRecord(150, "Stacey Fang", "101 happy st. #200", "2016-02-20 12:02:02"),
//            new HeartRateRecord(100, "KEN LIN", "101 happy st. #201", "2016-02-20 12:02:02"),
//            new HeartRateRecord(50, "Issac Hsui", "101 happy st. #206", "2016-02-20 12:02:02")
//        };
    }

    public static HeartRateRecord[] getNewHrRecords() {
        return new HeartRateRecord[]{
            new HeartRateRecord(222, "Stacey Fang", "101 happy st. #200", "2016-02-20 12:02:02"),
            new HeartRateRecord(333, "KEN LIN", "101 happy st. #201", "2016-02-20 12:02:02"),
            new HeartRateRecord(60, "Issac Hsui", "101 happy st. #206", "2016-02-20 12:02:02")
        };
    }

}
