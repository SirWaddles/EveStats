import Store from 'samsio/Store';

class MessageStore extends Store {
    addMessage(message) {
        this.updateState({
            messages: this.getState().messages.concat([message]),
        });
    }
}

const MessageStoreImpl = new MessageStore();
MessageStoreImpl.updateState({
    messages: [],
});

export default MessageStoreImpl;
