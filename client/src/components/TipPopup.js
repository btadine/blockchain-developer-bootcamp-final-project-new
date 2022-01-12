import React, { useState, useEffect } from 'react';

import 'antd/dist/antd.css';

import './TipPopup.css';

import { Form, InputNumber, Button, Select, Modal } from 'antd';

const TipPopup = (props) => {
  const [tipAmount, setTipAmount] = useState(0.001);
  return (
    <Modal
      className="hackPopup"
      destroyOnClose="true"
      visible={props.visible}
      position="right center"
      onCancel={props.closePopup}
      footer={[
        <Button key="back" onClick={props.closePopup}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={() => props.tipHack(tipAmount)}
        >
          Tip
        </Button>,
      ]}
    >
      {
        <div className="modal">
          <div className="header">Tip a Cityhacker</div>
          <div className="content"></div>
          <div className="rowContent">
            <div className="amountTitle">Enter the amount in ethers:</div>
            <Form className="amountInput" layout="inline" size="small">
              <Form.Item className="" label="">
                <InputNumber
                  min={0.001}
                  max={10}
                  step={0.001}
                  defaultValue={0.001}
                  onChange={(e) => setTipAmount(e)}
                />
              </Form.Item>
            </Form>
          </div>
        </div>
      }
    </Modal>
  );
};

export default TipPopup;
