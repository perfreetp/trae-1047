import { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { TrendingUp, Users, Clock, Star, AlertTriangle, FileCheck, BarChart3, MessageSquare } from 'lucide-react';
import { mockStatistics, mockEvaluations } from '@/mock/applications';
import StatCard from '@/components/common/StatCard';

export default function Statistics() {
  const [activeTab, setActiveTab] = useState('overview');

  const monthlyTrendOption = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e5e7eb',
      borderWidth: 1,
      textStyle: { color: '#374151' }
    },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      data: mockStatistics.monthlyTrend.map((item) => item.month),
      axisLine: { lineStyle: { color: '#e5e7eb' } },
      axisLabel: { color: '#6b7280' }
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      splitLine: { lineStyle: { color: '#f3f4f6' } },
      axisLabel: { color: '#6b7280' }
    },
    series: [
      {
        data: mockStatistics.monthlyTrend.map((item) => item.count),
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: { color: '#165DFF', width: 3 },
        itemStyle: { color: '#165DFF' },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(22, 93, 255, 0.2)' },
              { offset: 1, color: 'rgba(22, 93, 255, 0.02)' }
            ]
          }
        }
      }
    ]
  };

  const departmentOption = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e5e7eb',
      borderWidth: 1,
      textStyle: { color: '#374151' }
    },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'value',
      axisLine: { show: false },
      splitLine: { lineStyle: { color: '#f3f4f6' } },
      axisLabel: { color: '#6b7280' }
    },
    yAxis: {
      type: 'category',
      data: mockStatistics.departmentStats.map((item) => item.department),
      axisLine: { lineStyle: { color: '#e5e7eb' } },
      axisLabel: { color: '#6b7280' }
    },
    series: [
      {
        data: mockStatistics.departmentStats.map((item) => item.count),
        type: 'bar',
        barWidth: '60%',
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [
              { offset: 0, color: '#165DFF' },
              { offset: 1, color: '#4080FF' }
            ]
          },
          borderRadius: [0, 4, 4, 0]
        }
      }
    ]
  };

  const categoryOption = {
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e5e7eb',
      borderWidth: 1,
      textStyle: { color: '#374151' }
    },
    legend: {
      orient: 'vertical',
      right: '5%',
      top: 'center',
      textStyle: { color: '#6b7280' }
    },
    series: [
      {
        name: '办件量',
        type: 'pie',
        radius: ['45%', '70%'],
        center: ['35%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 8,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: { show: false },
        emphasis: {
          label: { show: true, fontSize: 14, fontWeight: 'bold' }
        },
        labelLine: { show: false },
        data: mockStatistics.categoryStats.map((item, index) => ({
          value: item.count,
          name: item.category,
          itemStyle: {
            color: ['#165DFF', '#36CFC9', '#722ED1', '#F7BA1E', '#F53F3F'][index % 5]
          }
        }))
      }
    ]
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">评价统计</h1>
          <p className="text-gray-600">查看办件统计数据和满意度评价</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <StatCard
            title="总办件量"
            value={mockStatistics.totalApplications.toLocaleString()}
            icon={<FileCheck className="w-6 h-6" />}
            color="blue"
          />
          <StatCard
            title="今日办件"
            value={mockStatistics.todayApplications}
            icon={<TrendingUp className="w-6 h-6" />}
            color="green"
          />
          <StatCard
            title="已办结"
            value={mockStatistics.completedApplications.toLocaleString()}
            icon={<Users className="w-6 h-6" />}
            color="purple"
          />
          <StatCard
            title="平均时长"
            value={`${mockStatistics.averageTime}天`}
            icon={<Clock className="w-6 h-6" />}
            color="orange"
          />
          <StatCard
            title="满意度"
            value={`${mockStatistics.satisfactionRate}%`}
            icon={<Star className="w-6 h-6" />}
            color="yellow"
          />
          <StatCard
            title="超时预警"
            value={mockStatistics.overdueCount}
            icon={<AlertTriangle className="w-6 h-6" />}
            color="red"
          />
        </div>

        <div className="flex gap-2 mb-6">
          <button
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'overview'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
            onClick={() => setActiveTab('overview')}
          >
            <BarChart3 className="w-4 h-4 inline mr-2" />
            数据总览
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'evaluations'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
            onClick={() => setActiveTab('evaluations')}
          >
            <MessageSquare className="w-4 h-4 inline mr-2" />
            满意度评价
          </button>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">月度办件趋势</h3>
              <ReactECharts option={monthlyTrendOption} style={{ height: '300px' }} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-4">部门办件量统计</h3>
                <ReactECharts option={departmentOption} style={{ height: '350px' }} />
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-4">事项分类占比</h3>
                <ReactECharts option={categoryOption} style={{ height: '350px' }} />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'evaluations' && (
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">满意度评价列表</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {mockEvaluations.map((evaluation) => (
                <div key={evaluation.id} className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">{evaluation.itemName}</h4>
                      <p className="text-sm text-gray-500">
                        评价人：{evaluation.applicantName} | {evaluation.createTime}
                      </p>
                    </div>
                    <div className="flex">{renderStars(evaluation.rating)}</div>
                  </div>
                  <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">{evaluation.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
