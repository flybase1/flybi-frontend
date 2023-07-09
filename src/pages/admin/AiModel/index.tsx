import { FooterToolbar, PageContainer } from '@ant-design/pro-layout';
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-table';
import { Button, Drawer, Form, Image, InputNumber, message } from 'antd';
import { SortOrder } from 'antd/es/table/interface';
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import UpdateModal from '@/pages/admin/AiModel/components/UpdateModal';
import CreateModal from '@/pages/admin/AiModel/components/CreateModal';
import {
  addAiModelUsingPOST,
  deleteAiModelUsingPOST,
  listAiModelUsingPOST,
  updateAiModelUsingPOST,
} from '@/services/flybi/aiModelController';
import { PlusOutlined } from '@ant-design/icons';
import ProDescriptions, { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';

const AiModel: React.FC = () => {
  /**
   * @en-US Pop-up window of new window
   * @zh-CN 新建窗口的弹窗
   *  */
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  /**
   * @en-US The pop-up window of the distribution update window
   * @zh-CN 分布更新窗口的弹窗
   * */
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);

  const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.Aimodel>();
  const [selectedRowsState, setSelectedRows] = useState<API.Aimodel[]>([]);
  const [data, setData] = useState<API.Aimodel[]>([]); // 初始化一个空数组作为初始值

  const [reloadData, setReloadData] = useState(false);

  useEffect(() => {
    if (reloadData) {
      actionRef.current?.reload();
      setReloadData(false);
    }
  }, [reloadData]);


  /**
   * @en-US Add node
   * @zh-CN 添加节点
   * @param fields
   */
  const handleAdd = async (fields: API.AiModelAddRequest) => {
    const hide = message.loading('正在添加');
    try {
      await addAiModelUsingPOST({ ...fields });
      hide();
      message.success('创建成功');
      handleModalOpen(false);
      setReloadData(true);
      return true;
    } catch (error: any) {
      hide();
      message.error('创建失败,' + error.message);
      return false;
    }
  };

  /**
   * @en-US Update node
   * @zh-CN 更新节点
   *
   * @param fields
   */
  const handleUpdate = async (fields: API.AiModelUpdateRequest) => {
    if (!currentRow) {
      return;
    }
    const hide = message.loading('修改中');
    try {
      await updateAiModelUsingPOST({
        id: currentRow.id,
        ...fields,
      });
      hide();

      message.success('操作成功');
      setReloadData(true);
      return true;
    } catch (error: any) {
      hide();
      message.error('操作失败,' + error.message);
      return false;
    }
  };

  /**
   *  Delete node
   * @zh-CN 删除节点
   *
   * @param record
   */
  const handleRemove = async (record: API.Aimodel) => {
    const hide = message.loading('正在删除');
    if (!record) return true;
    try {
      await deleteAiModelUsingPOST({
        id: record.id,
      });
      hide();
      message.success('删除成功');
      actionRef.current?.reload();
      return true;
    } catch (error: any) {
      hide();
      message.error('删除失败,' + error.message);
      return false;
    }
  };

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
    //  const intl = useIntl();

  const columns: ProColumns<API.Aimodel>[] = [
      {
        title: 'ID',
        dataIndex: 'id',
        valueType: 'index',
        ellipsis: true,
      },
      {
        title: 'AI名',
        dataIndex: 'ainame',
        valueType: 'text',
      },
      {
        title: 'AI描述',
        dataIndex: 'aidescription',
        valueType: 'textArea',
        ender: (dom: ReactNode) => {
          if (typeof dom === 'string') {
            const text = dom;
            if (text.length > 20) {
              return text.substring(0, 20) + '...';
            }
            return text;
          }
          return dom;
        },
      },
      {
        title: 'AI头像',
        dataIndex: 'aiavatar',
        render: (_: any, record: { userAvatar: string | undefined; }) => (
          <div>
            <Image src={record.userAvatar} width={50} height={50} />
          </div>
        ),
      },
      {
        title: '是否上线',
        dataIndex: 'isOnline',
        valueType: 'text',
        valueEnum: {
          OnLine: {
            text: '上线',
            status: 'Processing',
          },
          offLine: {
            text: '下线',
            status: 'error',
          },
        },
      },
      {
        title: 'AI路由',
        dataIndex: 'airoute',
        valueType: 'text',
      },

      {
        title: '创建时间',
        dataIndex: 'createTime',
        valueType: 'dateTime',
        hideInForm: true,
      },
      {
        title: '更新时间',
        dataIndex: 'updateTime',
        valueType: 'dateTime',
        hideInForm: true,
      },

      {
        title: '操作',
        dataIndex: 'option',
        valueType: 'option',
        render: (_: any, record: React.SetStateAction<API.Aimodel | undefined>) => [
          <a
            key="config"
            onClick={() => {
              handleUpdateModalOpen(true);
              setCurrentRow(record);
            }}
          >
            修改
          </a>,
          <a
            key="danger"
            onClick={() => {
              handleRemove(record);
            }}
          >
            删除
          </a>,
        ],
      },
    ];

  // @ts-ignore          <API.RuleListItem, API.PageParams>
  return (
    <PageContainer>
      <ProTable
        headerTitle="AI模型"
        actionRef={actionRef}
        rowKey="key"
        search={{
          labelWidth: 120,
        }}

        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalOpen(true);
            }}
          >
            <PlusOutlined />{' 新建'}
          </Button>,
        ]}
        request={async (
          params,
          sort: Record<string, SortOrder>,
          filter: Record<string, (string | number)[] | null>,
        ) => {
          const res: any = await listAiModelUsingPOST({
            ...params,
          });

          if (res?.data) {
            return {
              data: res.data.records || [],
              success: true,
              total: res.data.total || 0,
            };
          } else {
            return {
              data: [],
              success: false,
              total: 0,
            };
          }
        }}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              <FormattedMessage id="pages.searchTable.chosen" defaultMessage="Chosen" />{' '}
              <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>{' '}
              <FormattedMessage id="pages.searchTable.item" defaultMessage="项" />
              &nbsp;&nbsp;
              <span>
                <FormattedMessage
                  id="pages.searchTable.totalServiceCalls"
                  defaultMessage="Total number of service calls"
                />{' '}
                {selectedRowsState.reduce((pre, item) => pre, 0)}{' '}
                <FormattedMessage id="pages.searchTable.tenThousand" defaultMessage="万" />
              </span>
            </div>
          }
        >
          <Button
            onClick={async () => {
              //  await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            <FormattedMessage
              id="pages.searchTable.batchDeletion"
              defaultMessage="Batch deletion"
            />
          </Button>
          <Button type="primary">
            <FormattedMessage
              id="pages.searchTable.batchApproval"
              defaultMessage="Batch approval"
            />
          </Button>
        </FooterToolbar>
      )}
      <UpdateModal
        columns={columns}
        onSubmit={async (value) => {
          const success = await handleUpdate(value);
          if (success) {
            handleUpdateModalOpen(false);
            setCurrentRow(undefined);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          handleUpdateModalOpen(false);
          if (!showDetail) {
            setCurrentRow(undefined);
          }
        }}
        visible={updateModalOpen}
        values={currentRow || {}}
      />
      <Drawer
        width={600}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.ainame && (
          <ProDescriptions<API.RuleListItem>
            column={2}
            title={currentRow?.ainame}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.ainame,
            }}
            columns={columns as ProDescriptionsItemProps<API.RuleListItem>[]}
          />
        )}
      </Drawer>
      <CreateModal
        columns={columns}
        onCancel={() => handleModalOpen(false)}
        onSubmit={(values) => handleAdd(values)}
        visible={createModalOpen}
      />
    </PageContainer>
  );
};

export default AiModel;
