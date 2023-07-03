import React, { useEffect, useState } from 'react';
import {
  deleteChartUsingPOST,
  listMyChartByPageUsingPOST,
} from '@/services/flybi/chartController';
import { Avatar, Button, Card, List, message, Modal, Result } from 'antd';
import ReactECharts from 'echarts-for-react';
import { Link, useModel } from '@@/exports';
import { Input } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { Search } = Input;


/**
 * 我的图表
 * @constructor
 */
const MyChartPage: React.FC = () => {
  const initSearchParams = {
    current: 1,
    pageSize: 4,
    sortField: 'createTime',
    sortOrder: 'desc',
  };
  const [searchParams, setSearchParams] = useState<API.ChartQueryRequest>({
    ...initSearchParams,
  });
  const [chartList, setChartList] = useState<API.Chart[]>();
  const [total, setTotal] = useState<number>(0);
  const { initialState, setInitialState } = useModel('@@initialState');
  const { currentUser } = initialState ?? {};
  const [loading, setLoading] = useState<boolean>(true);
  const [dLoading, setDLoading] = useState<boolean>(false);
  const [fLoading, setFLoading] = useState<boolean>(false);

  const [showCard, setShowCard] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [status, setStatus] = useState<string>();

  function updateById(id: any) {
    setSelectedItemId(id);
    setShowCard(true);
  }

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await listMyChartByPageUsingPOST(searchParams);
      if (res.data) {
        setChartList(res.data.records ?? []);
        setTotal(res.data.total ?? 0);
        /*隐藏图表title*/
        if (res.data.records) {
          res.data.records.forEach(data => {
            if (data.status === 'succeed') {
              const chartOption = JSON.parse(data.genChart ?? '{}');
              chartOption.title = undefined;
              data.genChart = JSON.stringify(chartOption);
            }
          });
        }
      } else {
        message.error('获取图表失败');
      }
    } catch (e: any) {
      message.error('获取我的图表失败,' + e.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [searchParams]);

  /**
   * 设置时间日期格式化
   * @param dateTimeString
   */
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

  /*  const deleteChartById = () => {
      deleteChartUsingPOST()
    };*/

  function deleteByChartId(id: any) {
    Modal.confirm({
      title: '确认删除吗',
      icon: <ExclamationCircleOutlined />,
      content: '确定要删除这个图表吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        setDLoading(true);
        const res = deleteChartUsingPOST({ id: id });
        if (!res) {
          setDLoading(false);
          message.error('删除失败');
        }
        message.loading('正在删除中');
        setDLoading(true);
        setTimeout(() => {
          loadData();
          message.success('删除成功');
        }, 2000);
        setDLoading(false);

        // window.location.reload();
      },
    });

  }

  function flushList() {
    setFLoading(true);
    message.loading('正在刷新中');
    setTimeout(() => {
      loadData();
      message.success('刷新成功');
    }, 2000);
  }

  useEffect(() => {
    flushList();
  }, []);

  return (
    <div className={'my-chart-page'}>
      <div>
        <Search placeholder="请输入图表名称" loading={loading} enterButton onSearch={(value) => {
          setSearchParams({
            ...initSearchParams,
            name: value,
          });
        }} />
      </div>
      <div className={'margin-16'}>
      </div>
      <Card>
        <Button onClick={flushList}>
          刷新
        </Button>
      </Card>
      <List
        itemLayout="vertical"
        pagination={{
          onChange: (page, pageSize) => {
            setSearchParams({
              ...searchParams,
              current: page,
              pageSize: pageSize,
            });
          },
          current: searchParams.current,
          pageSize: searchParams.pageSize,
          total: total,
        }}
        grid={{ gutter: 16, xs: 1, sm: 1, md: 1, lg: 2, xl: 2, xxl: 2 }}
        dataSource={chartList}
        loading={loading}
        renderItem={(item) => (
          <List.Item
            key={item.id}
          >
            <Card>
              <List.Item.Meta
                avatar={<Avatar src={currentUser?.userAvatar} />}
                title={'图表名: ' + item.name}
                description={item.chartType ? ('图表类型: ' + item.chartType) : undefined}
              />
              <>
                {
                  item.status === 'succeed' && <>
                    {'分析目标 : ' + item.goal}
                    <div style={{ marginBottom: 16 }} />
                    {'分析时间 : ' + formatDate(item.createTime)}
                    <div style={{ marginBottom: 16 }} />
                    <Card>
                      <ReactECharts option={JSON.parse(item.genChart ?? '{}')} style={{ height: 300 }}
                                    opts={{ locale: 'FR' }} />
                    </Card>
                    <Card>
                      {'分析结果 : ' + item.genResult}
                    </Card>
                  </>
                }

                {
                  item.status === 'failed' && <>
                    <Result
                      status={'error'}
                      title={'图表生成失败'}
                      subTitle={item.execMessage}>
                    </Result>
                    <Button>
                      重试
                    </Button>
                  </>
                }
                {
                  item.status === 'running' && <>
                    <Result
                      status={'info'}
                      title={'图表生成中'}
                      subTitle={item.execMessage} />
                  </>
                }
                {
                  item.status === 'wait' && <>
                    <Result
                      status={'warning'}
                      title={'待生成'}
                      subTitle={item.execMessage ?? '当前图表生成队列繁忙，请耐心等待'} />
                  </>
                }

              </>
            </Card>

            <Card>
              <Button onClick={() => deleteByChartId(item.id)} loading={dLoading}>
                删除图表
              </Button>
              <Button onClick={() => updateById(item.id)}>
                <Link to={`/update_chart/${item.id}`}>
                  修改图表
                </Link>
              </Button>

            </Card>
          </List.Item>
        )}

      />
      <br />
      总数
      {total}
    </div>
  );
};


export default MyChartPage;
