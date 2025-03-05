/* eslint-disable prettier/prettier */
import Login from './login/Login'
import ChangePassword from './login/ChangePassword.jsx'
//Fields  
import Button from './fields/Button'
import Input from './fields/Input'
import CustomSelect from './fields/Select'
import MultiSelectCheckbox from './fields/MultiSelectCheckbox'
import Toggle from './fields/Toggle'

//Dashboard
import Sidebar from './dashboard/Sidebar'
import Home from './dashboard/main/Home'
import Layout from './Layout'
import Header from './dashboard/Header'

//Users
import AllUser from './dashboard/users/alluser/AllUser';
import MyProfile from './dashboard/users/myprofile/MyProfile';
//import UsersTaskRecord from './dashboard/users/taskrecord/UsersTaskRecord'
// import Calendar from './dashboard/users/calendar/Calendar'
 import TaskRecord from './dashboard/users/taskrecord/TaskRecord'
import AddCSV from './dashboard/users/adduser/AddCSV'
import GaantChart from './dashboard/users/ghant/GaantChart'
import UserTab from './dashboard/users/user/UserTab.jsx'

//Tasks
import MyTask from './dashboard/tasks/mytask/MyTask';
import AddTask from './dashboard/tasks/addtask/AddTask'
import Task from './dashboard/tasks/Task'
import SelectedTask from './dashboard/tasks/alltasks/SelectedTask'
import AllTask from './dashboard/tasks/alltasks/AllTask'
import ApproveAssignee from './dashboard/tasks/approveassignee/ApproveAssignee'
import TaskSelected from './dashboard/tasks/approveassignee/TaskSelected'
import Approve from './dashboard/tasks/approveassignee/Approve'
import TaskTab from './dashboard/tasks/task/TaskTab.jsx'
import EditTask from './dashboard/tasks/editTask/EditTask.jsx'

//Projects
import Allprojects from './dashboard/projects/allprojects/Allprojects';
import Project from './dashboard/projects/allprojects/Project'
import BarView from './dashboard/projects/allprojects/BarView'
import BarViews from './dashboard/projects/allprojects/BarViews'
import FabricatorCharts from './dashboard/projects/allprojects/FabricatorChart'
import ProjectStats from './dashboard/projects/stats/ProjectStats.jsx'
import ProjectTab from './dashboard/projects/project/ProjectTab.jsx'


//Charts
import ProjectPie from './dashboard/charts/ProjectPie'
import GhantChart from './dashboard/charts/GhantChart'
import GaantChartt from './dashboard/charts/GaantChartt'


export {
  AllUser,
  Project,
  ProjectStats,
  ProjectTab,
  BarViews,
  UserTab,
  ChangePassword,
  Toggle,
  AddCSV,
  BarView,
  GhantChart,
  GaantChart,
  GaantChartt,
  FabricatorCharts,
  MyProfile,
  Login,
  Header,
  Task,
  Approve,
  AllTask,
  TaskTab,
  SelectedTask,
  TaskSelected,
  ApproveAssignee,
  // UsersTaskRecord,
  CustomSelect,
  Input,
  ProjectPie,
  MultiSelectCheckbox,
  MyTask,
  EditTask,
  TaskRecord,
  Button,
  AddTask,
  Layout,
  Sidebar,
  Home,
  Allprojects
}
