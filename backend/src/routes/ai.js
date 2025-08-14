const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post('/analyze', async (req, res) => {
  const { resume, jobDescription } = req.body;

  if (!resume || !jobDescription) {
    return res.status(400).json({ message: 'Resume and job description are required.' });
  }

  try {
    const prompt = `
      Analyze the following resume and job description. Provide a score from 0 to 100 indicating how well the resume is aligned with the job description.
      Also provide a brief summary of a few sentences explaining the score, and a list of keywords from the job description that are missing from the resume.

      Resume:
      ${JSON.stringify(resume, null, 2)}

      Job Description:
      ${jobDescription}
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    res.json({ analysis: response.choices[0].message.content });
  } catch (error) {
    console.error('Error analyzing resume:', error);
    res.status(500).json({ message: 'Failed to analyze resume.' });
  }
});

// Mock function to get a top-performing resume
function getTopPerformingResume(role) {
  // In a real application, this would query a database of anonymized, high-scoring resumes
  return {
    contact: { name: 'Jane Doe', email: 'jane.doe@example.com', phone: '123-456-7890' },
    summary: `Highly motivated and results-oriented ${role} with 5+ years of experience in driving project success and team collaboration. Proven track record of delivering high-quality products on time and within budget.`,
    experience: [
      { company: 'Tech Solutions Inc.', role: 'Senior Software Engineer', description: 'Led the development of a new microservices-based architecture, improving system scalability by 40%.' },
      { company: 'Innovate Corp.', role: 'Software Engineer', description: 'Developed and maintained key features for a customer-facing web application with over 1 million active users.' }
    ],
    education: [
      { school: 'State University', degree: 'B.S. in Computer Science', field: 'Computer Science' }
    ],
    skills: ['JavaScript', 'React', 'Node.js', 'PostgreSQL', 'AWS', 'Docker', 'Agile Methodologies']
  };
}

router.post('/competitor-analysis', async (req, res) => {
  const { resume, jobDescription } = req.body;

  if (!resume || !jobDescription) {
    return res.status(400).json({ message: 'Resume and job description are required.' });
  }

  try {
    const top_resume = getTopPerformingResume(jobDescription); // Using job description to simulate finding a relevant role

    const prompt = `
      Analyze the user's resume against the provided top-performing resume for a similar role. Provide a comparative analysis highlighting strengths and weaknesses, and suggest specific improvements for the user's resume to better align with high-performing examples.

      User's Resume:
      ${JSON.stringify(resume, null, 2)}

      Top-Performing Resume Example:
      ${JSON.stringify(top_resume, null, 2)}
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    res.json({ analysis: response.choices[0].message.content });
  } catch (error) {
    console.error('Error with competitor analysis:', error);
    res.status(500).json({ message: 'Failed to perform competitor analysis.' });
  }
});

router.post('/ats-check', async (req, res) => {
  const { resume } = req.body;

  if (!resume) {
    return res.status(400).json({ message: 'Resume is required.' });
  }

  try {
    const prompt = `
      Analyze the following resume for ATS (Applicant Tracking System) compatibility. Provide a score from 0 to 100, and a list of actionable recommendations to improve the resume's machine readability.
      Consider formatting, keywords, and standard resume sections.

      Resume:
      ${JSON.stringify(resume, null, 2)}
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    res.json({ analysis: response.choices[0].message.content });
  } catch (error) {
    console.error('Error with ATS check:', error);
    res.status(500).json({ message: 'Failed to perform ATS check.' });
  }
});

module.exports = router;
