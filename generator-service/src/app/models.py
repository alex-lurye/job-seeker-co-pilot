from typing import Optional
from pydantic import BaseModel


class Experience(BaseModel):
    userId: int
    ExperienceId: int
    company: str
    country_iso2: str
    start_year: int
    end_year: int
    position_title: str
    description: str

class Education(BaseModel):
    userId: int
    EducationId: int
    institution: str
    country_iso2: str
    start_year: int
    end_year: int
    field_of_study: str
    additional_info: str

class Skill(BaseModel):
    userId: int
    SkillId: int
    description: str

class UpdateRequest(BaseModel):
    userId: int
    experiences: list[Experience]
    educations: list[Education]
    skill: Skill
    
class ResumeGenerationRequest(BaseModel):
    userId: int
    title: str
    description: str

class SummaryGenerationRequest(BaseModel):
    userId: int
    title: str
    description: str
    draft: Optional[str] = None 
    prompt: Optional[str] = None
