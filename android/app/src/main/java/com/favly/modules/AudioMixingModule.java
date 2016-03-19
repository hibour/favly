package com.favly.modules;

import android.support.annotation.Nullable;
import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.github.hiteshsondhi88.libffmpeg.ExecuteBinaryResponseHandler;
import com.github.hiteshsondhi88.libffmpeg.FFmpeg;
import com.github.hiteshsondhi88.libffmpeg.LoadBinaryResponseHandler;
import com.github.hiteshsondhi88.libffmpeg.exceptions.FFmpegCommandAlreadyRunningException;
import com.github.hiteshsondhi88.libffmpeg.exceptions.FFmpegNotSupportedException;
import com.github.lassana.recorder.AudioRecorder;
import com.github.lassana.recorder.AudioRecorderBuilder;
import com.github.lassana.recorder.Mp4ParserWrapper;

/**
 * Created by nageswara on 3/8/16.
 */
public class AudioMixingModule extends ReactContextBaseJavaModule {

    private static final String TAG = "AudioMixingModule";
    FFmpeg mFFMpeg;

    public AudioMixingModule(ReactApplicationContext reactContext) {
        super(reactContext);
        mFFMpeg = FFmpeg.getInstance(reactContext);
        try {
            mFFMpeg.loadBinary(new LoadBinaryResponseHandler() {
                @Override
                public void onStart() {
                }

                @Override
                public void onFailure() {
                }

                @Override
                public void onSuccess() {
                }

                @Override
                public void onFinish() {
                }
            });
        } catch (FFmpegNotSupportedException e) {
            // Handle if FFmpeg is not supported by device
        }
    }

    @Override
    public String getName() {
        return "AudioMixingModule";
    }

    @ReactMethod
    public void mixAudio(String options, String destination, final Callback callback) {
        try {
            String command = options + destination + "\n";
            Log.d(TAG, "Executing command " + command);
            mFFMpeg.execute(command, new ExecuteBinaryResponseHandler() {
                @Override
                public void onStart() {
                }

                @Override
                public void onProgress(String message) {
                }

                @Override
                public void onFailure(String message) {
                    callback.invoke(message, null);
                }

                @Override
                public void onSuccess(String message) {
                    callback.invoke(null, message);
                }

                @Override
                public void onFinish() {
                }
            });
        } catch (FFmpegCommandAlreadyRunningException e) {
            // Handle if FFmpeg is already running
        }
    }
}
