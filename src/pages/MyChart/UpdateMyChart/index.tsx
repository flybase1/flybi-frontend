import {
  LockOutlined, UploadOutlined,
  UserOutlined,

} from '@ant-design/icons';

import {
  Alert, Button, Card, Checkbox,
  Col, Form, Input, message, Radio, Rate, Row, Select, Slider, Space, Spin, Switch, Tabs, Upload,
} from 'antd';
import React, { useEffect, useState } from 'react';

import { Helmet, history, useModel } from '@umijs/max';

import {
  deleteChartUsingPOST,
  genChartByAiUsingPOST,
  getChartByIdUsingGET,
  getChartDetailByIdUsingGET,

} from '@/services/flybi/chartController';
import { useForm } from 'antd/es/form/Form';
import { Link, useParams } from '@@/exports';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';


/**
 * 添加图表
 * @constructor
 */
const UpdateChartAsync: React.FC = () => {

    const [chart, setChart] = useState<API.BIResponse>();
    const [chartU, setUChart] = useState<API.Chart>();
    const [form] = useForm();
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [option, setOption] = useState<any>(null);
    const [dataId, setDataId] = useState<API.getChartByIdUsingGETParams>();

    const onFinish = async (values: any) => {
      console.log(values);
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
        message.success('分析任务提交成功，稍后在我的图表里面查看信息');
        form.resetFields();
        try {
          const deleteRes = await deleteChartUsingPOST({
            id: id,
          });
          if (deleteRes) {
            history.push('my_chart');
          }
        } catch (e: any) {

        }

      } catch (e: any) {
        message.error('分析失败,' + e.message);
      }
      setSubmitting(false);
    };

    const { id } = useParams();


    async function fetchData() {
      try {
        const res = await getChartByIdUsingGET({
          id: id,
        });
        setDataId(id);
        console.log(res.data);
        setUChart(res.data);
        setChart(res?.data);
        form.setFieldsValue({
          goal: res?.data?.goal,
          name: res?.data?.name,
          chartType: res?.data?.chartType,
        });
        const chartOption = JSON.parse(res?.data?.genChart ?? '{}');
        chartOption.title = undefined;
        // 设置图表组件的数据
        setOption(chartOption);
      } catch (e: any) {
        message.error('获取图表错误');
      }
    }


    useEffect(() => {
      fetchData();
    }, [id, form]);

    /*导出图片*/
    const handleExport = () => {
      if (option) {
        const chartContainer = document.getElementById('chart-container');
        if (chartContainer) {
          const chartInstance = echarts.getInstanceByDom(chartContainer);
          if (chartInstance) {
            chartInstance.setOption({
              title: {
                show: false,
              },
            });

            // 使用toDataURL方法将图表转换为Base64编码的图像数据
            const imageData = chartInstance.getDataURL({
              type: 'png', // 导出图片的格式，可以改为jpeg等其他格式
              pixelRatio: 1, // 导出图片的像素比例，根据需要调整
              backgroundColor: '#ffffff', // 导出图片的背景颜色，默认为透明
            });

            // 创建一个a标签，并设置其href属性为图像数据的URL
            const linkElement = document.createElement('a');
            linkElement.href = imageData;
            linkElement.download = 'chart.png'; // 图片文件的下载名称，根据需要修改

            // 触发a标签的点击事件，将图像数据下载为图片文件
            linkElement.click();
          }
        }
      }
    };


    function getChartDataById(dataId: any) {
      getChartDetailByIdUsingGET({
        id: dataId,
      });
    }

    return (
      <div className={'update-chart'}>
        <Row gutter={24}>
          <Col span={12}>
            <Card title={'智能分析'}>
              <Form
                name="add_chart"
                onFinish={onFinish}
                initialValues={{}}
                labelCol={{ span: 4 }}
                labelAlign={'left'}
                form={form}
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
                  name="data"
                  label="查看数据"
                >
                  <Button onClick={() => getChartDataById(dataId)}>
                    <Link to={`/chart_data/${dataId}`}>
                      查看原始数据
                    </Link>
                  </Button>
                </Form.Item>

                <Form.Item
                  name="file"
                  label="上传数据"
                >
                  <Upload name="file" maxCount={1}>
                    <Button icon={<UploadOutlined />}>上传CSV文件</Button>
                  </Upload>
                </Form.Item>
                <Form.Item wrapperCol={{ span: 10, offset: 6 }}>
                  <Space>
                    <Button htmlType="submit" loading={submitting} disabled={submitting}>
                      修改
                    </Button>
                    <Button htmlType="reset">重置</Button>
                    <Button type="primary"><Link to={'/my_chart'}>返回</Link></Button>
                  </Space>
                  <span>
                    <span style={{ fontSize: '12px', marginLeft: '8px' }}>消耗一次积分</span>
                  </span>
                </Form.Item>
              </Form>


            </Card>
          </Col>
          <Col span={12}>
            <Card title={'智能分析'}>
              {chart?.genResult ?? <div>请先提交</div>}
              <Spin spinning={submitting} />
            </Card>
            <Card title="可视化图表(右键点击保存)">
              {option ? (
                <React.Fragment>
                  <div id="chart-container">
                    <ReactECharts option={option} style={{ height: 300 }} opts={{ locale: 'FR' }} />
                  </div>
                </React.Fragment>
              ) : (
                <div>请先提交</div>
              )}
              <Spin spinning={submitting} />
            </Card>
          </Col>
        </Row>

      </div>
    );
  }
;
export default UpdateChartAsync;
