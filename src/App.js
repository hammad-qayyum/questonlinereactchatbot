  import { useState , useEffect, useRef} from 'react';
  // import mammoth from 'mammoth';
  import './App.css';
  import Navbar from './components/Navbar';
  import ChatBody from './components/ChatBody';
  // import { v4 as uuidv4 } from 'uuid';
  import axios from 'axios';
  import {CHATBOT_BASE_URL, ENDPOINTS} from "../src/config/apiConfig"
  import { Buffer } from 'buffer';
  // import AWS from "aws-sdk";


  // Ensure the global Buffer object is set
  window.Buffer = Buffer;
  


  function App() {
    
    const [threadId, setThreadId] = useState('');
    const [messages, setMessages] = useState([]);
    // const [chatHistory, setChatHistory] = useState([]);
    const [newUserMessage, setNewUserMessage] = useState('');
    // const [selectedFile, setSelectedFile] = useState(null);
    // const [selectedFilePath, setSelectedFilePath] = useState("");
    // const allowedExtensions = ['doc', 'docx', 'docs', 'odt']; // Only allow Word files

    useEffect(() => {
      setThreadId("");
      // const id = uuidv4();
      // setSessionId(id);
    }, []);
    const chatBodyRef = useRef(null);

    useEffect(() => {
      if (chatBodyRef.current) {
        chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
      }
    }, [messages]);
    const handleClearMessages = async () => {
      setMessages([]);
      setThreadId("");

      try {
        // console.log(body);
        const body = {
          thread_id: threadId
        };
        const response = await axios.post(`${CHATBOT_BASE_URL}${ENDPOINTS.DELETE_THREAD}`, body);
        console.log(response);
        
      }
      catch (error) {
        console.error("Error fetching chat response:", error);
      } 

    };

    
  

    useEffect(() => {
      const handleBeforeUnload = async (event) => {
        try {
          handleClearMessages();
          
        } catch (error) {
          console.error('Error ending session:', error);
        }

        // const confirmationMessage = 'Are you sure you want to leave? Your session will end.';
        // event.returnValue = confirmationMessage; // Standard way to show a confirmation dialog
        // return confirmationMessage; // Some browsers require this
      };

      window.addEventListener('beforeunload', handleBeforeUnload);

      // Cleanup event listener on component unmount
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }, [handleClearMessages]);

    // const uploadFileToS3 = async () => {
    //   return new Promise((resolve, reject) => {
    //     const S3_BUCKET = "chatbot-questonline";
    
    //     // S3 Region
    //     const REGION = "us-east-1";
    
    //     // S3 Credentials
    //     AWS.config.update({
    //       accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    //       secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    //     });
    //     const s3 = new AWS.S3({
    //       params: { Bucket: S3_BUCKET },
    //       region: REGION,
    //     });
    
    //     // Files Parameters
    //     const params = {
    //       Bucket: S3_BUCKET,
    //       Key: sessionId + "-" + selectedFile.name,
    //       Body: selectedFile,
    //     };
    
    //     // Uploading file to s3
    //     s3.putObject(params)
    //       .on("httpUploadProgress", (evt) => {
    //         // File uploading progress
    //         console.log("Uploading " + parseInt((evt.loaded * 100) / evt.total) + "%");
    //       })
    //       .send((err, data) => {
    //         if (err) {
    //           console.log(err); // Handle the error
    //           reject(err);
    //         } else {
    //           const filePath = "https://chatbot-questonline.s3.amazonaws.com/" + sessionId + "-" + selectedFile.name;
    //           setSelectedFilePath(filePath);
    //           console.log("File uploaded successfully.");
    //           resolve(filePath);
    //         }
    //       });
    //   });
    // };
    
    
    const handleUserMessageChange = (e) => setNewUserMessage(e.target.value);

    const handleSend = async () => {
      if (newUserMessage) {
        // const body = {
        //   chat_history: chatHistory,
        //   user_message: newUserMessage,
        //   session_id: sessionId
        // };
        const body = {
          query : newUserMessage,
          thread_id: threadId
        };
        console.log(body);
        setMessages(prevMessages => [
                ...prevMessages,
                { user_message: newUserMessage, assistant_message: "Typing..." }
              ]);
        
        setNewUserMessage('');

        // if(!selectedFile){
          // setChatHistory(prevMessages => [
          //   ...prevMessages,
          //   { user_message: newUserMessage, assistant_message: "Typing..." }
          // ]);
          try {
            // console.log(body);
            const response = await axios.post(`${CHATBOT_BASE_URL}${ENDPOINTS.GET_CHAT}`, body);
            const assistantMessage = response.data.message;
            console.log(assistantMessage);
            if(response.data.thread_id){
              console.log(response.data.thread_id);
              setThreadId(response.data.thread_id);
            }
    
            setMessages(prevMessages => {
              const updatedMessagesWithResponse = [...prevMessages];
              updatedMessagesWithResponse[updatedMessagesWithResponse.length - 1].assistant_message = assistantMessage;
              return updatedMessagesWithResponse;
            });
            // setChatHistory(prevMessages => {
            //   const updatedMessagesWithResponse = [...prevMessages];
            //   updatedMessagesWithResponse[updatedMessagesWithResponse.length - 1].assistant_message = assistantMessage;
            //   return updatedMessagesWithResponse;
            // });
            
          }
          catch (error) {
            console.error("Error fetching chat response:", error);
          } 
        // }

        // if (selectedFile) {
        // //  await uploadFileToS3();
        // const filePath = await uploadFileToS3();
        // const fileBody ={
        //   url: filePath,
        //   session_id: sessionId
        // };

        //   try {
        //     const response = await axios.post(`${CHATBOT_BASE_URL}${ENDPOINTS.UPLOAD_FILE}`, fileBody);
        //     // const response = await axios.get(`http://98.80.78.119:3201/health`);
        //     // console.log(response.data);
        //     const assistantMessage = response.data.message;
        //     alert("File uploaded succesfully");
        //     console.log(response.data.message)
    
        //     // setMessages(prevMessages => {
        //     //   const updatedMessagesWithResponse = [...prevMessages];
        //     //   updatedMessagesWithResponse[updatedMessagesWithResponse.length - 1].assistant_message = assistantMessage;
        //     //   return updatedMessagesWithResponse;
        //     // });
        //   }
        //   catch (error) {
        //     console.error("Error fetching chat response:", error);
        //   } 
        //   handleFileClear();
        // }
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault(); // Prevent form submission if inside a form
        handleSend();
      }
    };

    // const handleFileChange = async (event) => {
    //   const file = event.target.files[0];
    //   if (file) {
    //     const extension = file.name.split('.').pop().toLowerCase();

    //     if (allowedExtensions.includes(extension)) {
    //       const fileSizeLimit = 10000000; // Default file size limit
          
    //       const reader = new FileReader();

    //         if (file.size > fileSizeLimit) {
    //           alert(`File size exceeds the maximum limit of ${fileSizeLimit / 1000}KB.`);
    //           setSelectedFile(null);
    //           document.getElementById('fileInput').value = null;
    //           return;
    //         }
    //         setSelectedFile(file);
    //         setNewUserMessage("File: " + file.name);
    //       // };
    //       reader.readAsArrayBuffer(file);
    //     } else {
    //       alert('Invalid file type. Only Word files are allowed.');
    //       setSelectedFile(null);
    //       document.getElementById('fileInput').value = null;
    //     }
    //   }
    // };

    // const handleFileClick = () => {
    //   document.getElementById('fileInput').click();
    // };

    // const handleFileClear = () => {
    //   setSelectedFile(null);
    //   setNewUserMessage("");
    //   document.getElementById('fileInput').value = null;
    // };

  
    return (
      <div className="chat-body" ref={chatBodyRef}>
        <Navbar/>
        <div className='container chat-container px-3'  >
          <ChatBody chat={messages} />
          <div className=" container fixed-bottom input-group chat-input mb-3 my-3">
            <button className="btn btn-warning" type="button" onClick={handleClearMessages}>Clear</button>
            <input type="text" className="form-control" value={newUserMessage} onChange={handleUserMessageChange} placeholder="Enter here" onKeyDown={handleKeyDown} />
            {/* <input type="file" id="fileInput" style={{ display: 'none' }} onChange={handleFileChange} /> */}
            {/* {!selectedFile ? <button className="btn btn-success" type="button" onClick={handleFileClick}>+</button> : <button className="btn btn-danger" type="button" onClick={handleFileClear}>-</button>} */}
            <button className="btn btn-dark" type="button" onClick={ handleSend}>Send</button>
          </div>
        </div>
      </div>
    );
  }

  export default App;
