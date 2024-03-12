import requests
import json

classes = [
  {
    "class": "Experience",
    "properties": [
      {
        "name": "userId",
        "dataType": ["int"],
        "index": "true"
      },
      {
        "name": "ExperienceId",
        "dataType": ["int"],
        "index": "true"
      },
      {
        "name": "company",
        "dataType": ["string"]
      },
      {
        "name": "countryIso2",
        "dataType": ["string"]
      },
      {
        "name": "startYear",
        "dataType": ["int"]
      },
      {
        "name": "endYear",
        "dataType": ["int"]
      },
      {
        "name": "positionTitle",
        "dataType": ["string"]
      },
      {
        "name": "description",
        "dataType": ["text"]
      }
    ],
    "vectorIndexType": "hnsw",
    "moduleConfig": {
      "text2vec-transformers": {
        "vectorizePropertyName": "description"
      }
    }
  },
  {
    "class": "Education",
    "properties": [
      {
        "name": "userId",
        "dataType": ["int"],
        "index": "true"
      },
      {
        "name": "EducationId",
        "dataType": ["int"],
        "index": "true"
      },
      {
        "name": "institution",
        "dataType": ["string"]
      },
      {
        "name": "countryIso2",
        "dataType": ["string"]
      },
      {
        "name": "startYear",
        "dataType": ["int"]
      },
      {
        "name": "endYear",
        "dataType": ["int"]
      },
      {
        "name": "fieldOfStudy",
        "dataType": ["string"]
      },
      {
        "name": "additionalInfo",
        "dataType": ["text"],
      }
    ],
    "vectorIndexType": "hnsw",
    "moduleConfig": {
      "text2vec-transformers": {
        "vectorizePropertyName": "additionalInfo"
      }
    }
  },
  {
    "class": "Skill",
    "properties": [
      {
        "name": "userId",
        "dataType": ["int"],
        "index": "true"
      },
      {
        "name": "SkillId",
        "dataType": ["int"],
        "index": "true"
      },
      {
        "name": "description",
        "dataType": ["text"]
      }
    ],
    "vectorIndexType": "hnsw",
    "moduleConfig": {
      "text2vec-transformers": {
        "vectorizePropertyName": "description"
      }
    }
  }
]

weaviate_url = "http://localhost:8080/v1/schema"

headers = {
    "Content-Type": "application/json"
}

for obj in classes:
    response = requests.post(weaviate_url, headers=headers, data=json.dumps(obj))
    if response.status_code == 200 or response.status_code == 201:
        print("Object created successfully:", response.json())
    else:
        print("Failed to create object:", response.json())