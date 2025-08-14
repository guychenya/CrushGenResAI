import React, { useState } from 'react';

const CompetitorAnalysis = ({ resume }) => {
    const [jobDescription, setJobDescription] = useState('');
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleAnalysis = async () => {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/ai/competitor-analysis', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ resume, jobDescription }),
        });
        const data = await response.json();
        setAnalysis(data.analysis);
        setLoading(false);
    };

    return (
        <div className="p-4 mt-8 border-t">
            <h2 className="text-xl font-bold">Competitor Analysis</h2>
            <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">Job Description or Role Title</label>
                <input
                    type="text"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    className="block w-full mt-1 border-gray-300 rounded-md shadow-sm"
                />
            </div>
            <button
                onClick={handleAnalysis}
                className="px-4 py-2 mt-4 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700"
                disabled={loading}
            >
                {loading ? 'Analyzing...' : 'Analyze Against Competitors'}
            </button>
            {analysis && (
                <div className="p-4 mt-4 bg-gray-100 rounded-md">
                    <h3 className="font-bold">Competitor Analysis Results:</h3>
                    <pre className="mt-2 whitespace-pre-wrap">{analysis}</pre>
                </div>
            )}
        </div>
    );
};

export default CompetitorAnalysis;
