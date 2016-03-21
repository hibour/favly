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

import java.io.File;
import java.io.IOException;

/**
 * Created by nageswara on 3/8/16.
 */
public class AudioRecorderNaiveModule extends ReactContextBaseJavaModule {

    private static final String TAG = "AudioRecorderModule";

    private static final String RECORDING_FINISHED = "recordingFinished";
    private static final String RECORDING_PROGRESS = "recordingProgress";

    MediaRecorder mMediaRecorder;
    ReactApplicationContext mReactContext;
    File activePath;

    public AudioRecorderNaiveModule(ReactApplicationContext reactContext) {
        super(reactContext);
        mReactContext = reactContext;
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
        activePath = new File(absolutePath);
        if (activePath.exists()) {
            activePath.delete();
        }
        Log.d(TAG, "Preparing audio recorder to record at " + activePath.getAbsolutePath());
        mMediaRecorder = new MediaRecorder();
        mMediaRecorder.setAudioSamplingRate(44100);
        mMediaRecorder.setAudioEncodingBitRate(96000);
        mMediaRecorder.setAudioChannels(2);
        mMediaRecorder.setAudioSource(MediaRecorder.AudioSource.DEFAULT);
        mMediaRecorder.setOutputFormat(MediaRecorder.OutputFormat.THREE_GPP);
        mMediaRecorder.setOutputFile(activePath.getAbsolutePath());
        mMediaRecorder.setAudioEncoder(ApiHelper.DEFAULT_AUDIO_ENCODER);
        try {
            mMediaRecorder.prepare();
            Log.d(TAG, "Recorder prepared at " + System.currentTimeMillis());
        } catch (IOException ioe) {
            Log.e(TAG, "Recorder failed" + System.currentTimeMillis(), ioe);
            mMediaRecorder = null;
        }
    }

    @ReactMethod
    public void startRecording() {
        if (mMediaRecorder == null) {
            return;
        }
        Log.d(TAG, "Audio recording started at" + System.currentTimeMillis());
        mMediaRecorder.start();
        Log.d(TAG, "Audio recording actually started at" + System.currentTimeMillis());
    }

    @ReactMethod
    public void pauseRecording() {
        Log.d(TAG, "Pausing audio recorder");
        throw new RuntimeException("Not supported!");
    }

    @ReactMethod
    public void stopRecording() {
        Log.d(TAG, "Stopping audio recorder");
        pauseInternal(true);
        mMediaRecorder = null;
    }

    private void pauseInternal(final boolean postFinished) {
        if (mMediaRecorder == null) {
            return;
        }
        mMediaRecorder.stop();
        Log.d(TAG, "on Audio record paused " + activePath.getAbsolutePath());
        if (postFinished) {
            WritableMap values = Arguments.createMap();
            values.putString("status", "OK");
            values.putString("audioFileURL", activePath.getAbsolutePath());
            sendEvent(getReactApplicationContext(), RECORDING_FINISHED, values);
        }
    }

    private void sendEvent(ReactContext reactContext,
                           String eventName,
                           @Nullable WritableMap params) {
        reactContext
                .getJSModule(RCTNativeAppEventEmitter.class)
                .emit(eventName, params);
    }
}
