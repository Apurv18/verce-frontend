import React, { useState } from 'react';
import axios from 'axios';
import { Container, Card, Form, Button, ProgressBar } from 'react-bootstrap';

function Compressor() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [quality, setQuality] = useState(80);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
      setSelectedFile(file);
      setError('');
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
    } else {
      setError('Please select a valid image file (JPEG or PNG)');
      setSelectedFile(null);
      setPreview(null);
    }
  };

  const handleQualityChange = (event) => {
    setQuality(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      setError('Please select an image first');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('quality', quality);

    try {
      const response = await axios.post('/compress', formData, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `compressed_${selectedFile.name}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Error compressing image. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Card className="main-card">
        <Card.Header className="text-center">
          <h1 className="mb-0">Image Compressor</h1>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-4">
              <Form.Label>Select Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/jpeg,image/png"
                onChange={handleFileSelect}
                className="custom-file-input"
              />
            </Form.Group>

            {preview && (
              <div className="preview-container mb-4">
                <img src={preview} alt="Preview" className="img-preview" />
              </div>
            )}

            <Form.Group className="mb-4">
              <Form.Label>Compression Quality: {quality}%</Form.Label>
              <Form.Range
                min="10"
                max="100"
                value={quality}
                onChange={handleQualityChange}
                className="custom-range"
              />
              <ProgressBar
                now={quality}
                className="mt-2"
                variant="warning"
              />
            </Form.Group>

            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            <Button
              variant="primary"
              type="submit"
              disabled={loading || !selectedFile}
              className="w-100 submit-button"
            >
              {loading ? 'Compressing...' : 'Compress Image'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Compressor; 