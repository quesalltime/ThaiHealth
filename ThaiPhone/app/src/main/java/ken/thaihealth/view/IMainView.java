package ken.thaihealth.view;

import java.util.ArrayList;

import ken.thaihealth.model.bean.HeartRateRecord;

/**
 * Created by kenlin on 16/2/20.
 */
public interface IMainView {

    public void updateSelfView(ArrayList<HeartRateRecord> hrRecords);

    public void updateObserveefView(ArrayList<HeartRateRecord> hrRecords);

}
