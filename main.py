print("🔥 USING GROQ BACKEND 🔥")

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from pydantic import BaseModel, Field
from typing import List, Optional
import os
from dotenv import load_dotenv
from groq import Groq

# -------------------------------------------------
# LOAD ENV
# -------------------------------------------------
load_dotenv()
print("GROQ KEY LOADED:", bool(os.getenv("GROQ_API_KEY")))

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if not GROQ_API_KEY:
    raise RuntimeError("GROQ_API_KEY not found in .env")

client = Groq(api_key=GROQ_API_KEY)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



# -------------------------------------------------
# DATA MODELS
# -------------------------------------------------

class Project(BaseModel):
    title: str
    tech: str
    desc: str


class Experience(BaseModel):
    role: str
    company: str
    duration: str
    desc: str


class ResumeRequest(BaseModel):
    # Mandatory
    fullName: str = Field(..., min_length=1)
    email: str = Field(..., min_length=1)
    degree: str = Field(..., min_length=1)
    field: str = Field(..., min_length=1)
    university: str = Field(..., min_length=1)
    skills: str = Field(..., min_length=1)

    # Optional
    phone: Optional[str] = ""
    location: Optional[str] = ""
    linkedin: Optional[str] = ""
    github: Optional[str] = ""
    startYear: Optional[str] = ""
    endYear: Optional[str] = ""
    tools: Optional[str] = ""

    projects: List[Project] = []
    experience: List[Experience] = []
    certifications: List[str] = []
    extracurriculars: List[str] = []


# -------------------------------------------------
# GENERATE RESUME
# -------------------------------------------------

@app.post("/generate")
def generate_resume(data: ResumeRequest):

    prompt = f"""
You are an expert professional resume writer.

Create a clean, ATS-friendly, one-page resume.
Do NOT add fake information.
Use bullet points and clear headings.

====================
PERSONAL INFO
Name: {data.fullName}
Email: {data.email}
Phone: {data.phone}
Location: {data.location}
LinkedIn: {data.linkedin}
GitHub: {data.github}

====================
EDUCATION
Degree: {data.degree}
Field: {data.field}
University: {data.university}
Years: {data.startYear} - {data.endYear}

====================
SKILLS
{data.skills}
Tools: {data.tools}
"""

    if data.projects:
        prompt += "\nPROJECTS:\n"
        for p in data.projects:
            prompt += f"- {p.title} ({p.tech}): {p.desc}\n"

    if data.experience:
        prompt += "\nEXPERIENCE:\n"
        for e in data.experience:
            prompt += f"- {e.role} at {e.company} ({e.duration}): {e.desc}\n"

    if data.certifications:
        prompt += "\nCERTIFICATIONS:\n"
        for c in data.certifications:
            prompt += f"- {c}\n"

    if data.extracurriculars:
        prompt += "\nEXTRACURRICULAR ACTIVITIES:\n"
        for x in data.extracurriculars:
            prompt += f"- {x}\n"

    try:
        completion = client.chat.completions.create(
            model="llama-3.1-8b-instant",


            messages=[
                {"role": "system", "content": "You generate professional resumes."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.4
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    return {
        "resume_text": completion.choices[0].message.content
    }

# -------------------------------------------------
# COVER LETTER DATA MODEL
# -------------------------------------------------

class CoverLetterRequest(BaseModel):
    jobTitle: str = Field(..., min_length=1)
    companyName: str = Field(..., min_length=1)
    jobDescription: str = Field(..., min_length=1)


# -------------------------------------------------
# PORTFOLIO DATA MODEL
# -------------------------------------------------

class PortfolioRequest(BaseModel):
    name: str = Field(..., min_length=1)
    bio: str = Field(..., min_length=1)
    skills: str = Field(..., min_length=1)
    projects: List[str] = []
    github: Optional[str] = ""
    linkedin: Optional[str] = ""


# -------------------------------------------------
# GENERATE COVER LETTER
# -------------------------------------------------

@app.post("/generate-cover-letter")
def generate_cover_letter(data: CoverLetterRequest):

    prompt = f"""
You are an expert professional cover letter writer.

Write a concise, ATS-friendly cover letter.
Do NOT invent experience.
Keep it formal and professional.

====================
JOB TITLE
{data.jobTitle}

====================
COMPANY
{data.companyName}

====================
JOB DESCRIPTION
{data.jobDescription}
"""

    try:
        completion = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": "You generate professional cover letters."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.4
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    return {
        "cover_letter_text": completion.choices[0].message.content
    }


# -------------------------------------------------
# GENERATE PORTFOLIO
# -------------------------------------------------

@app.post("/generate-portfolio")
def generate_portfolio(data: PortfolioRequest):

    projects_text = ""
    for p in data.projects:
        projects_text += f"- {p}\n"

    prompt = f"""
You are an expert professional portfolio writer.

Create a clean, ATS-friendly portfolio document.

====================
NAME
{data.name}

====================
BIO
{data.bio}

====================
SKILLS
{data.skills}

====================
PROJECTS
{projects_text}

====================
LINKS
GitHub: {data.github}
LinkedIn: {data.linkedin}
"""

    try:
        completion = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": "You generate professional portfolios."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.4
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    return {
        "portfolio_text": completion.choices[0].message.content
    }
