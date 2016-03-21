package com.favly;

import com.facebook.react.ReactActivity;
import com.BV.LinearGradient.LinearGradientPackage;
import com.microsoft.codepush.react.CodePush;
import com.rnfs.RNFSPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;

import java.util.Arrays;
import java.util.List;

public class MainActivity extends ReactActivity {

    private CodePush _codePush;

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "Favly";
    }

    /**
     * Returns whether dev mode should be enabled.
     * This enables e.g. the dev menu.
     */
    @Override
    protected boolean getUseDeveloperSupport() {
        return BuildConfig.DEBUG;
    }

    @Override
    protected String getJSBundleFile() {
        return this._codePush.getBundleUrl("index.android.bundle");
    }

    /**
     * A list of packages used by the app. If the app uses additional views
     * or modules besides the default ones, add more packages here.
     */
    @Override
    protected List<ReactPackage> getPackages() {
        this._codePush = new CodePush("bkuwVsIXi6ABrZunWOUVOCV-mzEiN1Jqd0k6g", this, getUseDeveloperSupport());

        return Arrays.<ReactPackage>asList(
                new MainReactPackage(),
            new LinearGradientPackage(),
                this._codePush.getReactPackage(),
                new RNFSPackage(),
                new VectorIconsPackage(),
                new AudioPackage(),
                new SharePackage()
        );
    }
}
