import React from 'react';

class MessageElement extends React.Component {
    render() {
        return React.createElement('p', null, this.props.message.content);
    }
}

class MessageBox extends React.Component {
    render() {
        return React.createElement('div', null, this.props.messages.map(val => React.createElement(MessageElement, {message: val})));
    }
}

export default MessageBox;
