import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Todo from './components/Todo';

function App() {
  const headStyle = {
    textAlign: "center",
  }
  return (
    <div>
       <BrowserRouter>
        <Routes>
          <Route path='/' element={<Todo />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
