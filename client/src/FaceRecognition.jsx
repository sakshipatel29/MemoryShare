import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const FaceRecognition = ({ searchTerm, eventImages }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [matchingImages, setMatchingImages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!selectedFile) {
            alert('Please select a file first!');
            return;
        }
        setIsLoading(true);

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('eventName', searchTerm);

        try {
            // Assume the backend filters the images based on the uploaded photo
            const response = await axios.post('http://localhost:3001/recognize-face', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setMatchingImages(response.data); // Set the filtered images
        } catch (error) {
            console.error('Error recognizing face:', error);
            alert('Error recognizing face!');
        }
        setIsLoading(false);
    };

    return (
        <div className="face-recognition-container">
            <h2>Face Recognition</h2>
            <form onSubmit={handleSubmit} className="upload-form">
                <input
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*"
                    aria-label="Select an image to scan"
                />
                <button type="submit" className="button">Upload and Scan</button>
            </form>

            {isLoading ? (
                <div className="spinner"></div> // Your spinner here
            ) : (
                <>
                    <div className="images-list">
                        {eventImages.length > 0 ? (
                            eventImages.map((image, index) => (
                                <div key={index} className="image">
                                    <img
                                        src={`http://localhost:3001/uploads/${searchTerm}/${image}`}
                                        alt={image}
                                        className="event-image"
                                    />
                                </div>
                            ))
                        ) : (
                            <p>No images available for this event.</p>
                        )}
                    </div>

                    <div className="matching-images">
                        {matchingImages.length > 0 ? (
                            matchingImages.map((image, index) => (
                                <div key={index} className="image">
                                    <img
                                        src={`http://localhost:3001/uploads/${searchTerm}/${image}`}
                                        alt={image}
                                        className="event-image"
                                    />
                                </div>
                            ))
                        ) : (
                            <p>No matching images found.</p>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default FaceRecognition;
