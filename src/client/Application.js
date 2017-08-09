import React from 'react';
import MessageStore from './MessageStore';
import MessageBox from './MessageBox';
import Container from 'samsio/Container';

class Application extends React.Component {
    render() {
        return React.createElement(Container, {store: MessageStore}, React.createElement(MessageBox));
    }
}

export default Application;
