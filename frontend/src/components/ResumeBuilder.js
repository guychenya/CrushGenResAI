import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import AIAnalyzer from './AIAnalyzer';
import ShareResume from './ShareResume';
import Comments from './Comments';
import CompetitorAnalysis from './CompetitorAnalysis';
import AtsCheck from './AtsCheck';
import ExportResume from './ExportResume';

const ResumeBuilder = ({ resume: initialResume, onSave }) => {
  const [resume, setResume] = useState({
    title: 'My Resume',
    contact: { name: '', email: '', phone: '' },
    summary: '',
    experience: [{ company: '', role: '', description: '' }],
    education: [{ school: '', degree: '', field: '' }],
    skills: [''],
  });
  const [session, setSession] = useState(null);
  const ws = useRef(null);

  useEffect(() => {
    if (!initialResume || !initialResume.id) return;

    ws.current = new WebSocket(`ws://localhost:5000`);

    ws.current.onopen = () => {
        console.log('WebSocket connected');
        ws.current.send(JSON.stringify({ type: 'subscribe', resumeId: initialResume.id }));
    };

    ws.current.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.type === 'resume_update') {
            setResume(message.resume);
        }
    };

    ws.current.onclose = () => {
        console.log('WebSocket disconnected');
    };

    return () => {
        ws.current.close();
    };
  }, [initialResume]);
  
  useEffect(() => {
    if (initialResume) {
      setResume({ ...initialResume.content, title: initialResume.title, id: initialResume.id });
    } else {
      setResume({
        title: 'My Resume',
        contact: { name: '', email: '', phone: '' },
        summary: '',
        experience: [{ company: '', role: '', description: '' }],
        education: [{ school: '', degree: '', field: '' }],
        skills: [''],
      });
    }
  }, [initialResume]);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);


  const handleSave = async () => {
    if (!session) {
      alert('You must be logged in to save a resume.');
      return;
    }

    const { title, id, ...content } = resume;
    let response;
    if (id) {
      response = await supabase
        .from('resumes')
        .update({ title, content, updated_at: new Date() })
        .eq('id', id)
        .eq('user_id', session.user.id)
        .select();
    } else {
      response = await supabase
        .from('resumes')
        .insert([{ title, content, user_id: session.user.id }])
        .select();
    }

    const { error } = response;

    if (error) {
      console.error('Error saving resume:', error);
      alert('Failed to save resume.');
    } else {
      alert('Resume saved successfully!');
      if (onSave) {
        onSave();
      }
    }
  };

  const handleChange = (e, section, index, field) => {
    const newResume = { ...resume };
    if (index !== undefined) {
      newResume[section][index][field] = e.target.value;
    } else if (section) {
      newResume[section][field] = e.target.value;
    } else {
      newResume[e.target.name] = e.target.value;
    }
    setResume(newResume);

    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify({ type: 'resume_update', resume: newResume, resumeId: initialResume.id }));
    }
  };

  const handleAddField = (section) => {
    const newResume = { ...resume };
    if (section === 'skills') {
      newResume.skills.push('');
    } else {
      newResume[section].push({});
    }
    setResume(newResume);
  };

  const handleRemoveField = (section, index) => {
    const newResume = { ...resume };
    newResume[section].splice(index, 1);
    setResume(newResume);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Resume Builder</h1>
        <button
          onClick={handleSave}
          className="px-4 py-2 font-bold text-white bg-green-600 rounded-md hover:bg-green-700"
        >
          Save
        </button>
      </div>
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          name="title"
          value={resume.title}
          onChange={(e) => handleChange(e)}
          className="block w-full mt-1 border-gray-300 rounded-md shadow-sm"
        />
      </div>

      <div className="mt-4">
        <h2 className="text-lg font-bold">Contact</h2>
        <input
          type="text"
          placeholder="Name"
          value={resume.contact.name}
          onChange={(e) => handleChange(e, 'contact', undefined, 'name')}
          className="block w-full mt-1 border-gray-300 rounded-md shadow-sm"
        />
        <input
          type="email"
          placeholder="Email"
          value={resume.contact.email}
          onChange={(e) => handleChange(e, 'contact', undefined, 'email')}
          className="block w-full mt-1 border-gray-300 rounded-md shadow-sm"
        />
        <input
          type="tel"
          placeholder="Phone"
          value={resume.contact.phone}
          onChange={(e) => handleChange(e, 'contact', undefined, 'phone')}
          className="block w-full mt-1 border-gray-300 rounded-md shadow-sm"
        />
      </div>

      <div className="mt-4">
        <h2 className="text-lg font-bold">Summary</h2>
        <textarea
          value={resume.summary}
          onChange={(e) => handleChange(e, 'summary', undefined, 'summary')}
          className="block w-full mt-1 border-gray-300 rounded-md shadow-sm"
        />
      </div>

      <div className="mt-4">
        <h2 className="text-lg font-bold">Experience</h2>
        {resume.experience.map((exp, index) => (
          <div key={index} className="p-2 mt-2 border border-gray-200 rounded-md">
            <input
              type="text"
              placeholder="Company"
              value={exp.company}
              onChange={(e) => handleChange(e, 'experience', index, 'company')}
              className="block w-full mt-1 border-gray-300 rounded-md shadow-sm"
            />
            <input
              type="text"
              placeholder="Role"
              value={exp.role}
              onChange={(e) => handleChange(e, 'experience', index, 'role')}
              className="block w-full mt-1 border-gray-300 rounded-md shadow-sm"
            />
            <textarea
              placeholder="Description"
              value={exp.description}
              onChange={(e) => handleChange(e, 'experience', index, 'description')}
              className="block w-full mt-1 border-gray-300 rounded-md shadow-sm"
            />
            <button
              onClick={() => handleRemoveField('experience', index)}
              className="px-2 py-1 mt-2 text-white bg-red-500 rounded-md"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          onClick={() => handleAddField('experience')}
          className="px-2 py-1 mt-2 text-white bg-blue-500 rounded-md"
        >
          Add Experience
        </button>
      </div>

      <div className="mt-4">
        <h2 className="text-lg font-bold">Education</h2>
        {resume.education.map((edu, index) => (
          <div key={index} className="p-2 mt-2 border border-gray-200 rounded-md">
            <input
              type="text"
              placeholder="School"
              value={edu.school}
              onChange={(e) => handleChange(e, 'education', index, 'school')}
              className="block w-full mt-1 border-gray-300 rounded-md shadow-sm"
            />
            <input
              type="text"
              placeholder="Degree"
              value={edu.degree}
              onChange={(e) => handleChange(e, 'education', index, 'degree')}
              className="block w-full mt-1 border-gray-300 rounded-md shadow-sm"
            />
            <input
              type="text"
              placeholder="Field of Study"
              value={edu.field}
              onChange={(e) => handleChange(e, 'education', index, 'field')}
              className="block w-full mt-1 border-gray-300 rounded-md shadow-sm"
            />
            <button
              onClick={() => handleRemoveField('education', index)}
              className="px-2 py-1 mt-2 text-white bg-red-500 rounded-md"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          onClick={() => handleAddField('education')}
          className="px-2 py-1 mt-2 text-white bg-blue-500 rounded-md"
        >
          Add Education
        </button>
      </div>

      <div className="mt-4">
        <h2 className="text-lg font-bold">Skills</h2>
        {resume.skills.map((skill, index) => (
          <div key={index} className="flex items-center mt-2">
            <input
              type="text"
              value={skill}
              onChange={(e) => {
                const newSkills = [...resume.skills];
                newSkills[index] = e.target.value;
                setResume({ ...resume, skills: newSkills });
              }}
              className="block w-full mt-1 border-gray-300 rounded-md shadow-sm"
            />
            <button
              onClick={() => handleRemoveField('skills', index)}
              className="px-2 py-1 ml-2 text-white bg-red-500 rounded-md"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          onClick={() => handleAddField('skills')}
          className="px-2 py-1 mt-2 text-white bg-blue-500 rounded-md"
        >
          Add Skill
        </button>
      </div>
      <AIAnalyzer resume={resume} />
      {resume.id && <ShareResume resume={resume} />}
      {resume.id && <Comments resumeId={resume.id} />}
      <CompetitorAnalysis resume={resume} />
      <AtsCheck resume={resume} />
      <ExportResume resume={resume} />
    </div>
  );
};

export default ResumeBuilder;
