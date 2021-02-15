import { has, get, forEach } from 'lodash';

class ActionProvider {
  constructor(createChatBotMessage, setStateFunc, createClientMessage) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;
    this.createClientMessage = createClientMessage;
  }

  getActionType(cardSuggestions) {
    if (has(cardSuggestions[0], 'paymentAction')) {
      return 'paymentAction';
    }
    if (has(cardSuggestions[0], 'authenticateAction')) {
      return 'authenticateAction';
    }
    return '';
  }

  set componentData(data) {
    this.data = Object.assign({}, data);
  }

  get componentData() {
    return this.data;
  }

  getMessageType(RCSMessage) {
    const cardSuggestions =
      RCSMessage.richcardMessage.message.generalPurposeCard.suggestions;
    if (has(RCSMessage, 'textMessage')) {
      return 'text';
    }
    if (
      get(
        RCSMessage,
        'richcardMessage.message.generalPurposeCard.content.media.mediaType',
      ) === 'image'
    ) {
      return 'image';
    }
    if (
      get(
        RCSMessage,
        'richcardMessage.message.generalPurposeCard.content.media.mediaType',
      ) === 'video'
    ) {
      return 'video';
    }
    if (has(RCSMessage, 'richcardMessage.message.generalPurposeCard.layout')) {
      return 'listPicker';
    }
    if (has(RCSMessage, 'richcardMessage.message.generalPurposeCardCarousel')) {
      return 'carousel';
    }
    if (has(RCSMessage, 'richcardMessage.eventTimepicker')) {
      return 'timePicker';
    }
    if (cardSuggestions) {
      return this.getActionType(cardSuggestions); // paymentAction or authenticateAction
    }

    return null;
  }

  showMessage(RCSMessage) {
    const messageType = this.getMessageType(RCSMessage);
    if (messageType === 'text') {
      this.actionProvider.showTextMessage(RCSMessage);
    } else if (messageType === 'image') {
      this.actionProvider.showImageMessage(RCSMessage);
    } else if (messageType === 'video') {
      this.actionProvider.showVideoMessage(RCSMessage);
    } else if (messageType === 'listPicker') {
      this.actionProvider.showListPickerMessage(RCSMessage);
    } else if (messageType === 'carousel') {
      this.actionProvider.showCarouselMessage(RCSMessage);
    } else if (messageType === 'timePicker') {
      this.actionProvider.showTimePickerMessage(RCSMessage);
    } else if (messageType === 'paymentAction') {
      this.actionProvider.showPaymentActionMessage(RCSMessage);
    } else if (messageType === 'authenticateAction') {
      this.actionProvider.showAuthenticateActionMessage(RCSMessage);
    }
  }

  showTextMessage(RCSMessage) {
    const message = this.createChatBotMessage(RCSMessage.textMessage);
    this.updateChatbotState(message);
  }

  showImageMessage = msg => { // change msg -> RCSMEessage once server ready
    const componentData = {};
    // Passing ONLY necessary data to component
    const { RCSMessage } = msg; // REEMOVE ONCE SEREVER READY
    if(msg){
      componentData.mediaUrl = get(
        RCSMessage,
        'richcardMessage.message.generalPurposeCard.content.media.mediaUrl',
      );
      componentData.urlAction = get(
        RCSMessage,
        'richcardMessage.message.generalPurposeCard.suggestions[0].urlAction',
      );
    }
    this.updateComponentData(componentData);
    const message = this.createChatBotMessage('', { widget: 'SimpleImage' });
    this.updateChatbotState(message);
  };

  showVideoMessage = msg => {
    const componentData = {};
    const { RCSMessage } = msg;
    if(msg){
      componentData.mediaUrl = get(
        RCSMessage,
        'richcardMessage.message.generalPurposeCard.content.media.mediaUrl',
      );
      componentData.mediaContentType = get(
        RCSMessage,
        'richcardMessage.message.generalPurposeCard.content.media.mediaContentType',
      );
      componentData.urlAction = get(
        RCSMessage,
        'richcardMessage.message.generalPurposeCard.suggestions[0].urlAction',
      );
    }
    this.updateComponentData(componentData);
    const message = this.createChatBotMessage('', { widget: 'SimpleVideo' }); // check if message can be null
    this.updateChatbotState(message);
  };

  showSingleMessageBot(msg, options, callback) {
    const message = this.createChatBotMessage(msg, options);
    this.updateChatbotState(message);
    callback(message);
  }

  showWidgetMessageBot(msg, options, callback) {
    const message = this.createChatBotMessage(msg, options);
    this.updateChatbotState(message);
    callback(message);
  }

  showSingleMessageClient(msg, callback) {
    const message = this.createClientMessage(`${msg}`);
    this.updateChatbotState(message);
    callback(message);
  }

  updateComponentData(componentData) {
    this.setState(prevState => ({ ...prevState, componentData }));
  }

  updateChatbotState(message) {
    // NOTICE: This function is set in the constructor, and is passed in from the top level Chatbot component. The setState function here actually manipulates the top level state of the Chatbot, so it's important that we make sure that we preserve the previous state.
    this.setState(prevState => ({
      ...prevState,
      messages: [...prevState.messages, message],
    }));
  }
}

export default ActionProvider;
