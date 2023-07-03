import {
  LockOutlined, UploadOutlined,
  UserOutlined,

} from '@ant-design/icons';

import {
  Alert, Button, Card, Checkbox,
  Col, Form, Input, InputNumber, message, Radio, Rate, Row, Select, Slider, Space, Spin, Switch, Tabs, Upload,
} from 'antd';
import React, { useEffect, useState } from 'react';


import ReactECharts from 'echarts-for-react';
import { boolean } from '@umijs/utils/compiled/zod';
import { any } from 'prop-types';
import { genChartByAiUsingPOST } from '@/services/flybi/chartController';

/**
 * 添加图表
 * @constructor
 */
const AddChart: React.FC = () => {
  const [chart, setChart] = useState<API.BIResponse>();
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [option, setOption] = useState<any>(null);

  /*  useEffect(() => {
      listChartByPageUsingPOST({}).then(result => {
        console.log(result);
      });
    });*/

  /*  const option = {
      title: {
        text: 'ECharts 入门示例'
      },
      toolbox: {
        feature: {
          saveAsImage: {},
          dataZoom: {},
          restore: {}
        }
      },
      tooltip: {},
      legend: {
        data:['销量']
      },
      xAxis: {
        data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
      },
      yAxis: {},
      series: [{
        name: '销量',
        type: 'line',
        data: [5, 20, 36, 10, 10, 20]
      }]
    };*/


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
      const res = await genChartByAiUsingPOST(params, {}, values.file.file.originFileObj);
      if (!res.data) {
        message.error('分析失败');
      }
      message.success('分析成功');


      const chartOption = JSON.parse(res?.data.genChart ?? '');
      if (!chartOption) {
        throw new Error('图表代码解析失败');
      } else {
        setChart(res.data);
        setOption(chartOption);
      }
      console.log(res);
    } catch (e: any) {
      message.error('分析失败,' + e.message);
    }
    setSubmitting(false);
  };

  return (
    <div className={'add-chart'}>
      <Row gutter={24}>
        <Col span={12}>
          <Card title={'智能分析'}>
            <Form
              name="add_chart"
              onFinish={onFinish}
              initialValues={{}}
              labelCol={{ span: 4 }}
              labelAlign={'left'}
            >

              <Form.Item name={'goal'} label={'分析目标'} rules={[{ required: true, message: '请输入你的图表类型' }]}>
                <Input placeholder={'请输入你的分析需求,比如分析网站增长情况'} />
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

              <Form.Item wrapperCol={{ span: 16, offset: 4 }}>
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
        </Col>
        <Col span={12}>
          <Card title={'智能分析'}>
            {chart?.genResult ?? <div>请先提交</div>}
            <Spin spinning={submitting} />
          </Card>
          <Card title={'可视化图表'}>
            {
              option ? <ReactECharts option={option} style={{ height: 400 }} opts={{ locale: 'FR' }} /> :
                <div> 请先提交</div>
            }
            <Spin spinning={submitting} />
          </Card>
        </Col>
      </Row>

    </div>
  );
};
export default AddChart;
