//
//  HeadphonesManager.m
//  Favly
//
//  Created by Nageswara Rao Mannem on 4/14/16.
//  Copyright © 2016 Facebook. All rights reserved.
//

#import "HeadphonesManager.h"
#import "RCTConvert.h"
#import "RCTBridge.h"
#import "RCTEventDispatcher.h"
#import <AVFoundation/AVFoundation.h>

NSString *const HeadphoneStateChangedEvent = @"headphoneStateChanged";

@implementation HeadphonesManager {
}

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(initModule)
{
  [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(audioRouteChangeListenerCallback:)
                                               name:AVAudioSessionRouteChangeNotification
                                             object:nil];
}

- (void)audioRouteChangeListenerCallback:(NSNotification*)notification
{
  NSDictionary *interuptionDict = notification.userInfo;
  NSInteger routeChangeReason = [[interuptionDict valueForKey:AVAudioSessionRouteChangeReasonKey] integerValue];
  switch (routeChangeReason) {
    case AVAudioSessionRouteChangeReasonNewDeviceAvailable:
      NSLog(@"AVAudioSessionRouteChangeReasonNewDeviceAvailable");
      NSLog(@"Headphone/Line plugged in");
      [self dispatchEvent:@"true"];
      break;
      
    case AVAudioSessionRouteChangeReasonOldDeviceUnavailable:
      NSLog(@"AVAudioSessionRouteChangeReasonOldDeviceUnavailable");
      NSLog(@"Headphone/Line was pulled. Stopping player....");
      [self dispatchEvent:@"false"];
      break;
      
    case AVAudioSessionRouteChangeReasonCategoryChange:
      // called at start - also when other audio wants to play
      NSLog(@"AVAudioSessionRouteChangeReasonCategoryChange");
      [self dispatchEvent:@"unknown"];
      break;
  }
}

- (void)dispatchEvent:(NSString *)event
{
  [self.bridge.eventDispatcher
    sendAppEventWithName:HeadphoneStateChangedEvent body:@{ @"status": event }];
}

RCT_EXPORT_METHOD(isPluggedin:(RCTResponseSenderBlock)callback)
{
  BOOL result = NO;
  AVAudioSessionRouteDescription* route = [[AVAudioSession sharedInstance] currentRoute];
  for (AVAudioSessionPortDescription* desc in [route outputs]) {
    if ([[desc portType] isEqualToString:AVAudioSessionPortHeadphones]) {
      result = YES;
      break;
    }
  }
  callback(@[@(result)]);
}

@end
