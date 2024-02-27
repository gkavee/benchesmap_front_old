import './App.css';
import BenchesMap from './components/Map/BenchesMap';
// import BenchesList from './components/BenchesList/BenchesList';
import AuthComponent from './components/Auth/AuthComponent';
import CreateBenchModal from './components/Map/CreateBenchModal';

function App() {

  return (
    <>
      <BenchesMap />
      {/* <BenchesList /> */}
      <AuthComponent />
      <CreateBenchModal />
    </>
  )
}

export default App
