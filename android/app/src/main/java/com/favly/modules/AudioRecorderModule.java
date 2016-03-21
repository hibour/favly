package com.favly.modules;

import android.media.MediaRecorder;
import android.support.annotation.Nullable;
import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.RCTNativeAppEventEmitter;
import com.favly.modules.recorder.ApiHelper;
import com.favly.modules.recorder.AudioRecorder;
import com.favly.modules.recorder.AudioRecorderBuilder;

import java.io.File;

/**
 * Created by nageswara on 3/8/16.
 */
public class AudioRecorderModule extends ReactContextBaseJavaModule {

    private static final String TAG = "AudioRecorderModule";

    private static final String RECORDING_FINISHED = "recordingFinished";
    private static final String RECORDING_PROGRESS = "recordingProgress";

    AudioRecorder mRecorder;
    AudioRecorder.MediaRecorderConfig mConfig;
    ReactApplicationContext mReactContext;

    public AudioRecorderModule(ReactApplicationContext reactContext) {
        super(reactContext);
        mReactContext = reactContext;
        mConfig = new AudioRecorder.MediaRecorderConfig(96000, 2,
                MediaRecorder.AudioSource.DEFAULT, ApiHelper.DEFAULT_AUDIO_ENCODER, 44100);
    }

    @Override
    public String getName() {
        return "AudioRecorderModule";
    }

    @ReactMethod
    public void prepare(String path) {
        File cacheDir = mReactContext.getExternalCacheDir();
        if (cacheDir == null) {
            return;
        }
        String absolutePath = cacheDir.getPath() + path;
        File file = new File(absolutePath);
        if (file.exists()) {
            file.delete();
        }
        Log.d(TAG, "Preparing audio recorder to record at " + absolutePath);
        mRecorder = AudioRecorderBuilder.with(mReactContext)
                .fileName(absolutePath)
                .config(mConfig)
                .loggable().build();
    }

    @ReactMethod
    public void startRecording() {
        if (mRecorder == null) {
            return;
        }
        Log.d(TAG, "Audio recording started at" + System.currentTimeMillis());
        mRecorder.start(new AudioRecorder.OnStartListener() {
            @Override
            public void onStarted() {
                Log.d(TAG, "Audio recording actually started at" + System.currentTimeMillis());
            }

            @Override
            public void onException(Exception e) {

            }
        });
    }

    @ReactMethod
    public void pauseRecording() {
        Log.d(TAG, "Pausing audio recorder");
        pauseInternal(false);
    }

    @ReactMethod
    public void stopRecording() {
        Log.d(TAG, "Stopping audio recorder");
        pauseInternal(true);
        mRecorder = null;
    }

    private void pauseInternal(final boolean postFinished) {
        if (mRecorder == null) {
            return;
        }
        mRecorder.pause(new AudioRecorder.OnPauseListener() {
            @Override
            public void onPaused(String activeRecordFileName) {
                Log.d(TAG, "on Audio record paused " + activeRecordFileName);
                if (postFinished) {
                    WritableMap values = Arguments.createMap();
                    values.putString("status", "OK");
                    values.putString("audioFileURL", activeRecordFileName);
                    sendEvent(getReactApplicationContext(), RECORDING_FINISHED, values);
                }
            }

            @Override
            public void onException(Exception e) {
                Log.d(TAG, "on Audio record exception " + e.getMessage());
                if (postFinished) {
                    WritableMap values = Arguments.createMap();
                    values.putString("status", "FAILURE");
                    sendEvent(getReactApplicationContext(), RECORDING_FINISHED, values);
                }
            }
        });
    }

    private void sendEvent(ReactContext reactContext,
                           String eventName,
                           @Nullable WritableMap params) {
        reactContext
                .getJSModule(RCTNativeAppEventEmitter.class)
                .emit(eventName, params);
    }
}
