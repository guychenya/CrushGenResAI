import React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import htmlToDocx from 'html-to-docx';

const ExportResume = ({ resume }) => {

    const exportToPdf = () => {
        const input = document.getElementById('resume-preview');
        html2canvas(input)
            .then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF();
                const imgProps = pdf.getImageProperties(imgData);
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                pdf.save('resume.pdf');
            });
    };

    const exportToWord = async () => {
        const htmlString = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>${resume.title}</title>
            </head>
            <body>
                <h1>${resume.contact.name}</h1>
                <p>${resume.contact.email} | ${resume.contact.phone}</p>
                <h2>Summary</h2>
                <p>${resume.summary}</p>
                <h2>Experience</h2>
                ${resume.experience.map(exp => `
                    <div>
                        <h3>${exp.role} at ${exp.company}</h3>
                        <p>${exp.description}</p>
                    </div>
                `).join('')}
                <h2>Education</h2>
                ${resume.education.map(edu => `
                    <div>
                        <h3>${edu.degree} in ${edu.field}</h3>
                        <p>${edu.school}</p>
                    </div>
                `).join('')}
                <h2>Skills</h2>
                <p>${resume.skills.join(', ')}</p>
            </body>
            </html>
        `;

        const fileBuffer = await htmlToDocx(htmlString, null, {
            table: { row: { cantSplit: true } },
            footer: true,
            pageNumber: true,
        });

        saveAs(fileBuffer, 'resume.docx');
    };

    return (
        <div className="p-4 mt-8 border-t">
            <h2 className="text-xl font-bold">Export</h2>
            <div className="flex mt-4">
                <button
                    onClick={exportToPdf}
                    className="px-4 py-2 mr-4 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                    Export as PDF
                </button>
                <button
                    onClick={exportToWord}
                    className="px-4 py-2 font-bold text-white bg-green-600 rounded-md hover:bg-green-700"
                >
                    Export as Word
                </button>
            </div>
            <div id="resume-preview" style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
                {/* This is a hidden div that will be used to render the resume for PDF export */}
                <h1>{resume.contact.name}</h1>
                <p>{resume.contact.email} | {resume.contact.phone}</p>
                <h2>Summary</h2>
                <p>{resume.summary}</p>
                <h2>Experience</h2>
                {resume.experience.map(exp => (
                    <div key={exp.company}>
                        <h3>{exp.role} at {exp.company}</h3>
                        <p>{exp.description}</p>
                    </div>
                ))}
                <h2>Education</h2>
                {resume.education.map(edu => (
                    <div key={edu.school}>
                        <h3>{edu.degree} in {edu.field}</h3>
                        <p>{edu.school}</p>
                    </div>
                ))}
                <h2>Skills</h2>
                <p>{resume.skills.join(', ')}</p>
            </div>
        </div>
    );
};

export default ExportResume;
