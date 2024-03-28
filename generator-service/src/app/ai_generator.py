import os
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain_openai import ChatOpenAI
from langchain.chains.conversation.memory import ConversationSummaryMemory
from langchain.chains import ConversationChain
from .weaviate_client import get_user_experiences_from_weaviate, get_user_educations_from_weaviate, get_user_skills_from_weaviate
from .resume_creator import create_resume
import logging

import asyncio


async def generate_summary(task_id, data):
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
        
        
        experiences = get_user_experiences_from_weaviate(data.userId)
        educations = get_user_educations_from_weaviate(data.userId)
        skills = get_user_skills_from_weaviate(data.userId)

        # Construct a numbered list of all experiences
        experiences_list = '\n'.join([f"{i+1}. {experience['positionTitle']} {experience['company']} {experience['startYear']} - {experience['endYear']}: {experience['description']}" for i, experience in enumerate(experiences['data']['Get']['Experience'])]) 
        educations_list = '\n'.join([f"{i+1}. {education['institution']} {education['fieldOfStudy']} {education['additionalInfo']}" for i, education in enumerate(educations['data']['Get']['Education'])])
        skills_list = '\n'.join([f"{i+1}. {skill['description']}" for i, skill in enumerate(skills['data']['Get']['Skill'])])
        
        if data.prompt:
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
            I'm writing a professional summary section for my resume that will be used to apply for the position. 
            The professional summary should highlight the parts of my experience and skillset that aligns with the position description. 
            Include only experience in what appears in my qualifications. This text will be a part of resume so it shouldn't include the target position company name.
            Only include information relevant to the position. Do not include information that can show me as overqualified.
            Do not output any additional text besides the summary itself.
            Here is my current professional summary:
            {data.draft}
            Can you improve it following the feedback below?
            {data.prompt}
           """
        else:
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
            Write for me a one paragraph (three sentences) text that will appear in the first summary section of the resume.
            The professional summary should highlight the parts of my experience and skillset that aligns with the position description. 
            Include only experience in what appears in my qualifications. This text will be a part of resume so it shouldn't include the target position company name.
            Do not include any irrelevant information. Do not include information that can show me as overqualified.
            """
        
        logging.info(initial_prompt)
        # Generate the resume
        llm = ChatOpenAI(openai_api_key=os.getenv('OPENAI_API'),model_name=os.getenv('OPENAI_MODEL_NAME'))
        conversation = ConversationChain(
                llm=llm,
                memory=ConversationSummaryMemory(llm=llm),
                prompt = PromptTemplate.from_template(template),          
                )
        
        prof_summary = conversation.invoke(initial_prompt)
        
        return prof_summary['response']
    
    except Exception as e:
        return str(e)
    
async def generate_resume(task_id, data):

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
        experiences_list = '\n'.join([f"{i+1}. {experience['positionTitle']} {experience['company']} {experience['starYear']} - {experience['endYear']}: {experience['description']}" for i, experience in enumerate(experiences['data']['Get']['Experience'])]) 
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
        Write for me a one paragraph (three sentences) text that will appear in the first summary section of the resume.
        The text should align as much as possible with the position description. 
        Do not invent any qualities or experiences that I don't have. 
        Do not include any irrelevant information. Do not include information that can show me as overqualified.
        """ 
        
        logging.info(initial_prompt)
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
        
        key_points = conversation.invoke("Now generate four bullet points outlining my four most important qualifications for the position.Exclude any introductory text or explanations, and only include the numbered bullet points.")

        response = create_resume(task_id, prof_summary['response'], key_points['response'], experiences['data']['Get']['Experience'], educations['data']['Get']['Education'], skills['data']['Get']['Skill'])
        return response
    except Exception as e:
        return str(e)

