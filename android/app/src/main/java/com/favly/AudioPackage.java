package com.favly;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.JavaScriptModule;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import com.favly.modules.AudioMixingModule;
import com.favly.modules.AudioPlayerModule;
import com.favly.modules.AudioRecorderModule;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Created by nageswara on 3/8/16.
 */
public class AudioPackage implements ReactPackage {

    public AudioPackage() {
    }

    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();
        modules.add(new AudioPlayerModule(reactContext));
        modules.add(new AudioRecorderModule(reactContext));
        modules.add(new AudioMixingModule(reactContext));
        return modules;
    }

    @Override
    public List<Class<? extends JavaScriptModule>> createJSModules() {
        return Collections.emptyList();
    }

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }
}
