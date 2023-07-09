import { ProFormInstance } from '@ant-design/pro-form';
import { ProColumns, ProTable } from '@ant-design/pro-table';

import { Modal } from 'antd';
import React, { useEffect, useRef } from 'react';


export type Props = {
  values: API.AiModelUpdateRequest;
  columns: ProColumns<API.AiModelUpdateRequest>[];
  onCancel: () => void;
  onSubmit: (values: API.AiModelUpdateRequest) => Promise<void>;
  visible: boolean;
};

const UpdateModal: React.FC<Props> = (props) => {
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

export default UpdateModal;
