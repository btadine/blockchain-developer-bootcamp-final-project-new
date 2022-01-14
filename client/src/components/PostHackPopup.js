import React, { useState } from 'react';

import 'antd/dist/antd.css';

import './PostHackPopup.css';

import { Form, Input, Button, Select, Modal } from 'antd';

const PostHackPopup = (props) => {
  const [textValue, setTextValue] = useState('');
  const [cityId, setCityId] = useState(0);
  const [categoryId, setCategoryId] = useState(0);

  const cities = [
    'Select a City',
    'Barcelona',
    'Buenos Aires',
    'Lisbon',
    'Madrid',
    'London',
    'Tokyo',
    'New York',
    'San Francisco',
    'Berlin',
    'Paris',
    'Rome',
    'Athens',
  ];

  const categories = [
    'Select a Category',
    'Cheap Places',
    'Nice Spots',
    'Traditional',
    'Parking',
    'Coworking',
    'Misc',
  ];

  const postHack = async () => {
    closePopup();
    await props.postHack(textValue, cityId, categoryId);
    props.getAllHacks();
  };

  const closePopup = () => {
    setTextValue('');
    setCityId(0);
    setCategoryId(0);
    props.closePopup();
  };

  return (
    <Modal
      className="hackPopup"
      destroyOnClose="true"
      visible={props.visible}
      position="right center"
      onCancel={closePopup}
      footer={[
        <Button key="back" onClick={closePopup}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={postHack}>
          Post
        </Button>,
      ]}
    >
      {
        <div className="modal">
          <div className="header"> Post your cityhack </div>
          <div className="content">
            {' '}
            Select a city, a category and enter a description of your cityhack.
            <Form className="selectHolder" layout="inline" size="middle">
              <Form.Item style={{ width: '40%' }}>
                <Select
                  className="Select"
                  style={{ margin: '0px' }}
                  value={cityId}
                  aria-label="Default select example"
                  onChange={(e) => setCityId(e)}
                >
                  {cities.map((city, index) => {
                    return (
                      <Select.Option key={'city' + index} value={index}>
                        {city}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
              <Form.Item style={{ width: '40%' }}>
                <Select
                  className="Select"
                  style={{ margin: '0px' }}
                  value={categoryId}
                  aria-label="Default select example"
                  onChange={(e) => setCategoryId(e)}
                >
                  {categories.map((category, index) => {
                    return (
                      <Select.Option key={'category' + index} value={index}>
                        {category}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
              <Form.Item
                className="descriptionBox"
                style={{ width: '100%' }}
                label=""
              >
                <Input
                  style={{
                    height: '76px',
                    minHeight: '76px',
                    maxHeight: '120px',
                    overflowY: 'hidden',
                    resize: 'none',
                  }}
                  onChange={(e) => setTextValue(e.target.value)}
                  placeholder="ie. cheap beers, a nice view spot, hipster coffee place"
                />
              </Form.Item>
            </Form>
          </div>
        </div>
      }
    </Modal>
  );
};

export default PostHackPopup;
