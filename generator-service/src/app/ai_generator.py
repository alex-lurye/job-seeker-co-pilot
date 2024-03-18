import os
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain_openai import ChatOpenAI
from langchain.chains.conversation.memory import ConversationSummaryMemory
from langchain.chains import ConversationChain
from .weaviate_client import get_user_experiences_from_weaviate, get_user_educations_from_weaviate, get_user_skills_from_weaviate
from .resume_creator import create_resume

import asyncio

async def generate_resume(data):

    try:
        if not data.userId:
            return None

        template = """ Following is a professional conversation between job seeker and an expert career coach.
        Current conversation:
        {history}
        Job Seeker: {input}
        Expert Career coach:
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
        
        initial_prompt = f"""
        I want to apply to the following position:
        Title: {data.title}
        Description: {data.description}
        My job experiences:
        {experiences_list}
        My education:
        {educations_list}
        My skills:
        {skills_list}
        I'm compiling a resume to apply for the position. 
        Write for me a one paragraph (up to 100 words) text that will appear in the first section of the resume under Professional Summary title.
        The text should align as much as possible with the position description. 
        Do not invent any qualities or experiences that I don't have. 
        Do not include any irrelevant information. Do not include information that can show me as overqualified.
        """ 
        
        # Generate the resume
        llm = ChatOpenAI(openai_api_key=os.getenv('OPENAI_API'),model_name=os.getenv('OPENAI_MODEL_NAME'))
        conversation = ConversationChain(
                llm=llm,
                memory=ConversationSummaryMemory(llm=llm),
                prompt = PromptTemplate.from_template(template),
                 
                )
        
#        prompt = PromptTemplate.from_template(template)     
#        llm_chain = LLMChain(prompt=prompt, llm=llm)
        prof_summary = conversation.invoke(initial_prompt)
        
        key_points = conversation("Now generate four bullet points outlining my four most important qualifications for the position.Exclude any introductory text or explanations, and only include the numbered bullet points.")

        response = create_resume(prof_summary['response'], key_points['response'], experiences, educations, skills)
        return response
    except Exception as e:
        return str(e)

