import React, { useState, useEffect } from 'react';

const JobTracker = () => {
  const [jobs, setJobs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newJob, setNewJob] = useState({ title: '', company: '', location: '', url: '' });
  const [session, setSession] = useState(null);

  useEffect(() => {
    const getSession = async () => {
      // Re-implement or get session from a global context
    };
    getSession();
  }, []);

  useEffect(() => {
    if (session) {
      getJobs();
    }
  }, [session]);

  const getJobs = async () => {
    try {
      const response = await fetch('/api/jobs');
      if (response.ok) {
        const data = await response.json();
        setJobs(data);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const handleAddJob = async (e) => {
    e.preventDefault();
    if (!session) {
      alert('You must be logged in to add a job.');
      return;
    }

    try {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(newJob),
      });

      if (response.ok) {
        const data = await response.json();
        setJobs([data, ...jobs]);
        setNewJob({ title: '', company: '', location: '', url: '' });
        setShowForm(false);
      } else {
        const errorData = await response.json();
        console.error('Error adding job:', errorData);
        alert(`Failed to add job: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error adding job:', error);
      alert('Failed to add job.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewJob({ ...newJob, [name]: value });
  };

  return (
    <div className="p-4 mt-8 border-t">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Job Tracker</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 font-bold text-white bg-green-600 rounded-md hover:bg-green-700"
        >
          {showForm ? 'Cancel' : 'Add Job'}
        </button>
      </div>
      {showForm && (
        <form onSubmit={handleAddJob} className="p-4 mb-4 bg-gray-100 rounded-md">
          <input
            type="text"
            name="title"
            placeholder="Job Title"
            value={newJob.title}
            onChange={handleInputChange}
            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm"
            required
          />
          <input
            type="text"
            name="company"
            placeholder="Company"
            value={newJob.company}
            onChange={handleInputChange}
            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm"
            required
          />
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={newJob.location}
            onChange={handleInputChange}
            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm"
          />
          <input
            type="url"
            name="url"
            placeholder="Job Post URL"
            value={newJob.url}
            onChange={handleInputChange}
            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm"
          />
          <button
            type="submit"
            className="w-full px-4 py-2 mt-4 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Save Job
          </button>
        </form>
      )}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {jobs.map((job) => (
          <div key={job.id} className="p-4 bg-white rounded-lg shadow-md">
            <h3 className="text-lg font-bold">{job.title}</h3>
            <p className="text-gray-600">{job.company}</p>
            <p className="text-sm text-gray-500">{job.location}</p>
            <a
              href={job.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              View Job Post
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobTracker;
