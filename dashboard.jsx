import React from 'react';
import JSON5 from 'json5';
import ReactECharts from 'echarts-for-react';

const Dashboard = ({ responseObject }) => {
  // Parse responseObject
  const dataString = responseObject.replace(/```json|```/g, '').trim();
  let parsedData = null;
  try {
    parsedData = JSON5.parse(dataString);
  } catch (err) {
    console.error('JSON parse error:', err);
  }

  const kpis = parsedData?.KPIs || [];
  const charts = Object.values(parsedData?.charts || []);

  const renderKPIs = () => (
    <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '20px' }}>
      {kpis && kpis.map((kpi, index) => {
        const [key, value] = Object.entries(kpi)[0];
        return (
          <div key={index} style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '8px' }}>
            <h4>{key}</h4>
            <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{value}</p>
          </div>
        );
      })}
    </div>
  );

  const getChartOptions = (chartType, chartConfig) => {
    const isPieChart = chartType === 'pie';
  
    const commonOptions = {
      ...chartConfig,
      legend: {
        ...chartConfig.legend,
        top: '2%',
        bottom: '5%',
        left: 'center',
        orient: 'horizontal',
      },
      tooltip: {
        trigger: isPieChart ? 'item' : 'axis',
        axisPointer: isPieChart ? undefined : { type: 'shadow' },
      },
    };
  
    if (chartType === 'combination') {
      return {
        ...commonOptions,
        series: chartConfig.series.map(series => ({ ...series, type: series.type })),
      };
    } else if (chartType === 'stacked bar') {
      return {
        ...commonOptions,
        series: chartConfig.series.map(series => ({ ...series, type: 'bar', stack: 'total' })),
      };
    } else {
      return {
        ...commonOptions,
        series: chartConfig.series.map(series => ({ ...series, type: chartType })),
      };
    }
  };
  

  const renderCharts = () => (
    <div>
      {charts.map((item, index) => {
        const { message, chartConfig, chartType } = item;
        const options = getChartOptions(chartType, chartConfig);
        return (
          <div key={index} style={{ marginBottom: '40px' }}>
            <p>{message}</p>
            <ReactECharts option={options} style={{ height: '400px', width: '100%' }} />
          </div>
        );
      })}
    </div>
  );

  return (
    <div style={{ padding: '20px' }}>
      <h2>AI Data Dashboard</h2>
      {renderKPIs()}
      {renderCharts()}
    </div>
  );
};

export default Dashboard;
