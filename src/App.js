import logo from './logo.svg';
import './App.css';
// import OptionWidthViz2 from './components/telegraph-visuals/optionWidths2';
// import OptionWidthViz from './components/telegraph-visuals/optionWidths';
// import TelegraphTable from './components/telegraph-visuals/TelegraphTable';

import ProjectsByType from './components/construction-visuals/projectsByType';
// import ProjectsByFund from './components/construction-visuals/projectsByFunding';
import ProjectsByFundRe from './components/construction-visuals/projectsByFundingBar';
// import ProjectsMap from './components/construction-visuals/projectsMap';
import ProjectsByValuation from './components/construction-visuals/projectsByValuationMap';
import RHNABarChart from './components/construction-visuals/RHNABarChart';

import BayPassCalculator from './components/baypass-visuals/BayPassCalculator';

function App() {
  return (
    <div className="App">
      <a href='https://berkeleyca.gov/your-government/our-work/capital-projects'>link1 (data)</a>
      <br></br>
      <a href='https://capitalstrategies.berkeley.edu/capital-projects/construction'>link2 (images?)</a>
      {/* baypass calculator */}
      <BayPassCalculator />
      {/* valuation map */}
      {/* < ProjectsByValuation /> */}
      {/* RHNA chart */}
      {/* < RHNABarChart /> */}
      {/* funding source bar chart */}
      {/* < ProjectsByFundRe /> */}

      {/* < ProjectsByFund /> */}


      {/* < ProjectsByType /> */}
      {/* < ProjectsMap /> */}
    </div>
  );
}

export default App;
