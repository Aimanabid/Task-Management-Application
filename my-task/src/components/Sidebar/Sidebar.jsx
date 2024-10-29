import React from 'react'
import { Link } from 'react-router-dom'

const Sidebar = () => {
  return (
    <>
     <div className="col-2 sidebar text-center">
          <h5 className='my-5'>Task Manager</h5>
          <ul>
            <Link to ='/dashboard' style={{color: 'white',textDecoration :'none'}}><li>Dashboard</li></Link>
            <Link to='/tasks' style={{color: 'white',textDecoration :'none'}}><li >My Tasks</li></Link>

          </ul>
        </div> 
    </>
  )
}

export default Sidebar
