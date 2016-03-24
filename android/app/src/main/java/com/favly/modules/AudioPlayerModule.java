package com.favly.modules;

import android.media.MediaPlayer;
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
import java.util.Map;

/**
 * Created by nageswara on 3/8/16.
 */
public class AudioPlayerModule extends ReactContextBaseJavaModule implements MediaPlayer.OnCompletionListener,
        MediaPlayer.OnPreparedListener {

    private static final String TAG = "AudioPlayerModule";

    private static final String PLAYER_STARTED = "playerStarted";
    private static final String PLAYER_PROGRESS = "playerProgress";
    private static final String PLAYER_FINISHED = "playerFinished";

    MediaPlayer mMediaPlayer;
    ProgressHandler mProgressHandler;

    public AudioPlayerModule(ReactApplicationContext reactContext) {
        super(reactContext);
        mProgressHandler = new ProgressHandler(Looper.getMainLooper());
    }

    @Override
    public String getName() {
        return "AudioPlayerModule";
    }

    @ReactMethod
    public void play(String path) {
        try {
            if (mMediaPlayer != null) {
                mMediaPlayer.stop();
                mMediaPlayer.release();
            }
            Log.d(TAG, "Going to play audio from " + path);
            mMediaPlayer = new MediaPlayer();
            mMediaPlayer.setOnCompletionListener(this);
            mMediaPlayer.setOnPreparedListener(this);
            mMediaPlayer.setDataSource(getReactApplicationContext(), Uri.parse(path));
            mMediaPlayer.prepare();
        } catch (IOException ioe) {
            Log.e(TAG, "Failed to load the audio file ", ioe);
        } catch (IllegalStateException ise) {
            Log.e(TAG, "Failed to load the audio file " + ise.getMessage(), ise);
        }
    }

    @ReactMethod
    public void pause() {
        if (mMediaPlayer != null && mMediaPlayer.isPlaying()) {
            Log.d(TAG, "Pausing the audio");
            mMediaPlayer.pause();
        }
    }

    @ReactMethod
    public void unpause() {
        if (mMediaPlayer != null && !mMediaPlayer.isPlaying()) {
            Log.d(TAG, "Unpausing the audio");
            mMediaPlayer.start();
        }
    }

    @ReactMethod
    public void stop() {
        if (mMediaPlayer != null && mMediaPlayer.isPlaying()) {
            Log.d(TAG, "Stopping the audio");
            mMediaPlayer.stop();
            mMediaPlayer.reset();
            mMediaPlayer.release();
            mMediaPlayer = null;
        }
    }

    @ReactMethod
    public void setCurrentTime(int time) {
        if (mMediaPlayer != null && mMediaPlayer.isPlaying()) {
            mMediaPlayer.seekTo(time);
        }
    }

    @ReactMethod
    public void getDuration(Callback infoCallback) {
        if (mMediaPlayer != null && mMediaPlayer.isPlaying()) {
            infoCallback.invoke(mMediaPlayer.getDuration());
        } else {
            infoCallback.invoke(0);
        }
    }

    @ReactMethod
    public void getCurrentTime(Callback infoCallback) {
        if (mMediaPlayer != null && mMediaPlayer.isPlaying()) {
            infoCallback.invoke(mMediaPlayer.getCurrentPosition());
        } else {
            infoCallback.invoke(0);
        }
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
        Log.d(TAG, "Audio Playback started at" + System.currentTimeMillis());
        mp.start();
        // Start recording..
        // post to the handler.
        sendEvent(getReactApplicationContext(), PLAYER_STARTED, Arguments.createMap());
        mProgressHandler.sendEmptyMessage(ProgressHandler.UPDATE_PROGRESS);
    }

    @Override
    public void onCompletion(MediaPlayer mp) {
        // remove from the handler.
        mProgressHandler.removeMessages(ProgressHandler.UPDATE_PROGRESS);
        mp.reset();
        mp.release();
        sendEvent(getReactApplicationContext(), PLAYER_FINISHED, Arguments.createMap());
        if (mp == mMediaPlayer) {
            mMediaPlayer = null;
        }
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
                    if (mMediaPlayer != null && mMediaPlayer.isPlaying()) {
                        WritableMap values = Arguments.createMap();
                        values.putInt("currentDuration", mMediaPlayer.getDuration() / 1000);
                        values.putInt("currentTime", mMediaPlayer.getCurrentPosition() / 1000);
                        sendEvent(getReactApplicationContext(), PLAYER_PROGRESS, values);

                        msg = obtainMessage(UPDATE_PROGRESS);
                        sendMessageDelayed(msg, 200);
                    }
                    break;
            }
        }
    }
}
