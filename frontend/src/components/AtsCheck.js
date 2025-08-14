import React, { useState } from 'react';

const AtsCheck = ({ resume }) => {
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleAnalysis = async () => {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/ai/ats-check', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ resume }),
        });
        const data = await response.json();
        setAnalysis(data.analysis);
        setLoading(false);
    };

    return (
        <div className="p-4 mt-8 border-t">
            <h2 className="text-xl font-bold">ATS Compatibility Check</h2>
            <button
                onClick={handleAnalysis}
                className="px-4 py-2 mt-4 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700"
                disabled={loading}
            >
                {loading ? 'Analyzing...' : 'Run ATS Check'}
            </button>
            {analysis && (
                <div className="p-4 mt-4 bg-gray-100 rounded-md">
                    <h3 className="font-bold">ATS Check Results:</h3>
                    <pre className="mt-2 whitespace-pre-wrap">{analysis}</pre>
                </div>
            )}
        </div>
    );
};

export default AtsCheck;
