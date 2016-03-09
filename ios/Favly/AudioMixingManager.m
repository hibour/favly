//
//  AudioMixingManager.m
//  Favly
//
//  Created by Nageswara Rao Mannem on 3/7/16.
//  Copyright © 2016 Facebook. All rights reserved.
//

#import "AudioMixingManager.h"
#import "RCTConvert.h"
#import "RCTBridge.h"
#import "RCTEventDispatcher.h"
#import <AVFoundation/AVFoundation.h>

@implementation AudioMixingManager {
  
}

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE();

- (AVMutableCompositionTrack *) composition:(AVMutableComposition *)composition
                  createCompositionTrackFor:(NSString *)path
{
  AVMutableCompositionTrack* audioTrack = [composition addMutableTrackWithMediaType:AVMediaTypeAudio
                                                                   preferredTrackID:kCMPersistentTrackID_Invalid];
  // grab the two audio assets as AVURLAssets according to the file paths
  AVURLAsset* masterAsset = [[AVURLAsset alloc] initWithURL:[NSURL fileURLWithPath:path] options:nil];
  NSError* error = nil;
  [audioTrack insertTimeRange:CMTimeRangeMake(kCMTimeZero, masterAsset.duration)
                      ofTrack:[[masterAsset tracksWithMediaType:AVMediaTypeAudio] objectAtIndex:0]
                       atTime:kCMTimeZero
                        error:&error];
  if (error)
  {
    return nil;
  }
  return audioTrack;
}

RCT_EXPORT_METHOD(mixAudio:(NSString *)audio
                  withAudio:(NSString *)vocal
                  withDestination:(NSString *)destination
                  withCallback:(RCTResponseSenderBlock)callback)
{
  NSLog(@"Starting mix audio..");
  // Generate a composition of the two audio assets that will be combined into
  // a single track
  AVMutableComposition* composition = [AVMutableComposition composition];
  AVMutableCompositionTrack* audioTrack = [self composition:composition createCompositionTrackFor:audio];
  AVMutableCompositionTrack* vocalTrack = [self composition:composition createCompositionTrackFor:vocal];
  
  if (audioTrack == nil || vocalTrack == nil) {
    callback(@[@"couldnt create tracks", [NSNull null]]);
    return;
  }
  
  [audioTrack setPreferredVolume:1.0];
  [vocalTrack setPreferredVolume:0.5];
  
  AVAssetExportSession* exportSession = [[AVAssetExportSession alloc] initWithAsset:composition
                                                                         presetName:AVAssetExportPresetAppleM4A];
  if (nil == exportSession)
  {
    callback(@[@"export session is nil", [NSNull null]]);
    return;
  }
  
  // configure export session  output with all our parameters
  exportSession.outputURL = [NSURL fileURLWithPath:destination];
  exportSession.outputFileType = AVFileTypeAppleM4A; // output file type
  exportSession.shouldOptimizeForNetworkUse = YES;
  
  [exportSession exportAsynchronouslyWithCompletionHandler:^{
    // export status changed, check to see if it's done, errored, waiting, etc
    NSLog(@"Exporting is completed %ld", (long)exportSession.status);
    switch (exportSession.status)
    {
      case AVAssetExportSessionStatusFailed:
        break;
      case AVAssetExportSessionStatusCompleted:
        callback(@[[NSNull null], @"OK"]);
        return;
      case AVAssetExportSessionStatusWaiting:
        break;
      default:
        break;
    }
    callback(@[@"exporting failed", [NSNull null]]);
  }];
}

@end
