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

- (CMTime) composition:(AVMutableComposition *)composition
                  createCompositionTrackFor:(NSString *)path
                         withAudioMixParams:(NSMutableArray *)mixParams
                              withStartTime:(CMTime)startTime
                               withDuration:(CMTime)duration
                                 withVolume:(float)volume
{
  AVMutableCompositionTrack* audioTrack = [composition addMutableTrackWithMediaType:AVMediaTypeAudio
                                                                   preferredTrackID:kCMPersistentTrackID_Invalid];
  [audioTrack setPreferredVolume:volume];
  
  // grab the two audio assets as AVURLAssets according to the file paths
  AVURLAsset* masterAsset = [[AVURLAsset alloc] initWithURL:[NSURL fileURLWithPath:path] options:nil];
  AVAssetTrack *sourceTrack = [[masterAsset tracksWithMediaType:AVMediaTypeAudio] objectAtIndex:0];
  
  if (CMTIME_IS_INVALID(duration)) {
    duration = masterAsset.duration;
  }

  CMTimeRange tRange = CMTimeRangeMake(startTime, duration);
  
  
  //Set Volume
  AVMutableAudioMixInputParameters *trackMix = [AVMutableAudioMixInputParameters audioMixInputParametersWithTrack:sourceTrack];
  [trackMix setVolume:volume atTime:startTime];
  [mixParams addObject:trackMix];
  
  NSError* error = nil;
  [audioTrack insertTimeRange:tRange
                      ofTrack:sourceTrack
                       atTime:startTime
                        error:&error];
  
  
  if (error)
  {
    return kCMTimeInvalid;
  }
  return duration;
}

RCT_EXPORT_METHOD(mixAudio:(NSString *)audio
                  withAudio:(NSString *)vocal
                  withDestination:(NSString *)destination
                  withCallback:(RCTResponseSenderBlock)callback)
{
  NSLog(@"Starting mix audio..");
  NSMutableArray *audioMixParams = [[NSMutableArray alloc] init];
  
  // Generate a composition of the two audio assets that will be combined into
  // a single track
  AVMutableComposition* composition = [AVMutableComposition composition];
  CMTime recordDuration = [self composition:composition
                  createCompositionTrackFor:vocal
                         withAudioMixParams:audioMixParams
                              withStartTime:CMTimeMakeWithSeconds(1, 10)
                               withDuration:kCMTimeInvalid
                                 withVolume:1.0];
  [self composition:composition
createCompositionTrackFor:audio
 withAudioMixParams:audioMixParams
      withStartTime:kCMTimeZero
       withDuration:recordDuration
         withVolume:0.15];
  
  AVAssetExportSession* exportSession = [[AVAssetExportSession alloc] initWithAsset:composition
                                                                         presetName:AVAssetExportPresetAppleM4A];
  if (nil == exportSession)
  {
    callback(@[@"export session is nil", [NSNull null]]);
    return;
  }
  
  AVMutableAudioMix *audioMix = [AVMutableAudioMix audioMix];
  audioMix.inputParameters = [NSArray arrayWithArray:audioMixParams];
  
  // configure export session  output with all our parameters
  exportSession.outputURL = [NSURL fileURLWithPath:destination];
  exportSession.audioMix = audioMix;
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
