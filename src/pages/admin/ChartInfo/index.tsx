import ProDescriptions, { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import { FooterToolbar, PageContainer } from '@ant-design/pro-layout';
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-table';
import { Button, Drawer, Form, Image, InputNumber, message } from 'antd';
import { SortOrder } from 'antd/es/table/interface';
import React, { ReactNode, useRef, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import {
  listUserByPageUsingPOST,

} from '@/services/flybi/userController';

import { deleteChartUsingPOST, listChartByPageUsingPOST, updateChartUsingPOST } from '@/services/flybi/chartController';
import UpdateChartModal from '@/pages/admin/ChartInfo/components/UpdateModal';

const ChartInfo: React.FC = () => {
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
  const [currentRow, setCurrentRow] = useState<API.Chart>();
  const [selectedRowsState, setSelectedRows] = useState<API.Chart[]>([]);
  const [currentId, setCurrentId] = useState<number>();
  const [data, setData] = useState<API.Chart[]>([]); // 初始化一个空数组作为初始值



  /**
   * @en-US Update node
   * @zh-CN 更新节点
   *
   * @param fields
   */
  const handleUpdate = async (fields: API.ChartUpdateRequest) => {
    if (!currentRow) {
      return;
    }
    const hide = message.loading('修改中');
    try {
      await updateChartUsingPOST({
        id: currentRow.id,
        ...fields,
      });
      hide();

      message.success('操作成功');
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
  const handleRemove = async (record: API.Chart) => {
    const hide = message.loading('正在删除');
    if (!record) return true;
    try {
      await deleteChartUsingPOST({
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

  const columns: ProColumns<API.Chart>[] = [
      {
        title: 'ID',
        dataIndex: 'id',
        valueType: 'index',
        ellipsis: true,
      },
      {
        title: '图表名',
        dataIndex: 'name',
        valueType: 'text',
        hideInForm: true,
      },
      {
        title: '图表目标',
        dataIndex: 'goal',
        valueType: 'text',
        hideInForm: true,
      },
      {
        title: '类型',
        dataIndex: 'chartType',
        valueType: 'text',
        hideInForm: true,
      },
      {
        title: '图表状态',
        dataIndex: 'status',
        valueType: 'text',
        valueEnum:{
          succeed:{
            text:"成功",
            status:"success"
          },
          failed:{
            text:"失败",
            status: "error"
          },
          loading:{
            text:"正在生成",
            status:'Processing'
          }
        }
      },
      {
        title: '失败次数',
        dataIndex: 'failedCount',
        valueType: 'digit'
      },
      {
        title: '生成结论',
        dataIndex: 'genResult',
        valueType: 'textarea',
        render: (dom: ReactNode) => {
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
        render: (_: any, record: React.SetStateAction<API.Chart | undefined>) => [
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
        headerTitle="用户"
        actionRef={actionRef}
        rowKey="key"
        search={{
          labelWidth: 120,
        }}
        request={async (
          params,
          sort: Record<string, SortOrder>,
          filter: Record<string, (string | number)[] | null>,
        ) => {
          const res: any = await listChartByPageUsingPOST({
            ...params,
            sortOrder:'descend'
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
      <UpdateChartModal
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
        {currentRow?.name && (
          <ProDescriptions<API.RuleListItem>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns as ProDescriptionsItemProps<API.RuleListItem>[]}
          />
        )}
      </Drawer>

    </PageContainer>
  );
};

export default ChartInfo;
