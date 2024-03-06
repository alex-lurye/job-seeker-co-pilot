import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

// project imports
import MainCard from '../../ui-component/cards/MainCard';
import SubCard from '../../ui-component/cards/SubCard';
import TextField from '@material-ui/core/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

import Select from 'react-select';
import countries from 'i18n-iso-countries';
import axios from 'axios';

import configData from '../../config';

// Import the English language (or any other languages you need)
import english from 'i18n-iso-countries/langs/en.json';

// Initialize i18n-iso-countries with English language
countries.registerLocale(english);

// Prepare country options
const countryOptions = Object.entries(countries.getNames('en', { select: 'official' })).map(([code, name]) => ({
    value: code,
    label: name,
  }));

const customSelectStyles = {
    control: (base) => ({
      ...base,
      // This line sets the height of the input field
      height: '1.4375em',
      // You might also need to adjust the padding to match the TextField
      // Padding is set to 18.5px top and bottom to match Material-UI's default TextField
      'min-height': '56px', // Adjust to match the TextField height including borders
    }),
    valueContainer: (base) => ({
      ...base,
      padding: '18.5px 14px',
    }),
    input: (base) => ({
      ...base,
      margin: 0,
      padding: 0,
      // Set font-size to match the TextField font-size
      'font-size': '1.4375em',
    }),
    // Adjust the dropdown indicator to be centered
    indicatorsContainer: (base) => ({
      ...base,
      height: '56px',
    }),
    // Adjust clear and dropdown indicators to be aligned with the text
    clearIndicator: (base) => ({
      ...base,
      padding: '18.5px',
    }),
    dropdownIndicator: (base) => ({
      ...base,
      padding: '18.5px',
    }),
    // Add any other custom adjustments as necessary
  };
const CountrySelector = ({ onChange, value }) => (
    <Box ml={2}>
        <Select
            options={countryOptions}
            onChange={onChange}
            value={countryOptions.find(option => option.value === value)}
            placeholder="Select a country..."
            styles={customSelectStyles} // Apply the custom styles
        />
    </Box>
);

function Settings() {
    // State for each category
    const [experiences, setExperiences] = useState([{
      company: '',
      country_iso2: '',
      start_year: '',
      end_year: '',
      position_title: '',
      description: '',
    }]);
  
    const [educations, setEducations] = useState([{
      institution: '',
      country_iso2: '',
      start_year: '',
      end_year: '',
      field_of_study: '',
      additional_info: '',
    }]);
    const account = useSelector((state) => state.account);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionSuccess, setSubmissionSuccess] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
  

    const [skill, setSkill] = useState('');
    const [certifications, setCertifications] = useState([{
      name: '',
      issuer: '',
      dateIssued: '',
    }]);
    // Fetch initial data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(configData.API_SERVER + 'settings', {
                    headers: { Authorization: `${account.token}` }, // Assuming you need to authorize
                });
                const data = response.data;
                setExperiences(data.experiences || []);
                setEducations(data.educations || []);
                setSkill(data.skill || '');
                setCertifications(data.certifications || []);
            } catch (error) {
                console.error('Failed to fetch user settings:', error);
                // Handle error appropriately
            }
        };

        fetchData();
    }, []); // useEffect dependency array

    // Handle change for experiences
    const handleExperienceChange = (index, fieldName, fieldValue) => {
        const newExperiences = experiences.map((experience, expIndex) => {
        if (index === expIndex) {
            return { ...experience, [fieldName]: fieldValue };
        }
        return experience;
        });
        setExperiences(newExperiences);
    };

    // Add new experience
    const addExperience = () => {
        setExperiences([...experiences, {
        company: '',
        start_year: '',
        end_year: '',
        position_title: '',
        description: '',
        }]);
    };

    // Remove experience
    const removeExperience = (index) => {
        setExperiences(experiences.filter((_, expIndex) => index !== expIndex));
    };


    // Handle change for educations
    const handleEducationChange = (index, fieldName, fieldValue) => {
        const newEducations = educations.map((education, edIndex) => {
        if (index === edIndex) {
            return { ...education, [fieldName]: fieldValue };
        }
        return education;
        });
        setEducations(newEducations);
    };

    // Add new education
    const addEducation = () => {
        setEducations([...educations, {
        institution: '',
        start_year: '',
        end_year: '',
        field_of_study: '',
        additional_info: '',
        }]);
    };

    // Remove education
    const removeEducation = (index) => {
        setEducations(educations.filter((_, edIndex) => index !== edIndex));
    };

    const handleSkillChange = (e) => setSkill(e.target.value);

    const handleCertificationChange = (index, e) => {
    const newCertifications = certifications.map((certification, cIndex) => {
        if (index === cIndex) {
            return { ...certification, [e.target.name]: e.target.value };
        }
        return certification;
        });
        setCertifications(newCertifications);
    };

    // Handler for changes in experiences
    function handleExperienceCountryChange(experienceIndex, newCountryCode) {
        // Assuming you have a way to update the experiences array in your component's state
        // Here's a generic approach on how you might update an experience's country based on the provided index and new country code
        setExperiences(currentExperiences => {
            const updatedExperiences = [...currentExperiences];
            if (updatedExperiences[experienceIndex]) {
                updatedExperiences[experienceIndex].country_iso2 = newCountryCode;
            }
            return updatedExperiences;
        });
    }
    
    // Handler for changes in educations
    const handleEducationCountryChange = (index, countryValue) => {
        setEducations(educations.map((education, eduIndex) => {
        if (index === eduIndex) {
            return { ...education, country_iso2: countryValue };
        }
        return education;
        }));
    };
    // Handler for form submission
    const handleSubmit = (e) => {
        setIsSubmitting(true);
        setSubmissionSuccess(null);
        setErrorMessage('');

        e.preventDefault();

        // Here you would send the data to your backend server
        console.log('Submitting', { experiences, educations, skill, certifications });
        try {
            axios
                .post( 
                    configData.API_SERVER + 'settings', 
                    { experiences, educations, skill, certifications }, 
                    { headers: { Authorization: `${account.token}` }}
                    )
                .then(function (response) {
                    setIsSubmitting(false);
                    if (response.data.success) {
                        console.log(response.data);
                        setSubmissionSuccess(true);
                    } else {
                        setSubmissionSuccess(false);
                        setErrorMessage('The operation was not successful. Please try again.');
                    }
                })
                .catch(function (error) {
                    setSubmissionSuccess(false);
                    setErrorMessage('The operation was not successful. Please try again.');
                });
        } catch (err) {
            console.error(err);
            setSubmissionSuccess(false);
            setErrorMessage('The operation was not successful. Please try again.');
            setIsSubmitting(false);
        }
    }

    return (
        <MainCard>
            <h2>Settings</h2>
            <form onSubmit={handleSubmit}>
                <h3>Experience</h3>
                <Grid container spacing={2}>
                {experiences.map((experience, index) => (
                <Grid item xs={12} key={index}>
                    <SubCard>
                        <Grid container spacing={2} alignItems="flex-end">
                            <Grid item xs={12} sm={6} md={3}>
                                <TextField
                                name="company"
                                label="Company"
                                fullWidth
                                value={experience.company}
                                onChange={(e) => {  handleExperienceChange(index, 'company', e.target.value)}}
                                placeholder="Company"
                                />
                            </Grid>
                            <Grid xs={12} sm={6} md={3}>
                                <CountrySelector 
                                value={experience.country_iso2}
                                onChange={(e) => { console.log(e); handleExperienceCountryChange(index, e.value)}}
                                placeholder="Select a country..."
                                />
                            </Grid>
                            <Grid item xs={6} md={2}>
                                <TextField
                                name="start_year"
                                type="number"
                                value={experience.start_year}
                                onChange={(e) => handleExperienceChange(index,'start_year', e.target.value)}
                                placeholder="Start Year"
                                />
                            </Grid>
                            <Grid item xs={6} md={2}>
                                <TextField
                                name="end_year"
                                type="number"
                                value={experience.end_year}
                                onChange={(e) => handleExperienceChange(index,'end_year', e.target.value)}
                                placeholder="End Year (or leave blank if current)"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                name="position_title"
                                value={experience.position_title}
                                onChange={(e) => handleExperienceChange(index, 'position_title', e.target.value)}
                                placeholder="Position Title"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                name="description"
                                variant="outlined"
                                fullWidth
                                multiline
                                rows={6}
                                value={experience.description}
                                onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                                placeholder="Description of duties and accomplishments"
                                />
                            </Grid>
                            <Grid item>
                                <IconButton type="button" aria-label="delete" onClick={() => removeExperience(index)}><DeleteIcon />
                                </IconButton>
                            </Grid>
                        </Grid>
                    </SubCard>
                </Grid>
                ))}
                <Grid item xs={12}>
                    <Button 
                        startIcon={<AddCircleOutlineIcon />} 
                        onClick={addExperience}
                        variant="contained"
                    >Add Experience</Button>
                </Grid>
            </Grid>
                {/* Education Form Inputs */}
                <h3>Education</h3>
                {educations.map((education, index) => (
                <SubCard style={{ marginBottom: '20px' }}>
                    <TextField
                        name="institution"
                        value={education.institution}
                        onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                        placeholder="Institution"
                        style={{ display: 'block', margin: '10px 0' }}
                    />
                    <CountrySelector 
                        value={education.country_iso2}
                        onChange={(e) => { console.log(e); handleEducationCountryChange(index, e.value)}}
                        placeholder="Select a country..."
                    />
                    <TextField
                        name="start_year"
                        type="number"
                        value={education.start_year}
                        onChange={(e) => handleEducationChange(index, 'start_year', e.target.value)}
                        placeholder="Start Year"
                        style={{ display: 'block', margin: '10px 0' }}
                    />
                    <TextField
                        name="end_year"
                        type="number"
                        value={education.end_year}
                        onChange={(e) => handleEducationChange(index, 'end_year', e.target.value)}
                        placeholder="End Year (or leave blank if current)"
                        style={{ display: 'block', margin: '10px 0' }}
                    />
                    <TextField
                        name="field_of_study"
                        value={education.field_of_study}
                        onChange={(e) => handleEducationChange(index, 'field_of_study', e.target.value)}
                        placeholder="Field of Study"
                        style={{ display: 'block', margin: '10px 0' }}
                    />
                    <TextField
                        name="additional_info"
                        value={education.additional_info}
                        onChange={(e) => handleEducationChange(index, 'additional_info', e.target.value)}
                        placeholder="Additional Information"
                        style={{ display: 'block', margin: '10px 0', width: '100%', height: '100px' }}
                    />

                    <IconButton type="button" aria-label="delete" onClick={() => removeEducation(index)}><DeleteIcon />
                    </IconButton>
                </SubCard>

                ))}
                <Button 
                startIcon={<AddCircleOutlineIcon />} 
                onClick={addEducation}
                variant="contained"
                >Add Education</Button>
                {/* Skill Input */}
                <h3>Skills</h3>
                <TextField
                name="skill"
                fullWidth
                multiline
                rows={6}
                value={skill}
                onChange={handleSkillChange}
                placeholder="Skills that are relevant for your professional domain"
                />
                
                {/* Certification Form Inputs */}
                {/*<h3>Certifications</h3>*/}
                {/* Repeat structure for certification fields */}
                
                <button type="submit">Save Settings</button>
                {submissionSuccess && <p style={{ color: 'green' }}>Settings saved successfully!</p>}
                {submissionSuccess === false && <p style={{ color: 'red' }}>{errorMessage}</p>}
          </form>
        </MainCard>
  );
}

export default Settings;