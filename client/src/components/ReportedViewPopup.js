import React, { useState, useEffect } from 'react';

import 'antd/dist/antd.css';

import './ReportedViewPopup.css';

import { Form, Input, Button, Select, Modal } from 'antd';
import CityHack from './CityHack.js';

const ReportedViewPopup = (props) => {
  const [textValue, setTextValue] = useState('');
  const [cityId, setCityId] = useState(0);
  const [categoryId, setCategoryId] = useState(0);
  const [loadingPost, setLoadingPost] = useState(false);
  const [postButtonTitle, setPostButtonTitle] = useState('Post');

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
    setLoadingPost(true);
    setPostButtonTitle('Posting');
    console.log(textValue, cityId, categoryId);
    await props.postHack(textValue, cityId, categoryId);
    setLoadingPost(false);
    setPostButtonTitle('Success');
    props.getAllHacks();
  };

  const closePopup = () => {
    setTextValue('');
    setCityId(0);
    setCategoryId(0);
    props.closePopup();
    setPostButtonTitle('Post');
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!loadingPost) {
        closePopup();
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [postButtonTitle]);

  return (
    <Modal
      className="hackPopup"
      destroyOnClose="true"
      visible={props.visible}
      position="right center"
      onCancel={closePopup}
      footer={[
        <Button key="back" disabled={loadingPost} onClick={closePopup}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loadingPost}
          onClick={postHack}
        >
          {postButtonTitle}
        </Button>,
      ]}
    >
      {
        <div className="modal">
          <div className="header">Reported cityhacks</div>
          <div className="content">
            {props.reportedHacks.map((hack, index) => {
              return (
                <CityHack
                  key={index}
                  hack={hack}
                  reportedView={true}
                  handleUnReport={props.handleUnReport}
                  handleHide={props.handleHide}
                />
              );
            })}
          </div>
        </div>
      }
    </Modal>
  );
};

export default ReportedViewPopup;
