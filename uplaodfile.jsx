// src/components/UploadPage.jsx
import React, { useState } from 'react';
import * as XLSX from 'xlsx';
// src/index.js or src/App.js
import 'bootstrap/dist/css/bootstrap.min.css';

import '../style/style.css';

import Dashboard from './Dashboard'; // Adjust the path as needed

const UploadPage = () => {
  const [jsonData, setJsonData] = useState('');
  //const [file, setFile] = useState(null);
  const [responseObject, setResponseObject] = useState(null); // Store response data
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB size check
        alert('File size exceeds 10MB limit.');
        return;
      }

      const reader = new FileReader();

      reader.onload = (evt) => {
        const data = evt.target.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(sheet);
        setJsonData(JSON.stringify(json, null, 2));
      };

      reader.readAsBinaryString(file);
    }
  };


  const handleUpload = async () => {
 
    setLoading(true);
 // console.log(jsonData);
 
    const jsonString = JSON.stringify(jsonData);

      const prompt = `
       You are tasked with analyzing a dataset provided in JSON format and generating visualizations and KPIs based on the analysis. Follow these steps:

1. Analyze the JSON data:
   - Extract the data type from the classification result.
   - Count the number of rows and columns in the cleaned data.
   - Determine the feature types from the classification result.

2. Determine the appropriate visualization type:
   - If the data is numerical and has 1 feature, use a Histogram.
   - If the data is numerical and has 2 features, use a Scatter Plot.
   - If the data is categorical and has 1 feature, use a Bar Chart.
   - If the data is categorical and has 2 features, use a Grouped/Stacked Bar Chart.
   - If the data is time-series, use a Line Chart.
   - If the data has mixed types, use a Combination Chart (e.g., scatter + bar).
   - If none of the above conditions are met, use a Table as a fallback.

3. Generate Key Performance Indicators (KPIs):
   - Create an object with "data" containing labels and values based on numeric columns in the JSON data.

4. Create a JSON object for the chart:
   - Include a "message" explaining the chart.
   - Provide a "chartConfig" with ECharts configuration, including xAxis, yAxis, series, and legend.
   - Specify the "chartType" based on the determined visualization type.

5. Ensure the chart is interactive:
   - Add hover effects and click handlers to the chart configuration.

6. Respond with the JSON object in string format:
   - Do not include any additional text outside the JSON object.

Use the actual data from the provided dataset to generate the chart and KPIs. Ensure the chart is well-configured and interactive. Respond with the JSON object in string format only.  data : ${jsonString}`;


      const key = "iIlAMndlLC6KyAnSNRBMAI6IAkToikpWf7wDCyi9tRNGIaHr";


            const baseUrl = "https://stg1.mmc-dallas-int-non-prod-ingress.mgti.mmc.com/coreapi/openai/v1/deployments/mmc-tech-gpt-4o-mini-128k-2024-07-18/chat/completions";


       

      try {
        const response = await fetch(baseUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${key}`,
          },
          body: JSON.stringify({
            model: 'mmc-tech-gpt-4o-mini-128k-2024-07-18',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.2,
            max_tokens: 2000,
          }),
        });
        const data = await response.json();
        const responseObject = data.choices[0].message.content;
        setResponseObject(responseObject); // Save response to state
      } catch (err) {
        alert('Error calling API');
      }
      setLoading(false);
    
    //reader.readAsText(file);
  };

  if (responseObject) {
    // Render the Dashboard directly
    return <Dashboard responseObject={responseObject} />;
  }

  return (
    <div id="UploadFileContainer">
    


    <section className="upload-section" >
        <div className="container">
            <div className="row">
                <div className="col-12">
                    <div className="text-center mb-4">
                        <h2 className="section-title">Upload Your Excel File</h2>
                        <p className="section-subtitle">Upload your .xlsx file and let AI create your dashboard</p>
                    </div>
              
                    <div className="upload-card" id="uploadCard">
                        <div className="text-center">
                            <i className="fas fa-cloud-upload-alt upload-icon"></i>
                            <h4 className="mb-3">Drag & Drop Your Excel File</h4>
                            <p className="text-muted mb-4">or click to browse</p>
                            
                            <input  type="file" id="fileInput" accept=".xlsx,.xls"  onChange={handleFileChange}
                            
                            
                            />
                               <button onClick={handleUpload} disabled={loading}>
                                  {loading ? 'Processing...' : 'Upload & Analyze'}
                                </button>
                            
                            <div className="mt-4">
                                <small className="text-muted">
                                    <i className="fas fa-info-circle"></i>
                                    Supported formats: .xlsx, .xls | Max file size: 10MB
                                </small>
                            </div>
                        </div>
                    </div>
               
                    <div className="upload-card" id="loadingCard" >
                        <div className="text-center">
                            <div className="loading-spinner"></div>
                            <h5>Processing Your Data...</h5>
                            <p className="text-muted">
                                Our AI is analyzing your Excel file and generating intelligent visualizations. 
                                This usually takes 30-60 seconds.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
 
    {jsonData && (
        <div id="Data_object" >
          <h3>JSON Output:</h3>
          <pre>{jsonData}</pre>
        </div>
      )}
    </div>
  );
}

export default UploadPage;
