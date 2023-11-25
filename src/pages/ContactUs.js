import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import Header from './Header';
import "./Contact.css";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
   
    setFormData({
      name: '',
      email: '',
      message: '',
    });
  };

  return (
    <div>
      <Header />
      <div className="container" style={{ marginTop: '200px', marginLeft: '200px', marginRight: '200px' }}>
        <div className="row">
          <div className="col-md-6">
            <div className='h2-contact '>
              <h2 className='contact-headline  fs-1'>Contact Us</h2><br /><br />
              <h3 className='contact-subline'>Need to get in touch with us? Fill out the form with your inquiry.</h3>
            </div>
          </div>
          <div className="col-md-6">
            <div className='contact'>
              <Form onSubmit={handleSubmit} className='form-contact'>
                <Form.Group controlId="name">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="message">
                  <Form.Label>What can we help you with?</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Button className='submit-button' type="submit">
                  Submit
                </Button>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
