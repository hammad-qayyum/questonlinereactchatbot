import React from 'react'
import ReactMarkdown from 'react-markdown';

export default function MessageItem(props) {
  return (
    <div className= {props.type === "assistant-message"? " assistant-message w-75 p-3 border rounded-4 mt-3 bg-light": props.type === "user-message"? "user-message w-75 p-3 border rounded-4 mt-2 bg-dark text-light ms-auto":""}>
          {props.type === "assistant-message"?  <ReactMarkdown>{props.message}</ReactMarkdown>: <p>{props.message}</p>}
    </div>
  )
}

