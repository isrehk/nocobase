import { Button, Steps, Card } from 'antd';
import React, { useState } from 'react';
import { css } from '@emotion/css';

const content = css`
  margin-top: 16px;
`;
const action = css`
  margin-top: 24px;
`;

export const DuplicatorSteps = ({ children, steps, loading, current, onChange }) => {
  const next = async () => {
    steps[current].handler && (await steps[current].handler());
    onChange && onChange(current + 1);
  };

  const prev = () => {
    onChange && onChange(current - 1);
  };
  const { Step } = Steps;

  return (
    <Card>
      <Steps current={current} size="small">
        {steps.map((item) => (
          <Step title={item.title} />
        ))}
      </Steps>
      <div className={content}>{children}</div>
      <div className={action}>
        {current < steps.length - 1 && steps[current].showButton && (
          <Button type="primary" loading={loading} onClick={next}>
            {steps[current].buttonText}
          </Button>
        )}
        {current > 0 && (
          <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
            Previous
          </Button>
        )}
      </div>
    </Card>
  );
};