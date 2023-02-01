import {useCallback, useEffect, useState} from "react";
import useWebSocket, {ReadyState} from "react-use-websocket";


export default function Chat() {
    const [chat, setChat] = useState([]);
    const [input, setInput] = useState("")
    const name = localStorage.getItem("name")

    const { sendMessage, lastMessage, readyState } = useWebSocket("ws://localhost:11112", {
        onOpen: () => {
            console.log('WebSocket connection established.');
        }
    });

    const connectionStatus = {
        [ReadyState.CONNECTING]: 'Connecting',
        [ReadyState.OPEN]: 'Open',
        [ReadyState.CLOSING]: 'Closing',
        [ReadyState.CLOSED]: 'Closed',
        [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
    }[readyState];

    const handleClickSendMessage = () => {
        sendMessage(`{"name": "${name}", "text": "${input}"}`)
        setTimeout(() => setInput(""), 50)
    }

    useEffect(() => {
        if (lastMessage !== null && lastMessage.data.type !== '') {
            setChat([...chat, JSON.parse(lastMessage.data)]);
        }
    }, [lastMessage]);


    return <div>
        <div>
            {chat.map((el, ind) => {
                return <div key={ind}>
                    <h2>{el.name}</h2>
                    <span>{el.text}</span>
                </div>
            })}
        </div>
        <br/><br/>
        <input value={input} onChange={(e) => setInput(e.target.value)}/>
        <button onClick={handleClickSendMessage}>Send</button>
    </div>
}