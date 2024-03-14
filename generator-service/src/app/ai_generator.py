import os
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain_openai import ChatOpenAI
from .weaviate_client import get_user_experiences_from_weaviate, get_user_educations_from_weaviate, get_user_skills_from_weaviate

import asyncio

async def generate_resume(data):

    try:
        if not data.userId:
            return None

        template = """ Act as an expert career coach. Following is the position description:
        Title: {title}
        Description: {description}
        My job experiences:
        {experiences}
        My education:
        {educations}
        My skills:
        {skills}
        I'm compiling a resume to apply for the position. 
        Can you write a one paragraph (up to 100 words) text that will appear in the first section of the resume under Professional Summary title?
        It should align as much as possible with the position description. Do not invent any qualities or experiences that I don't have. 
        """
        # prompt = PromptTemplate.from_template(template=template)
 
        # First, we need to search for relevant experiences and skills
        # At the first stage, we will provide everything without filter
        # TODO: implement concept extraction and nearText search to filter relevant ones


        experiences = get_user_experiences_from_weaviate(data.userId)
        educations = get_user_educations_from_weaviate(data.userId)
        skills = get_user_skills_from_weaviate(data.userId)

        # Construct a numbered list of all experiences
        experiences_list = '\n'.join([f"{i+1}. {experience['positionTitle']} {experience['description']}" for i, experience in enumerate(experiences['data']['Get']['Experience'])]) 
        educations_list = '\n'.join([f"{i+1}. {education['institution']} {education['fieldOfStudy']} {education['additionalInfo']}" for i, education in enumerate(educations['data']['Get']['Education'])])
        skills_list = '\n'.join([f"{i+1}. {skill['description']}" for i, skill in enumerate(skills['data']['Get']['Skill'])])
        

    # Next, we construct template parameters from the data we have
        template_parameters = {
            "title": data.title,
            "description": data.description,
            "experiences": experiences_list,
            "educations": educations_list,
            "skills": skills_list
        }

        # Generate the resume
        llm = ChatOpenAI(openai_api_key=os.getenv('OPENAI_API'),model_name=os.getenv('OPENAI_MODEL_NAME'))
        prompt = PromptTemplate.from_template(template)     
        llm_chain = LLMChain(prompt=prompt, llm=llm)
        resume = llm_chain.invoke(template_parameters)

        return resume['text']
    except Exception as e:
        return str(e)

