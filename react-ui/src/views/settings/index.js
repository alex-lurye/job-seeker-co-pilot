import React, { useState } from 'react';

// material-ui
import { Typography } from '@material-ui/core';

// project imports
import MainCard from '../../ui-component/cards/MainCard';
import SubCard from '../../ui-component/cards/SubCard';
import TextField from '@material-ui/core/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

function Settings() {
    // State for each category
    const [experiences, setExperiences] = useState([{
      company: '',
      startYear: '',
      endYear: '',
      positionTitle: '',
      description: '',
    }]);
  
    const [education, setEducation] = useState({
      institution: '',
      startYear: '',
      endYear: '',
      fieldOfStudy: '',
      additionalInfo: '',
    });
  
    const [skill, setSkill] = useState('');
    const [certification, setCertification] = useState({
      name: '',
      issuer: '',
      dateIssued: '',
    });
  
    // Handle change for experiences
    const handleExperienceChange = (index, e) => {
        const newExperiences = experiences.map((experience, expIndex) => {
        if (index === expIndex) {
            return { ...experience, [e.target.name]: e.target.value };
        }
        return experience;
        });
        setExperiences(newExperiences);
    };

    // Add new experience
    const addExperience = () => {
        setExperiences([...experiences, {
        company: '',
        startYear: '',
        endYear: '',
        positionTitle: '',
        description: '',
        }]);
    };

    // Remove experience
    const removeExperience = (index) => {
        setExperiences(experiences.filter((_, expIndex) => index !== expIndex));
    };

    const handleEducationChange = (e) =>
    setEducation({ ...education, [e.target.name]: e.target.value });

    const handleSkillChange = (e) => setSkill(e.target.value);

    const handleCertificationChange = (e) =>
    setCertification({ ...certification, [e.target.name]: e.target.value });

    // Handler for form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would send the data to your backend server
        console.log('Submitting', { experiences, education, skill, certification });
    };
    return (
        <MainCard>
            <h2>Settings</h2>
            <form onSubmit={handleSubmit}>
                <h3>Experiences</h3>
                {experiences.map((experience, index) => (
                <SubCard key={index}>
                    <TextField
                    name="company"
                    value={experience.company}
                    onChange={(e) => handleExperienceChange(index, e)}
                    placeholder="Company"
                    />
                    <TextField
                    name="startYear"
                    type="number"
                    value={experience.startYear}
                    onChange={(e) => handleExperienceChange(index, e)}
                    placeholder="Start Year"
                    style={{ display: 'block', margin: '10px 0' }}
                    />
                    <TextField
                    name="endYear"
                    type="number"
                    value={experience.endYear}
                    onChange={(e) => handleExperienceChange(index, e)}
                    placeholder="End Year (or leave blank if current)"
                    style={{ display: 'block', margin: '10px 0' }}
                    />
                    <TextField
                    name="positionTitle"
                    value={experience.positionTitle}
                    onChange={(e) => handleExperienceChange(index, e)}
                    placeholder="Position Title"
                    style={{ display: 'block', margin: '10px 0' }}
                    />
                    <TextField
                    name="description"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={6}
                    value={experience.description}
                    onChange={(e) => handleExperienceChange(index, e)}
                    placeholder="Description of duties and accomplishments"
                    style={{ display: 'block', margin: '10px 0', width: '100%', height: '100px' }}
                    />
                    <IconButton type="button" aria-label="delete" onClick={() => removeExperience(index)}><DeleteIcon />
                    </IconButton>
                </SubCard>
                ))}
                <Button 
                    startIcon={<AddCircleOutlineIcon />} 
                    onClick={addExperience}
                    variant="contained"
                >Add Experience</Button>
                {/* Education Form Inputs */}
                <h3>Education</h3>
                {/* Repeat structure for education fields */}
                <SubCard style={{ marginBottom: '20px' }}>
                    <TextField
                        name="institution"
                        value={education.institution}
                        onChange={(e) => setEducation({ ...education, institution: e.target.value })}
                        placeholder="Institution"
                        style={{ display: 'block', margin: '10px 0' }}
                    />
                    <TextField
                        name="startYear"
                        type="number"
                        value={education.startYear}
                        onChange={(e) => setEducation({ ...education, startYear: e.target.value })}
                        placeholder="Start Year"
                        style={{ display: 'block', margin: '10px 0' }}
                    />
                    <TextField
                        name="endYear"
                        type="number"
                        value={education.endYear}
                        onChange={(e) => setEducation({ ...education, endYear: e.target.value })}
                        placeholder="End Year (or leave blank if current)"
                        style={{ display: 'block', margin: '10px 0' }}
                    />
                    <TextField
                        name="fieldOfStudy"
                        value={education.fieldOfStudy}
                        onChange={(e) => setEducation({ ...education, fieldOfStudy: e.target.value })}
                        placeholder="Field of Study"
                        style={{ display: 'block', margin: '10px 0' }}
                    />
                    <TextField
                        name="additionalInfo"
                        value={education.additionalInfo}
                        onChange={(e) => setEducation({ ...education, additionalInfo: e.target.value })}
                        placeholder="Additional Information"
                        style={{ display: 'block', margin: '10px 0', width: '100%', height: '100px' }}
                    />
                </SubCard>
                {/* Skill Input */}
                <h3>Skill</h3>
                <TextField
                name="skill"
                fullWidth
                multiline
                rows={6}
                value={skill}
                onChange={handleSkillChange}
                placeholder="Skill"
                />
                
                {/* Certification Form Inputs */}
                <h3>Certification</h3>
                {/* Repeat structure for certification fields */}
                
                <button type="submit">Save Settings</button>
          </form>
        </MainCard>
  );
}

export default Settings;