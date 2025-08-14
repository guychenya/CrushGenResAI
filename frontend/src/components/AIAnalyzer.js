import React, { useState } from 'react';

const AIAnalyzer = ({ resume }) => {
  const [jobDescription, setJobDescription] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    const response = await fetch('http://localhost:5000/api/ai/analyze', {
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
      <h2 className="text-xl font-bold">AI Resume Analysis</h2>
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">Job Description</label>
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          className="block w-full mt-1 border-gray-300 rounded-md shadow-sm"
          rows="10"
        />
      </div>
      <button
        onClick={handleAnalyze}
        className="px-4 py-2 mt-4 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? 'Analyzing...' : 'Analyze'}
      </button>
      {analysis && (
        <div className="p-4 mt-4 bg-gray-100 rounded-md">
          <h3 className="font-bold">Analysis Results:</h3>
          <pre className="mt-2 whitespace-pre-wrap">{analysis}</pre>
        </div>
      )}
    </div>
  );
};

export default AIAnalyzer;
