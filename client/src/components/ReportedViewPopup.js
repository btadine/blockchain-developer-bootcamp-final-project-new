import React from 'react';

import 'antd/dist/antd.css';

import './ReportedViewPopup.css';

import { Button, Modal } from 'antd';
import CityHack from './CityHack.js';

const ReportedViewPopup = (props) => {
  const closePopup = () => {
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
