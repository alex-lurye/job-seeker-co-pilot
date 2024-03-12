from flask import Blueprint, request, jsonify
from .auth import require_api_key
from .weaviate_client import upsert_object_in_weaviate

api_blueprint = Blueprint('api', __name__)


@api_blueprint.route('/update-user-details', methods=['POST'])
@require_api_key
def update_user_details():
    try:
        data = request.json
        user_id = data.get('userId')

        # Update Experiences
        for experience in data.get('experiences', []):
            upsert_object_in_weaviate( "Experience", experience)
        
        # Update Education
        for education in data.get('educations', []):
            upsert_object_in_weaviate( "Education", education)
        
        # Update Skills - Assuming a single skills object per user
        if 'skill' in data:
            upsert_object_in_weaviate( "Skill", data['skill'])

        return jsonify({"message": "User details updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api_blueprint.route('/generate-resume', methods=['POST'])
@require_api_key
def generate_resume():
    # Your existing endpoint logic
    pass

@api_blueprint.route('/generation-status/<job_id>', methods=['GET'])
@require_api_key
def check_generation_status(job_id):
    # Your existing endpoint logic
    pass
