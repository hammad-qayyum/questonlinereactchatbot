import React from 'react';
import MessageItem from './MessageItem';
import './ChatBody.css';

export default function ChatBody(props) {

  return (
    <div
      className='chatbody w-100'
     
      style={{ height: '80vh' }} // Set height to enable scrolling
    >
      {props.chat.map((msg, index) => (
        <React.Fragment key={index}>
          {msg["user_message"]!=="" ?  <MessageItem type="user-message" message={msg["user_message"]} />:<div></div>}
          {msg["assistant_message"]!=="" ?  <MessageItem type="assistant-message" message={msg["assistant_message"]} />:<div></div>}
        </React.Fragment>
      ))}
       <div style={{ height: '70px' }}></div>
    </div>
  );
}
