/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import api from "./api";
import { BASE_URL } from "../config/constant";
const token = sessionStorage.getItem("token");
class Service {
  // Fetch the logged-in user - updated
  static async getCurrentUser() {
    const token = sessionStorage.getItem("token");
    try {
      const response = await api.post(`/api/auth/getuserbytoken`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response?.data?.data;
    } catch (error) {
      console.log("Error finding Current user:", error);
      throw error;
    }
  }

  // Change password-updated -- updated
  static async changePassword(token, data) {
    try {
      const response = await api.post(`/api/auth/resetpassword/`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      });
      return response;
    } catch (error) {
      console.log("Error changing password:", error);
      return error;
    }
  }

  static async allEmployee(token) {
    try {
      const response = await api.get(`/api/employee/employee`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log(response?.data);
      return response.data?.data;
    } catch (error) {
      console.log("Error fetching employees:", error);
      throw error;
    }
  }

  static async getAllTeam() {
    const token = sessionStorage.getItem("token");
    try {
      const resonse = await api.get(`/api/team/teams/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return resonse?.data?.data;
    } catch (error) {
      console.log("Error in getting team list: ", error);
      throw error;
    }
  }

  static async getTeam(projectId) {
    const token = sessionStorage.getItem("token");
    try {
      const response = await api.get(`/api/team/teams/${projectId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.log("Error in getting team: ", error);
      throw error;
    }
  }

  static async getTeamMember(projectId) {
    console.log(projectId);
    const token = sessionStorage.getItem("token");
    try {
      const response = await api.get(
        `/api/team/teams/${projectId}/add_members/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      console.log("Team Member fetched: ", response.data);
      return response.data;
    } catch (error) {
      console.log("Error in getting team member: ", error);
      throw error;
    }
  }

  static async addTeamMember({ role, employee, teamId }) {
    console.log(role, employee, teamId);
    try {
      const formData = {
        role,
        employee,
      };
      console.log("---------------");

      const token = sessionStorage.getItem("token");
      const response = await api.post(
        `/api/team/teams/${teamId}/add_member/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      console.log("Successfully Added Team Member: ", response.data);
      return response.data;
    } catch (error) {
      console.log("Error Adding members: ", error);
      throw error;
    }
  }

  static async getAllProject() {
    const token = sessionStorage.getItem("token");
    try {
      const response = await api.get(`/api/project/projects`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response?.data?.data;
    } catch (error) {
      console.log("Error in getting Project List: ", error);
      throw error;
    }
  }
  static async getProject(id) {
    const token = sessionStorage.getItem("token");
    try {
      const response = await api.get(`/api/project/projects/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response?.data?.data;
    } catch (error) {
      console.log("Error in getting Project:", error);
      throw error;
    }
  }

  //Task APIs
  static async getTask() {
    const token = sessionStorage.getItem("token");
    try {
      const response = await api.get(`/api/task/task/my_tasks/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.log("Error in getting Task: ", error);
      throw error;
    }
  }

  static async getMyTask() {
    const token = sessionStorage.getItem("token");
    try {
      const response = await api.get(`/api/task/tasks/my_tasks`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = response?.data?.data;
      // console.log('My Task list: ', data)
      return data;
    } catch (error) {
      console.log("Error in getting Task: ", error);
      throw error;
    }
  }
  static async getTaskById(Id) {
    const token = sessionStorage.getItem("token");
    try {
      const response = await api.get(`/api/task/tasks/${Id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response?.data?.data?.task;
    } catch (error) {
      console.log("Error in getting Task: ", error);
      throw error;
    }
  }
  static async getAllTask() {
    const token = sessionStorage.getItem("token");
    try {
      const response = await api.get(`/api/task/tasks/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response?.data?.data;
    } catch (error) {
      console.log("Error in getting Task: ", error);
      throw error;
    }
  }

  static async getAllMyTask() {
    const token = sessionStorage.getItem("token");
    try {
      const response = await api.get(`/api/task/task/all_my_tasks/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response?.data?.data;
    } catch (error) {
      console.log("Error in getting Task: ", error);
      throw error;
    }
  }

  static async getParentTasks(id) {
    const token = sessionStorage.getItem("token");
    try {
      const response = await api.get(`/api/task/tasks/?project=${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.data?.data;
      return data;
    } catch (error) {
      console.log("Error in getting Parent Task: ", error);
      throw error;
    }
  }
  static async addTask({
    name,
    description,
    due_date,
    start_date,
    status,
    priority,
    hour,
    min,
    project,
    Stage,
    user,
  }) {
    try {
      const formData = {
        name,
        description,
        due_date,
        start_date,
        status,
        priority,
        Stage,
        duration: `${hour}:${min}:00`,
        project,
        user,
      };

      console.log(formData);

      const token = sessionStorage.getItem("token");

      // Using api to make the POST request
      const response = await api.post(`/api/task/tasks/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "Application/json",
        },
      });

      console.log(response.data);
      return response.data?.data; // Return the response data
    } catch (error) {
      console.log("Error in adding Task: ", error);
      throw error; // Rethrow the error after logging
    }
  }
  static async editTask(id, taskData) {
    console.log(taskData);
    const token = sessionStorage.getItem("token");
    try {
      const response = await api.patch(`/api/task/tasks/${id}/`, taskData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "Application/json",
        },
      });
      return response.data?.data;
    } catch (error) {
      console.log("Error in getting Project:", error);
      throw error;
    }
  }
  static async deleteTask(id) {
    const token = sessionStorage.getItem("token");
    try {
      const response = await api.delete(`/api/task/tasks/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "Application/json",
        },
      });
      if (response) return true;
      return false;
    } catch (error) {
      console.log("Error in getting Project:", error);
      throw error;
    }
  }
  static async taskRecord(user) {
    console.log(user);
    const token = sessionStorage.getItem("token");
    try {
      const response = await api.get(`/api/user/record?user=${user}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      console.log("Task Record: ", data);
      return data;
    } catch (error) {
      console.log("Error in getting Task Record: ", error);
      throw error;
    }
  }

  static async userTaskRecord() {
    const token = sessionStorage.getItem("token");
    try {
      const response = await api.get(`/api/task/tasks/my_task_records/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data.data;
    } catch (error) {
      console.log("Error in getting Task Record: ", error);
      throw error;
    }
  }

  static async getWorkHours(task_id) {
    const token = sessionStorage.getItem("token");
    try {
      const response = await api.get(`/api/wh/wh/${task_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      return response.data.data;
    } catch (error) {
      console.log("Error in getting Work ID:", error);
      throw error;
    }
  }

  static async startTask(task_id) {
    const formData = { task_id };
    const token = sessionStorage.getItem("token");
    try {
      const response = await api.post(`/api/wh/wh/start/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log("Start Task: ", response);
      return response.data;
    } catch (error) {
      console.log("Error in getting Project:", error);
      throw error;
    }
  }

  static async pauseTask(task_id, work_id) {
    console.log("pause-=-=-=-==-=-=-", task_id, work_id);
    const formData = { task_id, work_id };
    const token = sessionStorage.getItem("token");
    try {
      const response = await api.patch(`/api/wh/wh/pause/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log("Pause Task: ", response.data);
      return response.data.data;
    } catch (error) {
      console.log("Error in getting Project:", error);
      throw error;
    }
  }

  //to resume task
  static async resumeTask(task_id, work_id) {
    console.log("resume-=-=-=-==-=-=-", task_id);
    const formData = { task_id, work_id };
    const token = sessionStorage.getItem("token");
    try {
      const response = await api.patch(`/api/wh/wh/resume/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log("Resume Task: ", response.data);
      return response.data.data;
    } catch (error) {
      console.log("Error in getting Resume Task: ", error);
      throw error;
    }
  }

  static async endTask(task_id, work_id, end) {
    console.log("end-=-=-=-==-=-=-", task_id, work_id, end);
    const formData = { task_id, work_id, end };
    const token = sessionStorage.getItem("token");
    try {
      const response = await api.patch(`/api/wh/wh/end/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.data.data;
      console.log("End Task: ", data);
      return data;
    } catch (error) {
      console.log("Error in getting End Task: ", error);
      throw error;
    }
  }

  //Assignee APIs
  static async getAssignee() {
    const token = sessionStorage.getItem("token");
    try {
      const response = await api.get(`/api/task/get_assigned-list/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.data;
      console.log("Assignee: ", data);
      return data;
    } catch (error) {
      console.log("Error in getting Assignee: ", error);
      throw error;
    }
  }
  static async getAssigneeById(id) {
    const token = sessionStorage.getItem("token");
    try {
      const response = await api.get(`/api/task/get_assigned-list/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.data;
      console.log("Assignee: ", data);
      return data;
    } catch (error) {
      console.log("Error in getting Assignee: ", error);
      throw error;
    }
  }
  static async approveAssignee({ tid }) {
    const token = sessionStorage.getItem("token");
    const data = { approved: true };
    try {
      const response = await api.patch(
        `/api/task/update_assigned-list/${tid}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      return response?.data;
    } catch (error) {
      console.log("Error in Approving Assignee: ", error);
      throw error;
    }
  }

  //to add assignee --updated
  static async addAssigne(id, assigne) {
    console.log("task id", id);
    console.log("assigned id", assigne);
    const token = sessionStorage.getItem("token");
    try {
      const response = await api.post(
        `/api/task/tasks/${id}/add_assignes/`,
        assigne,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "Application/json",
          },
        },
      );
      console.log("Assignee Added: ", response.data);
      return response.data;
    } catch (error) {
      console.log("Error in Adding Assignee: ", error);
      throw error;
    }
  }

  static async addComment(id, data) {
    const formData = { ...data };
    console.log(data);
    try {
      const token = sessionStorage.getItem("token");
      const response = await api.post(
        `/api/task/tasks/add_comment/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return response.data;
    } catch (error) {
      console.log("Error fetching projects:", error);
      throw error;
    }
  }

  static async deleteAssignee(id) {
    const token = sessionStorage.getItem("token");
    try {
      const response = await api.delete(`/api/task/assigned-list/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (response) return true;
      return false;
    } catch (error) {
      console.log("Error in Approving Assignee: ", error);
      throw error;
    }
  }

  //Comment APIs
  static async getComment() {
    const token = sessionStorage.getItem("token");
    try {
      const response = await api.get(`/api/task/comment/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      console.log("Comment: ", data);
      return data;
    } catch (error) {
      console.log("Error in getting Comment: ", error);
      throw error;
    }
  }

  //add Group for groupchatting
  static async addGroup(groupData) {
    const token = sessionStorage.getItem("token");
    try {
      const response = await api.post(`/api/chat/createGroup`, groupData, {
        headers: {
          "Content-Type": "Application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data;
    } catch (error) {
      console.log("Error in adding Group: ", error);
      throw error;
    }
  }

  //add Group Member
  static async addGroupMember(groupId, memberIds) {
    const formData = [...memberIds];
    try {
      const response = await api.post(
        `/api/chat/group/addmember/${groupId}`,
        formData,
        {
          headers: {
            "Content-Type": "Application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return response.data;
    } catch (error) {
      console.log("Error in adding Group Member: ", error);
      throw error;
    }
  }

  // Fetch all groups members
  static async getGroupMembers(groupId) {
    const token = sessionStorage.getItem("token");
    try {
      const response = await api.get(`/api/chat/getGroupMembers/${groupId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data;
    } catch (error) {
      console.log("Error in getting Group Members: ", error);
      throw error;
    }
  }

  // Fetch the Chat by GroupID
  static async getChatByGroupId(groupId, lastMsgId) {
    const params = new URLSearchParams();

    if (lastMsgId) {
      params.append("lastMessageId", lastMsgId);
    }

    const token = sessionStorage.getItem("token");
    try {
      const response = await api.get(
        `/api/chat/groupMessages/${groupId}?${params.toString()}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log("Chat by Group ID: ", response.data.data);
      return response.data.data;
    } catch (error) {
      console.log("Error in getting Group Chat: ", error);
      throw error;
    }
  }

  // Fetch all chats
  static async getAllChats() {
    try {
      const response = await api.get(`/api/chat/recent-chats`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data;
    } catch (error) {
      console.log("Error in getting all chats: ", error);
      throw error;
    }
  }

   //Fetch all estimation tasks
  static async allEstimationTasks() {
    const token = sessionStorage.getItem("token");
    try {
      const response = await api.get(
        `/api/EstimationTask/getMyTasks`,
        {
          headers: {
            "Content-Type": "Application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("All Estimation Tasks: ", response.data);
      return response.data?.data;
    } catch (error) {
      console.log("Error fetching all estimation tasks:", error);
      throw error;
    }
  }

  // Fetch estimation task by ID
  static async getEstimationTaskById(id) {
    const token = sessionStorage.getItem("token");
    try {
      const response = await api.get(`/api/EstimationTask/task/${id}`, {
        headers: {
          "Content-Type": "Application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data?.data;
    } catch (error) {
      console.log("Error fetching estimation task by ID:", error);
      throw error;
    }
  }

  //Calendar API
  // static async fetchCalendar(date, user) {
  //   const token = sessionStorage.getItem("token");
  //   console.log(date, "==================");
  //   if (date) date = new Date(date);
  //   console.log(
  //     `?date=${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
  //   );
  //   try {
  //     let url = `/api/task/tasks/calender/`;
  //     if (date && user) {
  //       url += `?date=${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}&user=${user}`;
  //     } else if (date) {
  //       url += `?date=${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  //     } else if (user) {
  //       url += `?user=${user}`;
  //     }

  //     const response = await api.get(url, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         "Content-Type": "application/json",
  //       },
  //     });
  //     const data = await response.json();
  //     console.log("Calendar: ", data);
  //     return data;
  //   } catch (error) {
  //     console.log("Error in getting Calendar: ", error);
  //     throw error;
  //   }
  // }

  // static async fetchCalendar2(date, user) {
  //   const token = sessionStorage.getItem("token");
  //   try {
  //     let url = `/api/task/tasks/calender/?date=${date.substring(0, 10)}&user=${user}`;

  //     const response = await api.get(url, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         "Content-Type": "application/json",
  //       },
  //     });
  //     const data = await response.json();
  //     // console.log('Calendar: ', data)
  //     return data;
  //   } catch (error) {
  //     console.log("Error in getting Calendar: ", error);
  //     throw error;
  //   }
  // }
}

export default Service;
