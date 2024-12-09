import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Try from './components/try';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Try />} />
   
      </Routes>
    </Router>
  );
}

export default App;
