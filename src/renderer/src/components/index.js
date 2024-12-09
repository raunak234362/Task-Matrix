/* eslint-disable prettier/prettier */
import Login from './login/Login'

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
import AddUser from './dashboard//users/adduser/AddUser'
import AllUser from './dashboard/users/alluser/AllUser';
import MyProfile from './dashboard/users/myprofile/MyProfile';
import UsersTaskRecord from './dashboard/users/taskrecord/UsersTaskRecord'
import Calendar from './dashboard/users/calendar/Calendar'
import TaskRecord from './dashboard/users/taskrecord/TaskRecord'
import AddCSV from './dashboard/users/adduser/AddCSV'
import GaantChart from './dashboard/users/ghant/GaantChart'


//Tasks
import MyTask from './dashboard/tasks/mytask/MyTask';
import AddTask from './dashboard/tasks/addtask/AddTask'
import Task from './dashboard/tasks/Task'
import SelectedTask from './dashboard/tasks/alltasks/SelectedTask'
import AllTask from './dashboard/tasks/alltasks/AllTask'
import ApproveAssignee from './dashboard/tasks/approveassignee/ApproveAssignee'
import TaskSelected from './dashboard/tasks/approveassignee/TaskSelected'
import Approve from './dashboard/tasks/approveassignee/Approve'

//Projects
import AddProject from './dashboard/projects/addproject/AddProject'
import ManageTeam from './dashboard/projects/manageteam/ManageTeam'
import AddTeam from './dashboard/projects/addteams/AddTeam'
import Allprojects from './dashboard/projects/allprojects/Allprojects';
import Project from './dashboard/projects/allprojects/Project'
import EditProject from './dashboard/projects/allprojects/EditProject'
import TeamView from './dashboard/projects/manageteam/TeamView'
import BarView from './dashboard/projects/allprojects/BarView'
import BarViews from './dashboard/projects/allprojects/BarViews'
import FabricatorCharts from './dashboard/projects/allprojects/FabricatorChart'

//Fabricators
import Fabricator from './dashboard/fabricators/fabricator/Fabricator'
import AddFabricator from './dashboard/fabricators/addfabricator/AddFabricator'
import AllFabricators from './dashboard/fabricators/allfabricators/AllFabricators';
import ManageFabricator from './dashboard/fabricators/allfabricators/ManageFabricator'


//Charts
import ProjectPie from './dashboard/charts/ProjectPie'
import GhantChart from './dashboard/charts/GhantChart'
import GaantChartt from './dashboard/charts/GaantChartt'


export {
  AllUser,
  Project,
  BarViews,
  Toggle,
  AddCSV,
  BarView,
  GhantChart,
  GaantChart,
  GaantChartt,
  FabricatorCharts,
  MyProfile,
  EditProject,
  Login,
  Header,
  ManageFabricator,
  Task,
  Approve,
  AllTask,
  SelectedTask,
  TaskSelected,
  ApproveAssignee,
  UsersTaskRecord,
  CustomSelect,
  Input,
  TeamView,
  ProjectPie,
  MultiSelectCheckbox,
  AddTeam,
  MyTask,
  ManageTeam,
  TaskRecord,
  Button,
  AddProject,
  AddTask,
  AddUser,
  AddFabricator,
  Fabricator,
  Calendar,
  Layout,
  Sidebar,
  Home,
  AllFabricators,
  Allprojects
}
