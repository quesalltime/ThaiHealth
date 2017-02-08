package ken.thaihealth.presneter;

import java.util.ArrayList;

import ken.thaihealth.model.ModelRecordObservee;
import ken.thaihealth.model.ModelRecordSelf;
import ken.thaihealth.model.bean.HeartRateRecord;
import ken.thaihealth.view.IMainView;

/**
 * Created by kenlin on 16/2/20.
 */
public class MainPresenter {

    private static final String TAG = MainPresenter.class.getName();

    private IMainView mainView;
    private ModelRecordSelf modelRecordSelf;
    private ModelRecordObservee modelRecordObservee;

    private static final int MAX_DATA_SHOWN = 12;
    private ArrayList<HeartRateRecord> selfHrRecords = new ArrayList<HeartRateRecord>();
    private ArrayList<HeartRateRecord> observeeHrRecords = new ArrayList<HeartRateRecord>();

    public MainPresenter(IMainView mainView,ModelRecordSelf modelRecordSelf,ModelRecordObservee modelRecordObservee) {
        this.mainView = mainView;
        this.modelRecordSelf = modelRecordSelf;
        this.modelRecordObservee = modelRecordObservee;
    }

    public void updateSelfRecordView(final ArrayList<HeartRateRecord> hrRecords) {
        if(hrRecords.size() == 0) { return;}

        modelRecordSelf.add(hrRecords);

        if(selfHrRecords.size() >= MAX_DATA_SHOWN) {
            selfHrRecords = hrRecords;
        } else {
            ArrayList<HeartRateRecord> newSelfHrRecords = new ArrayList<HeartRateRecord>();
            newSelfHrRecords.addAll(selfHrRecords);
            newSelfHrRecords.addAll(hrRecords);
            selfHrRecords = newSelfHrRecords;
        }
        mainView.updateSelfView(selfHrRecords);
    }

    public void updateObserveeRecordView(final ArrayList<HeartRateRecord> hrRecords) {
        if(hrRecords.size() == 0) { return;}

        modelRecordObservee.add(hrRecords);

        if(observeeHrRecords.size() >= MAX_DATA_SHOWN) {
            observeeHrRecords = hrRecords;
        } else {
            ArrayList<HeartRateRecord> newObserveeHrRecords = new ArrayList<HeartRateRecord>();
            newObserveeHrRecords.addAll(observeeHrRecords);
            newObserveeHrRecords.addAll(hrRecords);
            observeeHrRecords = newObserveeHrRecords;
        }
        mainView.updateObserveefView(observeeHrRecords);
    }

}
