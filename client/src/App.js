import { useState } from 'react';
import Upload from './Upload';
import Files from './Files';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {
  const [refresh, setRefresh] = useState(false);
  return (
    <div className="App">
      <CssBaseline />
      <Container maxWidth="sm">
        <Upload
          toast={toast.success}
          refresh={refresh}
          setRefresh={setRefresh}
        />
        <Files refresh={refresh} setRefresh={setRefresh} />
      </Container>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
        theme="light"
      />
    </div>
  );
}

export default App;
