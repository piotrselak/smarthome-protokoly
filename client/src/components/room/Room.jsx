import useWebSocket from 'react-use-websocket';

export default function Room() {
    const room = localStorage.getItem("room")

    useWebSocket("ws://localhost:11111", {
        onOpen: () => {
            console.log('WebSocket connection established.');
        }
    });


    return <div>
        {room}
    </div>
}