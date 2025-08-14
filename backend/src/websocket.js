const WebSocket = require('ws');

function setupWebSocket(server) {
    const wss = new WebSocket.Server({ server });

    wss.on('connection', (ws) => {
        console.log('Client connected');
        ws.resumeId = null; // Initialize resumeId

        ws.on('message', (message) => {
            try {
                const parsedMessage = JSON.parse(message);
                console.log('Received parsed message:', parsedMessage);

                if (parsedMessage.type === 'subscribe') {
                    ws.resumeId = parsedMessage.resumeId;
                    console.log(`Client subscribed to resume: ${ws.resumeId}`);
                } else {
                    // Broadcast the message to all clients in the same "room" (resume)
                    wss.clients.forEach((client) => {
                        if (client !== ws && client.readyState === WebSocket.OPEN && client.resumeId === parsedMessage.resumeId) {
                            client.send(JSON.stringify(parsedMessage));
                        }
                    });
                }
            } catch (error) {
                console.error('Failed to parse message or broadcast:', error);
            }
        });

        ws.on('close', () => {
            console.log('Client disconnected');
        });
    });

    return wss;
}

module.exports = setupWebSocket;
