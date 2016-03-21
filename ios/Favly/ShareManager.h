//
//  ShareManager.h
//  Favly
//
//  Created by Nageswara Rao Mannem on 3/20/16.
//  Copyright © 2016 Facebook. All rights reserved.
//

#import "RCTBridgeModule.h"
#import "RCTLog.h"
#import <UIKit/UIDocumentInteractionController.h>

@interface ShareManager : NSObject <RCTBridgeModule, UIDocumentInteractionControllerDelegate>

@end
