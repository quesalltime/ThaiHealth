package ken.thaihealth.view.activity;

import android.app.Activity;
import android.os.Bundle;
import android.os.Handler;
import android.support.v7.widget.GridLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;

import java.util.ArrayList;

import ken.thaihealth.R;
import ken.thaihealth.ThaiApp;
import ken.thaihealth.mock.MockDataProvider;
import ken.thaihealth.model.ModelRecordObservee;
import ken.thaihealth.model.ModelRecordSelf;
import ken.thaihealth.model.bean.HeartRateRecord;
import ken.thaihealth.presneter.MainPresenter;
import ken.thaihealth.view.IMainView;

public class MainActivity extends Activity implements IMainView {

    private static final String TAG = MainActivity.class.getName();

    private Handler mHandler = new Handler();
    private RecyclerView recordRecyclerView;
    private RecordViewAdapter recordAdapter;
    private ArrayList<HeartRateRecord> mHrRecords;
    private Button btn;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        btn = (Button) findViewById(R.id.button);

        //Init record cell view
        //recordRecyclerView = new RecyclerView(this);
        //setContentView(recordRecyclerView);
        recordRecyclerView = (RecyclerView) findViewById(R.id.recordRecycler);
        recordRecyclerView.setLayoutManager(new GridLayoutManager(this, 2));
        recordAdapter = new RecordViewAdapter();
        recordRecyclerView.setAdapter(recordAdapter);

        //Init MainPresenter
        ((ThaiApp)getApplicationContext()).setMainPresenter(
            new MainPresenter(this,new ModelRecordSelf(),new ModelRecordObservee())
        );


        //Test
        mHrRecords = MockDataProvider.getOriginHrRecords();

    }

    private class RecordViewAdapter extends RecyclerView.Adapter {
        @Override
        public RecyclerView.ViewHolder onCreateViewHolder(ViewGroup vGroup, int i) {
            return new RecordViewHolder(LayoutInflater.from(vGroup.getContext()).inflate(R.layout.record_cell, null));
        }

        @Override
        public void onBindViewHolder(RecyclerView.ViewHolder viewHolder, int i) {
            RecordViewHolder vHolder = (RecordViewHolder) viewHolder;
            vHolder.getHrValueView().setText("" + mHrRecords.get(i).getHrValue());
            vHolder.getResidentNameView().setText(mHrRecords.get(i).getResidentName());
            vHolder.getResidnetAddrView().setText(mHrRecords.get(i).getResidnetAddr());
            if(mHrRecords.get(i).getHrValue() >= 75) {
                vHolder.setColor(MainActivity.this.getResources().getColor(R.color.colorAlert));
            } else {
                vHolder.setColor(MainActivity.this.getResources().getColor(R.color.colorNormal));
            }
        }

        @Override
        public int getItemCount() {
            return mHrRecords.size();
        }
    }

    private class RecordViewHolder extends RecyclerView.ViewHolder {

        private View root;
        private TextView hrValueView;
        private TextView residentNameView;
        private TextView residnetAddrView;

        public RecordViewHolder(View root) {
            super(root);

            this.root = root;
            hrValueView = (TextView) root.findViewById(R.id.hrValue);
            residentNameView = (TextView) root.findViewById(R.id.residentName);
            residnetAddrView = (TextView) root.findViewById(R.id.residentAddr);
        }

        public TextView getHrValueView() {
            return hrValueView;
        }

        public TextView getResidentNameView() {
            return residentNameView;
        }

        public TextView getResidnetAddrView() {
            return residnetAddrView;
        }

        public void setColor(int colorCode) {
            this.root.setBackgroundColor(colorCode);
        }
    }

    @Override
    public void updateSelfView(final ArrayList<HeartRateRecord> hrRecords) {
        mHandler.post(new Runnable() {
            @Override
            public void run() {
                mHrRecords = hrRecords;
                recordAdapter.notifyDataSetChanged();
            }
        });
    }

    @Override
    public void updateObserveefView(ArrayList<HeartRateRecord> hrRecords) {

    }

}
