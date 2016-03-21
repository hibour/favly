//
//  ShareManager.m
//  Favly
//
//  Created by Nageswara Rao Mannem on 3/20/16.
//  Copyright © 2016 Facebook. All rights reserved.
//

#import "ShareManager.h"
#import "RCTConvert.h"
#import "RCTBridge.h"
#import "RCTEventDispatcher.h"

@implementation ShareManager {
  UIDocumentInteractionController *_interactionController;
}

@synthesize bridge = _bridge;

- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}


RCT_EXPORT_MODULE();
RCT_EXPORT_METHOD(open:(NSDictionary *)options)
{
  NSString *shareType = options[@"share_type"];
  
  if ([shareType isEqualToString:@"audio"]) {
    if ([[UIApplication sharedApplication] canOpenURL: [NSURL URLWithString:@"whatsapp://app"]]){
      _interactionController =
        [UIDocumentInteractionController interactionControllerWithURL:[NSURL fileURLWithPath:options[@"share_path"]]];
      _interactionController.UTI = @"net.whatsapp.audio";
      _interactionController.delegate = self;
      [_interactionController presentOpenInMenuFromRect:CGRectMake(0, 0, 0, 0) inView:[self getView] animated: YES];
    } else {
      UIAlertView * alert = [[UIAlertView alloc] initWithTitle:@"Error"
                                                       message:@"Couldn't find whatsapp!"
                                                      delegate:nil
                                             cancelButtonTitle:@"OK"
                                             otherButtonTitles:nil];
      [alert show];
    }
  } else {
    
    // Your implementation here
    NSString *shareText = [RCTConvert NSString:options[@"share_text"]];
    NSString *shareUrl = [RCTConvert NSString:options[@"share_URL"]];
    //some app extension need a NSURL or UIImage Object to share
    NSURL *cardUrl = [NSURL URLWithString:shareUrl];
    
    NSArray *itemsToShare = @[shareText, shareUrl,cardUrl];
    UIActivityViewController *activityVC = [[UIActivityViewController alloc] initWithActivityItems:itemsToShare applicationActivities:nil];
    /*activityVC.excludedActivityTypes = @[UIActivityTypePostToWeibo,
     UIActivityTypeMessage,
     UIActivityTypeMail,
     UIActivityTypePrint,
     UIActivityTypeCopyToPasteboard,
     UIActivityTypeAssignToContact,
     UIActivityTypeSaveToCameraRoll,
     UIActivityTypeAddToReadingList,
     UIActivityTypePostToFlickr,
     UIActivityTypePostToVimeo,
     UIActivityTypePostToTencentWeibo,
     UIActivityTypeAirDrop];*/
    [[self getViewController] presentViewController:activityVC animated:YES completion:nil];
  }
}

#pragma mark - UIDocumentInteractionControllerDelegate

- (UIViewController *)documentInteractionControllerViewControllerForPreview:(UIDocumentInteractionController *)controller
{
  return [self getViewController];
}

- (UIView *)documentInteractionControllerViewForPreview:(UIDocumentInteractionController *)controller
{
  return [self getView];
}

- (CGRect)documentInteractionControllerRectForPreview:(UIDocumentInteractionController *)controller
{
  return [self getView].frame;
}

#pragma mark - Helper Methods

- (UIViewController *)getViewController
{
  return [[[[UIApplication sharedApplication] delegate] window] rootViewController];
}

- (UIView *)getView
{
  UIViewController *viewController = [self getViewController];
  return viewController.view;
}


@end
