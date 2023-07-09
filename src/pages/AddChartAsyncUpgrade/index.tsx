import { CaretLeftOutlined, CaretRightOutlined, UploadOutlined } from '@ant-design/icons';

import {
  Avatar,
  Button,
  Card,
  Checkbox,
  Col,
  Collapse,
  Descriptions,
  Divider,
  Form,
  message,
  Row,
  Space,
  Table,
  Upload,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { useForm } from 'antd/es/form/Form';
import {
  chooseUploadExcelStatsUsingPOST,
  uploadExcelAndCreateTableUsingPOST,
} from '@/services/flybi/chartDetailController';
import { DataType } from 'csstype';

import { Helmet, history, useModel } from '@umijs/max';
import { getAiModelByIdUsingGET } from '@/services/flybi/aiModelController';

/**
 * 添加图表
 * @constructor
 */
const AddChartAsyncUpgrade: React.FC = () => {
  const [form] = useForm();
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [headers, setHeaders] = useState<string>();
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [fileData, setFileData] = useState<any[]>([]);
  const [columns, setColumns] = useState<any[]>([]);
  const [tableData, setTableData] = useState<DataType[] | undefined>(undefined);
  const [tableName, setTableName] = useState<string>('');
  const [showInfoPanel, setShowInfoPanel] = useState<boolean>(false);
  const [aIInfo, setAiInfo] = useState<API.Aimodel>();
  const AIId = localStorage.getItem('AIId');



  const onFinish = async (values: any) => {
    const params = {
      ...values,
      file: undefined,
    };
    // 避免返回提交
    if (submitting) {
      return;
    }
    setSubmitting(true);
    try {
      // 线程池genChartAiAsyncUsingPOST
      const res = await uploadExcelAndCreateTableUsingPOST(params, values.file.file.originFileObj);
      if (!res.data) {
        message.error('');
      } else {
        const chartDetailTable = res.data.tableName;
        const allData = res.data.data;
        // 设置表名
        setTableName(chartDetailTable);
        const dynamicColumns = Object.keys(allData[0]).map((key) => ({
          title: key,
          dataIndex: key,
        }));
        setColumns(dynamicColumns);
        setTableData(allData);
        setSelectedColumns(Object.keys(allData[0]));

        message.success('提交成功，请继续下一步操作');
        form.resetFields();

      }
    } catch (e: any) {
      message.error('提交失败,' + e.message);
    }
    setSubmitting(false);
  };

  const handleColumnChange = (checkedValues: any) => {
    setSelectedColumns(checkedValues);
  };

  function returnToHome() {
    history.back();
  }

  const handleNextStep = async () => {
    try {
      // 获取已选择的属性
      const csvData = await chooseUploadExcelStatsUsingPOST({
        columnNames: selectedColumns,
        tableName: tableName,
      });
      //console.log(tableName);
      history.push('/add_chart_async_upgrade/add', { state: { csvData } });
      localStorage.setItem('csvData', JSON.stringify(csvData));
      localStorage.setItem('tableName', JSON.stringify(tableName));
    } catch (e: any) {
      message.error('数据错误');
    }

  };


  /**
   * 格式化时间**/
  const formatDate = (dateTimeString: any) => {
    const date = new Date(dateTimeString);
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date
      .getDate()
      .toString()
      .padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date
      .getMinutes()
      .toString()
      .padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAiModelByIdUsingGET({ AIId: AIId });
        setAiInfo(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [AIId]);


  return (
    <div className={'add-chart-async-upgrade'}>
      <Button onClick={() => returnToHome()}>
        返回
      </Button>
      <Divider />

      <Row>
        <Col span={showInfoPanel ? 18 : 24}>
          <Card title={'智能分析plus'}>
            <Form
              form={form}
              name="add_chart_plus"
              onFinish={onFinish}
              initialValues={{}}
              labelCol={{ span: 2 }}
              labelAlign={'left'}
            >
              <Form.Item
                name="file"
                label="原始数据"
              >
                <Upload name="file" maxCount={1}>
                  <Button icon={<UploadOutlined />}>上传CSV文件</Button>
                </Upload>
              </Form.Item>

              <Form.Item wrapperCol={{ span: 12, offset: 2 }}>
                <Space>
                  <Button type="primary" htmlType="submit" loading={submitting} disabled={submitting}>
                    提交
                  </Button>
                  <Button htmlType="reset">重置</Button>
                </Space>
              </Form.Item>

              <Form.Item label={'选择属性'}>
                <Checkbox.Group options={columns.map(col => col.title)} value={selectedColumns}
                                onChange={handleColumnChange} />
              </Form.Item>

              <Form.Item
                label={'数据预览'}
              >
                <Table
                  columns={columns.filter(col => selectedColumns.includes(col.title))}
                  dataSource={tableData}
                  scroll={{ y: 240, x: 200 }}
                />
              </Form.Item>

              <Form.Item wrapperCol={{ span: 12, offset: 8 }}>
                <Space>
                  <Button type="primary" onClick={handleNextStep}
                          disabled={!selectedColumns || selectedColumns.length === 0}>
                    下一步操作
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>

        </Col>
        <Col span={showInfoPanel ? 6 : 0}>
          <Collapse activeKey={showInfoPanel ? 'infoPanel' : undefined}>
            <Collapse.Panel key="infoPanel" header="相关信息">
              <Descriptions title={'AI介绍'} column={1}>
                <Descriptions.Item label={'头像 '}>{<Avatar src={aIInfo?.aiavatar} />}</Descriptions.Item>
                <Descriptions.Item label={'模型ID'}>{aIInfo?.id}</Descriptions.Item>
                <Descriptions.Item label={'AI名称'}>{aIInfo?.ainame}</Descriptions.Item>
                <Descriptions.Item label={'AI描述'}>{aIInfo?.aidescription}</Descriptions.Item>
                <Descriptions.Item label={'创建时间'}>{formatDate(aIInfo?.createTime)}</Descriptions.Item>
              </Descriptions>
              {/* 相关信息内容 */}
            </Collapse.Panel>
          </Collapse>
          <div style={{ height: '200px' }} />
        </Col>
      </Row>

      <div className="info-panel-toggle">
        <Button
          icon={showInfoPanel ? <CaretLeftOutlined /> : <CaretRightOutlined />}
          onClick={() => setShowInfoPanel(!showInfoPanel)}
        />
      </div>


    </div>
  );
};
export default AddChartAsyncUpgrade;
