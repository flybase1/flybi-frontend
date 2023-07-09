import {
  CaretLeftOutlined, CaretRightOutlined,
  LockOutlined, UploadOutlined,
  UserOutlined,

} from '@ant-design/icons';

import {
  Alert, Avatar,
  Button,
  Card,
  Checkbox,
  Col,
  Collapse, Descriptions,
  Divider,
  Form,
  Input,
  InputNumber,
  message,
  Radio,
  Rate,
  Row,
  Select,
  Slider,
  Space,
  Spin,
  Switch,
  Tabs,
  Upload,
} from 'antd';
import React, { useEffect, useState } from 'react';


import ReactECharts from 'echarts-for-react';
import { boolean } from '@umijs/utils/compiled/zod';
import { any } from 'prop-types';
import { genChartByAiUsingPOST } from '@/services/flybi/chartController';
import { getAiModelByIdUsingGET, listAiModelUsingPOST, testUsingGET } from '@/services/flybi/aiModelController';
import { history } from '@umijs/max';
import { async } from 'rxjs';

/**
 * 添加图表
 * @constructor
 */
const AddChart: React.FC = () => {
  const [chart, setChart] = useState<API.BIResponse>();
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [option, setOption] = useState<any>(null);
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
    setOption(undefined);
    setChart(undefined);
    try {
      const res = await genChartByAiUsingPOST(params, {}, values.file.file.originFileObj);
      if (!res.data) {
        message.error('分析失败');
      }
      message.success('分析成功');
      const chartOption = JSON.parse(res?.data.genChart ?? '');
      // todo 存入session
      localStorage.setItem('chartId', res?.data?.chartId + '');
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

  function returnToHome() {
    history.back();
  }

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
    <div className={'add-chart'}>
      <Button onClick={() => returnToHome()}>
        返回
      </Button>
      <Row>
        <Col span={showInfoPanel ? 18 : 24}>
          <Row gutter={24}>
            <Col span={12}>
              <Divider />
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
              <Divider />
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
        </Col>
        <Col span={showInfoPanel ? 6 : 0}>
          <Divider />
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
export default AddChart;
