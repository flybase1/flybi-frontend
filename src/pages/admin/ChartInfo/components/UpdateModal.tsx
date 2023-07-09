import { ProFormInstance } from '@ant-design/pro-form';
import { ProColumns, ProTable } from '@ant-design/pro-table';

import { Modal } from 'antd';
import React, { useEffect, useRef } from 'react';


export type Props = {
  values: API.Chart;
  columns: ProColumns<API.Chart>[];
  onCancel: () => void;
  onSubmit: (values: API.Chart) => Promise<void>;
  visible: boolean;
};

const UpdateChartModal: React.FC<Props> = (props) => {
  const { values, visible, columns, onCancel, onSubmit } = props;
  const formRef = useRef<ProFormInstance>();
  useEffect(() => {
    if (formRef) {
      formRef.current?.setFieldsValue(values);
    }
  }, [values]);
  return (
    <Modal visible={visible} footer={null} onCancel={() => onCancel?.()}>
      <ProTable
        type="form"
        columns={columns}
        formRef={formRef}
        onSubmit={async (value) => {
          onSubmit?.(value);
        }}
      />
    </Modal>
  );
};

export default UpdateChartModal;
