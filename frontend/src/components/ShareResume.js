import React, { useState, useEffect } from 'react';
import { useSession } from '../context/SessionContext';

const ShareResume = ({ resume }) => {
    const { session, setSession } = useSession();
    const [email, setEmail] = useState('');
    const [permissions, setPermissions] = useState('view');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const getSession = async () => {
          // A better way would be to get session from a global context
          // For now, we'll assume a token is stored in localStorage
          const token = localStorage.getItem('authToken');
          if (token) {
            setSession({ access_token: token });
          }
        };
        getSession();
    }, [setSession]);

    const handleShare = async () => {
        if (!resume || !email) {
            setMessage('Please select a resume and enter an email address.');
            return;
        }

        if (!session) {
            setMessage('You must be logged in to share a resume.');
            return;
        }

        const response = await fetch(`http://localhost:5000/api/share/${resume.id}/share`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({ email, permissions }),
        });

        const data = await response.json();

        if (response.ok) {
            setMessage('Resume shared successfully!');
            setEmail('');
        } else {
            setMessage(`Error: ${data.message}`);
        }
    };

    return (
        <div className="p-4 mt-4 border-t">
            <h3 className="font-bold">Share This Resume</h3>
            <div className="flex items-center mt-2">
                <input
                    type="email"
                    placeholder="Enter email to share with"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-grow p-2 border rounded-l-md"
                />
                <select
                    value={permissions}
                    onChange={(e) => setPermissions(e.target.value)}
                    className="p-2 border-t border-b"
                >
                    <option value="view">Can View</option>
                    <option value="edit">Can Edit</option>
                </select>
                <button
                    onClick={handleShare}
                    className="px-4 py-2 font-bold text-white bg-blue-600 rounded-r-md hover:bg-blue-700"
                >
                    Share
                </button>
            </div>
            {message && <p className="mt-2 text-sm text-gray-600">{message}</p>}
        </div>
    );
};

export default ShareResume;
