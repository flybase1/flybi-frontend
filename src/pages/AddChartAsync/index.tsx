import {
  LockOutlined, UploadOutlined,
  UserOutlined,

} from '@ant-design/icons';

import {
  Alert, Button, Card, Checkbox,
  Col, Form, Input, message, Radio, Rate, Row, Select, Slider, Space, Spin, Switch, Tabs, Upload,
} from 'antd';
import React, { useEffect, useState } from 'react';


import { genChartAiAsyncMQUsingPOST, genChartAiAsyncUsingPOST } from '@/services/flybi/chartController';
import { useForm } from 'antd/es/form/Form';


/**
 * 添加图表
 * @constructor
 */
const AddChartAsync: React.FC = () => {
  const [chart, setChart] = useState<API.BIResponse>();
  const [form] = useForm();
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [option, setOption] = useState<any>(null);

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
    setOption(undefined);
    setChart(undefined);
    try {
      // 线程池genChartAiAsyncUsingPOST
      const res = await genChartAiAsyncMQUsingPOST(params, {}, values.file.file.originFileObj);
      if (!res.data) {
        message.error('分析失败');
      }
      message.success('分析任务提交成功，稍后在我的图表里面查看信息');
      form.resetFields();

    } catch (e: any) {
      message.error('分析失败,' + e.message);
    }
    setSubmitting(false);
  };

  return (
    <div className={'add-chart-async'}>
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
            <Select options={[
              { value: '折线图', label: '折线图' },
              { value: '柱状图', label: '柱状图' },
              { value: '堆叠图', label: '堆叠图' },
              { value: '饼图', label: '饼图' },
              { value: '雷达图', label: '雷达图' },
              { value: '仪表图', label: '仪表图' },
            ]}>
            </Select>
          </Form.Item>

          <Form.Item
            name="file"
            label="原始数据"
          >
            <Upload name="file" maxCount={1}>
              <Button icon={<UploadOutlined />}>上传CSV文件</Button>
            </Upload>
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
export default AddChartAsync;
