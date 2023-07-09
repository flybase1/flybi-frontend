import {
  Alert, Button, Card, Checkbox,
  Col, Divider, Form, Input, message, Radio, Rate, Row, Select, Slider, Space, Spin, Switch, Tabs, Upload,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { useForm } from 'antd/es/form/Form';
import { genChartUsingPOST } from '@/services/flybi/chartDetailController';

import { Helmet, history, useModel } from '@umijs/max';
import {
  AreaChartOutlined,
  BarChartOutlined, DashboardOutlined,
  LineChartOutlined,
  PieChartOutlined,
  RadarChartOutlined,
} from '@ant-design/icons';


/**
 * 添加图表
 * @constructor
 */
const AddChartAsyncUpgrade: React.FC = () => {
  const [chart, setChart] = useState<API.BIResponse>();
  const [form] = useForm();
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [option, setOption] = useState<any>(null);
  const [csvData, setCsvData] = useState<string>();
  const [tableName, setTableName] = useState<string>();
  // const location = useLocation();
  // const tableName = location.state as { tableName?: string };


  const chartOptions = [
    { value: '折线图', label: '折线图', icon: <LineChartOutlined /> },
    { value: '柱状图', label: '柱状图', icon: <BarChartOutlined /> },
    { value: '堆叠图', label: '堆叠图', icon: <AreaChartOutlined /> },
    { value: '饼图', label: '饼图', icon: <PieChartOutlined /> },
    { value: '雷达图', label: '雷达图', icon: <RadarChartOutlined /> },
    { value: '仪表图', label: '仪表图', icon: <DashboardOutlined /> },
  ];


  const onFinish = async (values: any) => {
    const params = {
      ...values,
      csvData: csvData,
    };
    // 避免返回提交
    if (submitting) {
      return;
    }

    setSubmitting(true);
    setOption(undefined);
    setChart(undefined);
    try {
      const res = await genChartUsingPOST({
        csvData: JSON.stringify(csvData), // 使用正确的csvData值
        goal: values.goal,
        chartType: values.chartType,
        name: values.name,
        chartDetailName: tableName,
      });

      if (!res.data) {
        message.error('分析失败');
      }
      message.success('上传成功');
      localStorage.setItem('chartId', res?.data?.chartId + '');
      form.resetFields();
      localStorage.removeItem('csvData');
      localStorage.removeItem('tableName');
      history.push('/my_chart');
    } catch (e: any) {
      message.error('分析失败,' + e.message);
    }
    setSubmitting(false);
  };

  function returnToHome() {
    history.back();
  }

  useEffect(() => {
    const storedCsvData = localStorage.getItem('csvData');
    const storedTableName = localStorage.getItem('tableName');
    if (storedCsvData) {
      const csvData = JSON.parse(storedCsvData) as string;
      setCsvData(csvData);
    } else {
      history.push('/ai');
    }
    if (storedTableName)
      setTableName(JSON.parse(storedTableName) as string);

  }, []);

  const [selectedOption, setSelectedOption] = useState<string>('');

  const handleOptionClick = (value: string) => {
    setSelectedOption(value);
    form.setFieldsValue({ chartType: value });
  };


  return (
    <div className={'add-chart-async'}>
      <Button onClick={() => returnToHome()}>
        返回
      </Button>
      <Divider />
      <Card title={'智能分析'}>
        <Form
          form={form}
          name="add_chart"
          onFinish={onFinish}
          initialValues={{}}
          labelCol={{ span: 4 }}
          labelAlign={'left'}
        >
          <Form.Item name={'goal'} label={'分析目标'} rules={[{ required: true, message: '请输入你的图表类型' }]}>
            <Input placeholder={'请输入你的分析需求, 比如分析人数增长情况'} />
          </Form.Item>

          <Form.Item name={'name'} label={'图表名称'} rules={[{ required: true, message: '请输入你的图表类型' }]}>
            <Input placeholder={'请输入图表名称'} />
          </Form.Item>

          <Form.Item
            name="chartType"
            label="图表类型"
            hasFeedback
            rules={[{ required: true, message: '请输入你的图表类型' }]}
          >
            {/*<Select options={[*/}
            {/*  { value: '折线图', label: '折线图' },*/}
            {/*  { value: '柱状图', label: '柱状图' },*/}
            {/*  { value: '堆叠图', label: '堆叠图' },*/}
            {/*  { value: '饼图', label: '饼图' },*/}
            {/*  { value: '雷达图', label: '雷达图' },*/}
            {/*  { value: '仪表图', label: '仪表图' },*/}
            {/*]}>*/}
            {/*</Select>*/}
            <Row gutter={16}>
              {chartOptions.map((option) => (
                <Col span={6} key={option.value}>
                  <Card
                    hoverable
                    onClick={() => handleOptionClick(option.value)}
                    className={`chart-option ${option.value === selectedOption ? 'selected-option' : ''}`}
                  >
                    <div style={{ textAlign: 'center' }}>
                      {option.icon}
                      <div>{option.label}</div>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </Form.Item>

          <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
            <Space>
              <Button type="primary" htmlType="submit" loading={submitting} disabled={submitting}>
                智能分析
              </Button>
              <span style={{ fontSize: '12px', marginLeft: '8px' }}>消耗一次积分</span>
              <Button htmlType="reset">重置</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

    </div>
  );
};
export default AddChartAsyncUpgrade;
