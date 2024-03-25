FROM python:3.9

COPY . .

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# install python dependencies
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt


# uvicorn
CMD ["uvicorn", "src.app.main:app", "--reload", "--host","0.0.0.0","--port", "5001"]
