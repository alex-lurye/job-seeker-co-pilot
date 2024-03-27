from contextlib import asynccontextmanager
from typing import Union
from fastapi import FastAPI, Depends, HTTPException, APIRouter, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import os


from flask_restx import ValidationError
import uvicorn
from .models import SummaryGenerationRequest, UpdateRequest, ResumeGenerationRequest
from .weaviate_client import upsert_object_in_weaviate
from .ai_generator import generate_resume
from .tasks import schedule_task, get_task_status
from .ai_generator import generate_summary


security = HTTPBearer()

api_key = os.getenv('AUTH_KEY')

app = FastAPI()
api_router = APIRouter(prefix="/api")

async def validate_api_key(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if credentials.scheme != "Bearer":
        raise HTTPException(status_code=401, detail="Invalid authentication scheme")
    if credentials.credentials != api_key:
        raise HTTPException(status_code=401, detail="Invalid API key")
    return credentials.credentials

@api_router.post("/update-user-details")
async def update_user_details( data: UpdateRequest, api_key: str = Depends(validate_api_key)):
    try:
        # Update Experiences
        for experience in data.experiences:
            upsert_object_in_weaviate( "Experience", experience)
        
        # Update Education
        for education in data.educations:
            upsert_object_in_weaviate( "Education", education)
        
        # Update Skills - Assuming a single skills object per user
        upsert_object_in_weaviate( "Skill", data.skill)

        return {"message": "User details updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

@api_router.post("/generate-resume")
async def generate_resume_hdlr(data: ResumeGenerationRequest, api_key: str = Depends(validate_api_key)):
    task_id = schedule_task(generate_resume, data)
    return {'job_id': task_id}

@api_router.post("/generate-summary")
async def generate_summary_hdlr(data: SummaryGenerationRequest, api_key: str = Depends(validate_api_key)):
    task_id = schedule_task(generate_summary, data)
    return {'job_id': task_id}

@api_router.get("/generation-status/{task_id}")
async def check_generation_status(task_id: str, api_key: str = Depends(validate_api_key)):

    try:
        status = get_task_status(int(task_id))
        if status == None:
            return {"status": "In progress"} 
        else:
            return {"status": "Completed", "result": status}
    except ValueError as ve:
        raise HTTPException(status_code=404, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
async def http422_error_handler(
    _: Request, exc: Union[RequestValidationError, ValidationError]
) -> JSONResponse:
    raw_body = await _.body()
    print(raw_body.decode('utf-8'))  # Assuming UTF-8 encoding
    return JSONResponse(
        {"errors": exc.errors()}, status_code=422
    )

app.add_exception_handler(ValidationError, http422_error_handler)
app.add_exception_handler(RequestValidationError, http422_error_handler)
    
app.include_router(api_router)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5001)
    