package com.favly.modules;

import android.net.Uri;
import android.util.Log;

import com.facebook.common.file.FileUtils;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import android.content.Intent;
import android.content.ActivityNotFoundException;

import com.facebook.react.bridge.ReadableMap;

import java.io.File;

public class ShareModule extends ReactContextBaseJavaModule {

    private static final String TAG = "ShareModule";
    ReactApplicationContext reactContext;

    public ShareModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "ShareModule";
    }

    @ReactMethod
    public void open(ReadableMap options, Callback callback) {
        Intent share = new Intent(android.content.Intent.ACTION_SEND);
        if (!options.hasKey("share_type") || options.isNull("share_type")) {
            callback.invoke("share_type is missing");
            return;
        }

        String shareType = options.getString("share_type");
        if ("audio".equalsIgnoreCase(shareType)) {
            share.setType("audio/wav");
            if (!options.hasKey("share_path") || options.isNull("share_path")) {
                callback.invoke("share_path is missing");
                return;
            }
            File file = new File(options.getString("share_path"));
            if (file.exists()) {
                share.putExtra(Intent.EXTRA_STREAM, Uri.fromFile(file));
            } else {
                Log.d(TAG, "File doesnt exist " + file.getPath());
                callback.invoke("not_available");
                return;
            }
        } else {
            share.setType("text/plain");
            if (options.hasKey("share_text") && !options.isNull("share_text")) {
                share.putExtra(Intent.EXTRA_SUBJECT, options.getString("share_text"));
            }
            if (options.hasKey("share_URL") && !options.isNull("share_URL")) {
                share.putExtra(Intent.EXTRA_TEXT, options.getString("share_URL"));
            }
        }

        String title = "Share";
        if (options.hasKey("title") && !options.isNull("title")) {
            title = options.getString("title");
        }

        try {
            Intent chooser = Intent.createChooser(share, title);
            chooser.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            this.reactContext.startActivity(chooser);
            callback.invoke("OK");
        } catch (ActivityNotFoundException ex) {
            callback.invoke("not_available");
        }
    }
}
