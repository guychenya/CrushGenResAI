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

module.exports = router;
