import useWebSocket, {ReadyState} from 'react-use-websocket';
import {useCallback, useEffect, useState} from "react";

//add ability to control temperature
export default function Room() {
    const room = localStorage.getItem("room")
    const [message, setMessage] = useState();

    const { sendMessage, lastMessage, readyState } = useWebSocket("ws://localhost:11111", {
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

    useEffect(() => {
        if (lastMessage === null)
            handleClickSendMessage()
        if (lastMessage !== null && lastMessage.data.type !== '') {
            setMessage(JSON.parse(lastMessage.data));
        }
    }, [lastMessage, setMessage]);

    const handleClickSendMessage = useCallback(() => sendMessage(room), []);

    return (
        <div>
            <span>The WebSocket is currently {connectionStatus}</span><br/>

            {message && <span>Temperature: {message.Temperature}</span>}
            <button onClick={() => {
                sendMessage(`{"Room": "${room}", "Component": "Set-temperature", "Value": ${message.Temperature + 1}}`)
            }
            }>Turn up</button>
            <button onClick={() => {
                sendMessage(`{"Room": "${room}", "Component": "Set-temperature", "Value": ${message.Temperature - 1}}`)
            }
            }>Turn down</button>
        </div>
    );
}
