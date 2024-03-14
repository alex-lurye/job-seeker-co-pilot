import logging
import weaviate
from dotenv import load_dotenv
import os


# Load environment variables from a .env file for secure credential management
load_dotenv()


# Environment variables for Weaviate connection
WEAVIATE_URL = os.getenv("WEAVIATE_URL", "http://localhost:8080")
WEAVIATE_AUTH_TOKEN = os.getenv("WEAVIATE_AUTH_TOKEN", None)

client_config = {
    "url": WEAVIATE_URL
}

# If your Weaviate instance uses authentication, configure it here
if WEAVIATE_AUTH_TOKEN is not None:
    auth_client = weaviate.AuthClientPassword(token=WEAVIATE_AUTH_TOKEN)
    client_config["auth_client"] = auth_client

# Initialize the Weaviate client instance
client = weaviate.Client(**client_config)

def find_object(properties, class_name):

    where_filter = {
        "operator": "And",
        "operands": [{
            "path": ["userId"],
            "operator": "Equal",
            "valueInt": properties.__dict__["userId"]
        },
        {
            "path": [class_name.lower()+"Id"],
            "operator": "Equal",
            "valueInt": properties.__dict__[class_name+"Id"]
        }
        ]
    }

    return client.query.get(class_name,
                        "userId").with_additional(['id']).with_where(where_filter).do()

def find_experience(properties):
    # Process data for an Experience object
    logging.info("Handling Experience class with data:", properties)

    return find_object(properties,"Experience")


def find_education(properties):
    # Process data for an Education object
    logging.info("Handling Education class with data:", properties)

    return find_object(properties,"Education")


def find_skill(properties):
    # Process data for a Skill object
    logging.info("Handling Skill class with data:", properties)

    return find_object(properties,"Skill")


def default_handler(properties):
    # Default handler if class name does not match
    logging.info("No handler for class with data:", properties)

    return None

find_class_switch = {
    "Experience": find_experience,
    "Education": find_education,
    "Skill": find_skill
}

def find_object_in_weaviate( class_name, properties):
    handler_function = find_class_switch.get(class_name, default_handler)

    return handler_function(properties)

def upsert_object_in_weaviate(class_name, properties):
    """
    Upsert an object in Weaviate. Create a new object if it doesn't exist,
    or update it if it does. 
    """
    object_uuid = find_object_in_weaviate(class_name, properties)

    if object_uuid['data']['Get'][class_name]:
        # Object exists, update it
        logging.info("object exists, updating it")
        id_path = object_uuid.get('data', {}).get('Get', {}).get(class_name, [{}])[0].get('_additional', {}).get('id')
        if id_path:
            client.data_object.update(uuid=id_path, class_name=class_name, data_object=properties.__dict__)
        else:
            print("ID path does not exist")

    else:
        # Object does not exist, create a new one
        logging.info("new object, creating it")
        uuid = client.data_object.create(class_name=class_name,
            data_object=properties.__dict__)

def get_user_experiences_from_weaviate(userId):

    where_filter = {
        "path": ["userId"],
        "operator": "Equal",
        "valueInt": userId
    }

    return client.query.get("Experience",
                        ["positionTitle","description"]).with_additional(['id']).with_where(where_filter).do()


def get_user_educations_from_weaviate(userId):

    where_filter = {
        "path": ["userId"],
        "operator": "Equal",
        "valueInt": userId
    }

    return client.query.get("Education",
                        ["institution","fieldOfStudy","additionalInfo"]).with_additional(['id']).with_where(where_filter).do()


def get_user_skills_from_weaviate(userId):

    where_filter = {
        "path": ["userId"],
        "operator": "Equal",
        "valueInt": userId
    }

    return client.query.get("Skill",
                        ["description"]).with_additional(['id']).with_where(where_filter).do()