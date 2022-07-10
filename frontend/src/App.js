import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Landing, Register, ProtectedRoute } from './pages';
import { AddTask, AllTasks, Profile, SharedLayout } from './pages/home';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={
            <ProtectedRoute>
              <SharedLayout/>
            </ProtectedRoute>
        }>
          <Route path='all-tasks' element={<AllTasks/>}/>
          <Route path='add-task' element={<AddTask/>}/>
          <Route path='profile' element={<Profile/>}/>
        </Route>
        <Route path='/landing' element={<Landing/>}/>
        <Route path='/register' element={<Register/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
