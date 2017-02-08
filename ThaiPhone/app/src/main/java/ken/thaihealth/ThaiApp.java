package ken.thaihealth;

import android.app.Application;

import ken.thaihealth.presneter.MainPresenter;

/**
 * Created by kenlin on 16/2/20.
 */
public class ThaiApp extends Application {

    private static MainPresenter mainPresenter;

    @Override
    public void onCreate() {
        super.onCreate();
    }

    public static MainPresenter getMainPresenter() {
        return mainPresenter;
    }

    public static void setMainPresenter(MainPresenter mainPresenter) {
        ThaiApp.mainPresenter = mainPresenter;
    }
}
