class MessageParser {
  constructor(actionProvider, state) {
    this.actionProvider = actionProvider;
    this.state = state;
  }

  parse(message) {
    const lowerCaseMessage = message.toLowerCase();
    this.state.socket.emit('newMessage', { message: lowerCaseMessage });

    if (!this.state.socket.hasListeners('newReply')) {
      // avoid repeating listeners
      this.state.socket.on('newReply', data => {
        const { RCSMessage } = data.message;
        this.actionProvider.showMessage(RCSMessage);
      });
    }

    // This is for test only
    if (lowerCaseMessage.includes('image')) {
      this.actionProvider.showImageMessage(messageObj);
    }

    if (lowerCaseMessage.includes('video')) {
      this.actionProvider.showImageMessage(message2Obj);
    }

    // this.state.someFunction(this.actionProvider);
    // if (lowerCaseMessage.includes('hello') || lowerCaseMessage.includes('hi')) {
    //   this.actionProvider.showImageMessage();
    // }
    //   // this.state.someFunction(this.actionProvider, this.state.socket);
    //   // this.state.setActionProvider();
    // }
    //
    // if (lowerCaseMessage.includes('javascript')) {
    //   this.actionProvider.handleJavascriptList();
    // }
  }
}

export default MessageParser;

const messageObj = {
  "RCSMessage":{
    "timestamp":"2008-04-04T12:16:49-05:00",
    "locale":"en_US",
    "channel":"abc",
    "richcardMessage":{
      "message":{
        "generalPurposeCard":{
          "content":{
            "media":{
              "mediaUrl":"http://rcs-demo.aquto.com/static/images/flowerShop/00_Instant_Flora_Logo.jpg",
              "mediaContentType":"image/jpg",
              "height":"MEDIUM_HEIGHT",
              "mediaFileSize":42458,
              "mediaType":"image"
            }
          },
          "title":"ipad pro",
          "suggestions":[
            {
              "urlAction": "https://www.apple.com/ipad-pro",
            }
          ]
        },
        "messageContact":{
          "userContact":"urn:mbid:AQAAY8rFCwBeMO4UWPddFNdjT/1jwwWrsqVzupedIwUcd1/UIeBtgEHtnaqp1IbFCYyxxP+gYhMu9hICI48/Yzbffw+prP6fsYSMS/9vztCGNElhP/jGKpmlHAc5T/mTzAvGEjOfI9bsZJjurWPMZ7Emi0HuMUs="
        }
      }
    }
  }
};


const message2Obj = {
  "RCSMessage":{
    "timestamp":"2008-04-04T12:16:49-05:00",
    "locale":"en_US",
    "channel":"abc",
    "richcardMessage":{
      "message":{
        "generalPurposeCard":{
          "content":{
            "media":{
              "mediaUrl": "https://youtu.be/gM0qOa_H-rs",
              "mediaContentType": "video/mp4",
              "height": "MEDIUM_HEIGHT",
              "mediaFileSize": 42458,
              "mediaType": "video"
            }
          },
          "title":"ipad pro",
          "suggestions":[
            {
              "urlAction": "https://youtu.be/gM0qOa_H-rs"
            }
          ]
        },
        "messageContact":{
          "userContact":"urn:mbid:AQAAY8rFCwBeMO4UWPddFNdjT/1jwwWrsqVzupedIwUcd1/UIeBtgEHtnaqp1IbFCYyxxP+gYhMu9hICI48/Yzbffw+prP6fsYSMS/9vztCGNElhP/jGKpmlHAc5T/mTzAvGEjOfI9bsZJjurWPMZ7Emi0HuMUs="
        }
      }
    }
  }
};
