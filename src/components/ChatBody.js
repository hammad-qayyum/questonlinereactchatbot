import React, { useEffect, useRef } from 'react';
import MessageItem from './MessageItem';
import './ChatBody.css';

export default function ChatBody(props) {
  const chatBodyRef = useRef(null);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [props.chat]); // Runs when `props.chat` changes

  return (
    <div
      className='chatbody overflow-auto w-100'
      ref={chatBodyRef}
      style={{ height: '80vh' }} // Set height to enable scrolling
    >
      {props.chat.map((msg, index) => (
        <React.Fragment key={index}>
          {msg["user_message"]!=="" ?  <MessageItem type="user-message" message={msg["user_message"]} />:<div></div>}
          {msg["assistant_message"]!=="" ?  <MessageItem type="assistant-message" message={msg["assistant_message"]} />:<div></div>}
        </React.Fragment>
      ))}
    </div>
  );
}
