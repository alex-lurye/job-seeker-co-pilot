from docx import Document
from docx.shared import Pt
# Imports the Google Cloud client library
from google.cloud import storage
import re

# Instantiates a client
#storage_client = storage.Client()

def replace_placeholder(doc: Document, placeholder: str, new_content: str):
    """
    Replace placeholders in the document with new content.
    """
    for paragraph in doc.paragraphs:
        if placeholder in paragraph.text:
            inline = paragraph.runs
            for i in range(len(inline)):
                if placeholder in inline[i].text:
                    text = inline[i].text.replace(placeholder, new_content)
                    inline[i].text = text

def create_resume(prof_summary: str, key_competiences: str, experiences: list, educations: list, skills: list):

    template_path = './resources/Resume_template.docx'
    
    doc = Document(template_path)
    
    replace_placeholder(doc, '{YOUR_PROFILE}', prof_summary)
    
    # Split the response text into lines
    lines = key_competiences.strip().split('\n')

    # Filter lines that start with a digit followed by a period to identify bullet points
    bullet_points = [line for line in lines if line.strip().startswith(('1.', '2.', '3.', '4.'))]
    
    clean_bullet_points = [re.sub(r'^\d+\.\s*', '', point).strip() for point in bullet_points]

    # yes I'm lazy
    replace_placeholder(doc,  '{YOUR_COMPETENCY_1}', clean_bullet_points[0])
    replace_placeholder(doc,  '{YOUR_COMPETENCY_2}', clean_bullet_points[1])
    replace_placeholder(doc,  '{YOUR_COMPETENCY_3}', clean_bullet_points[2])
    replace_placeholder(doc,  '{YOUR_COMPETENCY_4}', clean_bullet_points[3])

    doc.save('/tmp/resume.docx')

    return '/tmp/resume.docx'