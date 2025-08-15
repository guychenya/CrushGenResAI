const express = require('express');
const router = express.Router();

// Initialize OpenAI client with fallback for development
let openai = null;
try {
  if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your-openai-api-key') {
    const { OpenAI } = require('openai');
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    console.log('OpenAI client initialized successfully');
  } else {
    console.warn('OpenAI API key not configured, using mock responses for development');
  }
} catch (error) {
  console.error('Failed to initialize OpenAI client:', error);
}

router.post('/analyze', async (req, res) => {
  const { resume, jobDescription } = req.body;

  if (!resume || !jobDescription) {
    return res.status(400).json({ message: 'Resume and job description are required.' });
  }

  try {
    if (!openai) {
      // Mock response for development
      return res.json({ 
        analysis: `**Resume Analysis Score: 75/100**

This resume shows strong alignment with the job description in several key areas. The candidate demonstrates relevant experience and skills that match the position requirements.

**Strengths:**
- Strong technical background matching the role requirements
- Relevant work experience in similar positions
- Good educational foundation

**Areas for Improvement:**
- Consider adding more specific keywords from the job description
- Highlight quantifiable achievements
- Ensure all relevant skills are prominently displayed

**Missing Keywords:** React, Node.js, AWS, Agile, Scrum, Docker, Kubernetes

This is a mock analysis for development purposes. Configure OPENAI_API_KEY for actual AI analysis.`
      });
    }

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
    if (!openai) {
      // Mock response for development
      return res.json({ 
        analysis: `**Competitor Analysis Report**

**Comparison with Top-Performing Resume:**

**Your Strengths:**
- Good foundational experience in the field
- Clear presentation of skills and education
- Professional formatting and structure

**Areas for Improvement:**
- **Quantify achievements**: Top performers include specific metrics (e.g., "improved system scalability by 40%")
- **Action-oriented language**: Use strong action verbs to start bullet points
- **Industry keywords**: Incorporate more technical terms specific to your field
- **Project highlights**: Add more detailed project descriptions with outcomes

**Recommendations:**
1. Add quantifiable results to your experience section
2. Include more technical skills that are in demand
3. Highlight leadership experience and team collaboration
4. Consider adding a professional summary at the top

This is a mock analysis for development purposes. Configure OPENAI_API_KEY for actual AI analysis.`
      });
    }

    const top_resume = getTopPerformingResume(jobDescription);

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
    if (!openai) {
      // Mock response for development
      return res.json({ 
        analysis: `**ATS Compatibility Score: 82/100**

**ATS Analysis Results:**

**✅ Strong Points:**
- Clear section headers (Contact, Summary, Experience, Education)
- Consistent formatting and structure
- Readable font and appropriate spacing
- Standard resume sections are present

**⚠️ Areas for Improvement:**
- **Keywords**: Add more industry-specific keywords and skills
- **File format**: Ensure resume is saved as .docx or .pdf for best ATS compatibility
- **Contact information**: Include LinkedIn profile and city/state
- **Skills section**: Create a dedicated technical skills section
- **Action verbs**: Start bullet points with strong action verbs

**Recommendations:**
1. Add a dedicated "Technical Skills" section
2. Include more keywords from job descriptions you're targeting
3. Use standard date formats (MM/YYYY)
4. Avoid tables, graphics, or unusual formatting
5. Include relevant certifications if applicable

This is a mock analysis for development purposes. Configure OPENAI_API_KEY for actual AI analysis.`
      });
    }

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
