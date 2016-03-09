package com.favly.modules;

import android.media.MediaPlayer;
import android.media.MediaRecorder;
import android.net.Uri;
import android.os.Handler;
import android.os.Looper;
import android.os.Message;
import android.support.annotation.Nullable;
import android.util.Log;
import android.widget.Toast;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.io.IOException;

/**
 * Created by nageswara on 3/8/16.
 */
public class AudioRecorderModule extends ReactContextBaseJavaModule implements MediaPlayer.OnCompletionListener,
        MediaPlayer.OnPreparedListener {

    private static final String TAG = "AudioRecorderModule";

    private static final String PLAYER_PROGRESS = "playerProgress";
    private static final String PLAYER_FINISHED = "playerFinished";

    MediaRecorder mMediaRecorder;
    ProgressHandler mProgressHandler;

    public AudioRecorderModule(ReactApplicationContext reactContext) {
        super(reactContext);
        mMediaRecorder = new MediaRecorder();
        mProgressHandler = new ProgressHandler(Looper.getMainLooper());
    }

    @Override
    public String getName() {
        return "AudioRecorderModule";
    }

    @ReactMethod
    public void prepare(String path) {
    }

    @ReactMethod
    public void startRecording() {
    }

    @ReactMethod
    public void pauseRecording() {
    }

    @ReactMethod
    public void stopRecording() {
    }

    private void sendEvent(ReactContext reactContext,
                           String eventName,
                           @Nullable WritableMap params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }

    @Override
    public void onPrepared(MediaPlayer mp) {
        mp.start();
        // post to the handler.
        mProgressHandler.sendEmptyMessage(ProgressHandler.UPDATE_PROGRESS);
    }

    @Override
    public void onCompletion(MediaPlayer mp) {
        // remove from the handler.
        mProgressHandler.removeMessages(ProgressHandler.UPDATE_PROGRESS);
        mp.reset();
        mp.release();
        sendEvent(getReactApplicationContext(), PLAYER_FINISHED, Arguments.createMap());
    }

    private class ProgressHandler extends Handler {
        public static final int UPDATE_PROGRESS = 1;

        public ProgressHandler(Looper looper) {
            super(looper);
        }

        @Override
        public void handleMessage(Message msg) {
            super.handleMessage(msg);
            switch (msg.what) {
                case UPDATE_PROGRESS:
                    break;
            }
        }
    }
}
