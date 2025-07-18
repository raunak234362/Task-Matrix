/* eslint-disable prettier/prettier */
import Login from "./login/Login";
import ChangePassword from "./login/ChangePassword.jsx";
//Fields
import Button from "./fields/Button";
import Input from "./fields/Input";
import CustomSelect from "./fields/Select";
import MultiSelectCheckbox from "./fields/MultiSelectCheckbox";
import Toggle from "./fields/Toggle";

//Dashboard
import Sidebar from "./Sidebar";
import Home from "./main/Home.jsx";
import Layout from "./Layout";
import Header from "./Header";

//chats
import Chats from "./chats/Chats.jsx";

//Users
import AllUser from "./users/alluser/AllUser";
import MyProfile from "./users/myprofile/MyProfile";
//import UsersTaskRecord from './dashboard/users/taskrecord/UsersTaskRecord'
// import Calendar from './dashboard/users/calendar/Calendar'
import TaskRecord from "./users/taskrecord/TaskRecord";
import AddCSV from "./users/adduser/AddCSV";
import GaantChart from "./users/ghant/GaantChart";
import UserTab from "./users/user/UserTab.jsx";

//Tasks
import MyTask from "./tasks/mytask/MyTask.jsx";
import AddTask from "./tasks/addtask/AddTask.jsx";
import Task from "./tasks/Task.jsx";
import SelectedTask from "./tasks/alltasks/SelectedTask.jsx";
import AllTask from "./tasks/alltasks/AllTask.jsx";
import TaskSelected from "./tasks/approveassignee/TaskSelected.jsx";
import TaskTab from "../pages/task/TaskTab.jsx";
import EditTask from "./tasks/editTask/EditTask.jsx";

//Projects
import Allprojects from "./projects/allprojects/Allprojects.jsx";
import Project from "./projects/allprojects/Project.jsx";
import BarView from "./projects/allprojects/BarView.jsx";
import BarViews from "./projects/allprojects/BarViews.jsx";
import FabricatorCharts from "./projects/allprojects/FabricatorChart.jsx";
import ProjectStats from "./projects/stats/ProjectStats.jsx";
import ProjectTab from "../pages/project/ProjectTab.jsx";

//Charts
import ProjectPie from "./charts/ProjectPie.jsx";
import GhantChart from "./charts/GhantChart.jsx";
import GaantChartt from "./charts/GaantChartt.jsx";

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
  AllTask,
  TaskTab,
  SelectedTask,
  TaskSelected,
  // UsersTaskRecord,
  CustomSelect,
  Input,
  Chats,
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
  Allprojects,
};
