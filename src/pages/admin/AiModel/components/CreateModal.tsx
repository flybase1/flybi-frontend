import { ProColumns, ProTable } from '@ant-design/pro-table';

import { Modal } from 'antd';
import React from 'react';


export type Props = {
  columns: ProColumns<API.Aimodel>[];
  onCancel: () => void;
  onSubmit: (values: API.Aimodel) => Promise<boolean>;
  visible: boolean;
};

const CreateModal: React.FC<Props> = (props) => {
  const { visible, columns, onCancel, onSubmit } = props;
  return (
    <Modal visible={visible} onCancel={() => onCancel?.()} footer={null}>
      <ProTable
        type={'form'}
        columns={columns}
        onSubmit={async (value:any) => {
          onSubmit?.(value);
        }}
      />
    </Modal>
  );
};

export default CreateModal;
