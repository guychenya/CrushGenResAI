import React, { useState, useEffect, useCallback } from 'react';
import { auth } from '../firebase';
import ResumeBuilder from './ResumeBuilder';
import JobTracker from './JobTracker';
import { useSession } from '../context/SessionContext';

const Dashboard = () => {
  const { session } = useSession();
  const user = session?.user;
  const [resumes, setResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState(null);
  const [sharedResumes, setSharedResumes] = useState([]);
  const [view, setView] = useState('resumes'); // 'resumes' or 'jobs'

  const getResumes = useCallback(async () => {
    if (!user) return;
    try {
      const token = await user.getIdToken();
      const response = await fetch('/api/resumes', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setResumes(data);
      }
    } catch (error) {
      console.error('Error fetching resumes:', error);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      const getSharedResumes = async () => {
        if (!user) return;
        try {
          const token = await user.getIdToken();
          const response = await fetch('/api/share/shared-with-me', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            setSharedResumes(data);
          }
        } catch (error) {
          console.error('Error fetching shared resumes:', error);
        }
      };

      getResumes();
      getSharedResumes();
    }
  }, [user, getResumes]);

  const handleLogout = async () => {
    await auth.signOut();
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center">
          <button
            onClick={() => setView('resumes')}
            className={`px-4 py-2 mr-2 font-bold rounded-md ${view === 'resumes' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Resumes
          </button>
          <button
            onClick={() => setView('jobs')}
            className={`px-4 py-2 font-bold rounded-md ${view === 'jobs' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Jobs
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 ml-4 font-bold text-white bg-red-600 rounded-md hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>
      <p>Welcome to your GenResAI dashboard!</p>
      {user && (
        <div className="mt-4">
          <p>
            <strong>Email:</strong> {user.email}
          </p>
        </div>
      )}

      {view === 'resumes' && (
        <>
          <div className="mt-8">
            <h2 className="text-xl font-bold">Your Resumes</h2>
            <ul>
              {resumes.map((resume) => (
                <li
                  key={resume.id}
                  onClick={() => setSelectedResume(resume)}
                  className="cursor-pointer hover:underline"
                >
                  {resume.title}
                </li>
              ))}
            </ul>
            <button
              onClick={() => setSelectedResume(null)}
              className="px-2 py-1 mt-2 text-white bg-blue-500 rounded-md"
            >
              New Resume
            </button>
          </div>
          <div className="mt-8">
            <h2 className="text-xl font-bold">Shared With You</h2>
            <ul>
              {sharedResumes.map((shared) => (
                <li
                  key={shared.resumes.id}
                  onClick={() => setSelectedResume(shared.resumes)}
                  className="cursor-pointer hover:underline"
                >
                  {shared.resumes.title} (shared by {shared.resumes.profiles.full_name})
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-8">
            <ResumeBuilder resume={selectedResume} onSave={getResumes} />
          </div>
        </>
      )}

      {view === 'jobs' && <JobTracker />}
    </div>
  );
};

export default Dashboard;
