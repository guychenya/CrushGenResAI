import React, { useState, useEffect, useRef } from 'react';

const Comments = ({ resumeId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const ws = useRef(null);

    useEffect(() => {
        ws.current = new WebSocket('ws://localhost:5000');

        ws.current.onopen = () => {
            console.log('WebSocket connected');
        };

        ws.current.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.type === 'comment' && message.resumeId === resumeId) {
                setComments((prevComments) => [...prevComments, message.comment]);
            }
        };

        ws.current.onclose = () => {
            console.log('WebSocket disconnected');
        };

        return () => {
            ws.current.close();
        };
    }, [resumeId]);

    const handleAddComment = () => {
        if (newComment.trim() === '') return;
        const comment = {
            resumeId,
            text: newComment,
            author: 'Anonymous', // In a real app, you'd get this from the user session
            timestamp: new Date().toISOString(),
        };
        ws.current.send(JSON.stringify({ type: 'comment', comment }));
        setComments((prevComments) => [...prevComments, comment]);
        setNewComment('');
    };

    return (
        <div className="p-4 mt-4 border-t">
            <h3 className="font-bold">Comments</h3>
            <div className="mt-2">
                {comments.map((comment, index) => (
                    <div key={index} className="p-2 mb-2 bg-gray-100 rounded-md">
                        <p className="text-sm">{comment.text}</p>
                        <p className="text-xs text-gray-500">
                            By {comment.author} at {new Date(comment.timestamp).toLocaleString()}
                        </p>
                    </div>
                ))}
            </div>
            <div className="flex mt-2">
                <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="flex-grow p-2 border rounded-l-md"
                    placeholder="Add a comment..."
                />
                <button
                    onClick={handleAddComment}
                    className="px-4 py-2 font-bold text-white bg-blue-600 rounded-r-md hover:bg-blue-700"
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default Comments;
