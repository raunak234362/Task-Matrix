/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import axios from 'axios'
import { BASE_URL } from '../config/constant'
const token = sessionStorage.getItem('token')
class Service {
  //Users APIs
  static async getCurrentUser(token) {
    sessionStorage.getItem(token)
    try {
      const response = await fetch(`${BASE_URL}api/user/emp/me/`, {
        method: 'GET',
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json'
        }
      })
      const data = await response.json()

      return data
    } catch (error) {
      console.error('Error in getCurrentUser:', error)
      throw error
    }
  }
  static async getAllUser(token) {
    sessionStorage.getItem(token)
    try {
      const response = await fetch(`${BASE_URL}api/user/emp/`, {
        method: 'GET',
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json'
        }
      })
      const data = await response.json()

      return data
    } catch (error) {
      console.error('Error in getAllUser:', error)
      throw error
    }
  }
  static async addUser({ username, email, name, accessPermission, password }) {
    console.log('Successfully Added User: ', username, email, name)
    const is_staff = accessPermission === 'manager' || accessPermission === 'admin'
    const is_superuser = accessPermission === 'admin'
    try {
      const token = sessionStorage.getItem('token')
      const response = await fetch(`${BASE_URL}api/user/emp/`, {
        method: 'POST',
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username,
          email,
          name,
          is_staff,
          is_superuser,
          password
        })
      })
      const data = await response.json()
      return data
    } catch (error) {
      console.log('Error in adding User: ', error)
      throw error
    }
  }
  static async addUserCSV({ csv_file }) {
    const token = sessionStorage.getItem('token')
    const file = csv_file[0]

    if (!file) {
      console.error('No file selected')
      return
    }
    try {
      const formData = new FormData()
      formData.append('csv_file', file, file.name)

      const response = await fetch(`${BASE_URL}api/user/emp/add_csv/`, {
        method: 'POST',
        headers: {
          Authorization: `Token ${token}`
          // 'Content-Type': 'multipart/form-data', // Do not set this header, the browser will do it automatically
        },
        body: formData
      })
      // const data = await response.json();
      // console.log(data);
      return true
    } catch (error) {
      console.log('Error in adding User: ', error)
      throw error
    }
  }

  static async sampleCSV() {
    try {
      const token = sessionStorage.getItem('token')
      const response = await fetch(`${BASE_URL}api/user/emp/get_sample_csv`, {
        method: 'GET',
        headers: {
          Authorization: `Token ${token}`
        }
      })
      const blob = await response.blob()
      return blob
    } catch (error) {
      console.log('Error in fetching sample CSV: ', error)
      throw error
    }
  }

  //Team APIs
  static async addTeam({ name, created_by, leader }) {
    try {
      const formData = JSON.stringify({
        name,
        created_by,
        leader
      })
      const token = sessionStorage.getItem('token')
      const response = await fetch(`${BASE_URL}api/team/teams/`, {
        method: 'POST',
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json'
        },
        body: formData
      })
      const data = await response.json()
      console.log('Successfully Added Team: ', data)
      return data
    } catch (error) {
      console.log('Error in Adding Team: ', error)
      throw error
    }
  }
  static async getAllTeam() {
    const token = sessionStorage.getItem('token')
    try {
      const response = await fetch(`${BASE_URL}api/team/teams/`, {
        method: 'GET',
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json'
        }
      })
      const data = await response.json()
      console.log('Team fetched: ', data)
      return data
    } catch (error) {
      console.log('Error in getting team list: ', error)
      throw error
    }
  }
  static async getTeam(projectId) {
    const token = sessionStorage.getItem('token')
    try {
      const response = await axios.get(`${BASE_URL}api/team/teams/${projectId}`, {
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json'
        }
      })
      console.log('Team fetched: ', response.data)
      return response.data
    } catch (error) {
      console.log('Error in getting team: ', error)
      throw error
    }
  }

  static async deleteTeam(teamId){
    console.log(teamId)
    try {
      console.log(teamId)
      const response = await axios.delete(`${BASE_URL}api/team/teams/${teamId}`,{
        headers:{
          Authorization: `Token ${sessionStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      })
      console.log('Team Deleted: ', response.data)
    } catch (error) {
      console.log('Error deleting the team',error)
    }
  }

  static async getTeamMember(projectId) {
    console.log(projectId)
    const token = sessionStorage.getItem('token')
    try {
      const response = await axios.get(`${BASE_URL}api/team/teams/${projectId}/add_members/`, {
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json'
        }
      })
      console.log('Team Member fetched: ', response.data)
      return response.data
    } catch (error) {
      console.log('Error in getting team member: ', error)
      throw error
    }
  }

  static async addTeamMember({ role, employee, teamId }) {
    console.log(role, employee, teamId)
    try {
      const formData = JSON.stringify({
        role,
        employee
      })
      console.log('---------------')

      const token = sessionStorage.getItem('token')
      const response = await fetch(`${BASE_URL}api/team/teams/${teamId}/add_member/`, {
        method: 'POST',
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json'
        },
        body: formData
      })
      const data = await response.json()
      console.log('Successfully Added Team Member: ', data)
      return data
    } catch (error) {
      console.log('Error Adding members: ', error)
    }
  }

  //Fabricator APIs
  static async addFabricator({ name, country, state, city, zipCode, design, token }) {
    console.log('Successfully Added Fabricator: ', design[0])
    const file = design[0]
    try {
      const formData = new FormData()
      formData.append('name', name)
      formData.append('country', country)
      formData.append('state', state)
      formData.append('city', city)
      formData.append('zipCode', zipCode)
      formData.append('design', file)

      const response = await fetch(`${BASE_URL}api/fabricator/fabricator/`, {
        method: 'POST',
        headers: {
          Authorization: `Token ${token}`
          // 'Content-Type': 'application/json',
        },
        body: formData
      })

      const data = await response.json()
      console.log(data)
      return data
    } catch (error) {
      console.log('Error in adding Fabricator: ', error)
      throw error
    }
  }
  static async deleteFabricator(id) {
    const token = sessionStorage.getItem('token')
    try {
      const response = await fetch(`${BASE_URL}api/fabricator/fabricator/${id}/`, {
        method: 'DELETE',
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json'
        }
      })
      const data = await response.json()
      return data
    } catch (error) {
      console.log('Error in deleting Fabricator: ', error)
      throw error
    }
  }
  static async getAllFabricator() {
    const token = sessionStorage.getItem('token')
    try {
      const response = await fetch(`${BASE_URL}api/fabricator/fabricator/`, {
        method: 'GET',
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()
      return data
    } catch (error) {
      console.log('Error in getting Fabricator List: ', error)
      throw error
    }
  }
  static async getFabricator(id) {
    const token = sessionStorage.getItem('token')
    try {
      const response = await fetch(`${BASE_URL}api/fabricator/fabricator/${id}`, {
        method: 'GET',
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json'
        }
      })
      const data = await response.json()
      return data
    } catch (error) {
      console.log('Error in getting Fabricator: ', error)
      throw error
    }
  }
  static async addConnection(id, newConnection) {
    const token = sessionStorage.getItem('token')
    try {
      const response = await fetch(`${BASE_URL}api/fabricator/fabricator/${id}/add_connection/`, {
        method: 'POST',
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...newConnection })
      })
      const data = await response.json()
      return data
    } catch (error) {
      console.log('Error in adding Connection: ', error)
      throw error
    }
  }

  //Project APIs
  static async addProject({
    name,
    description,
    startDate,
    endDate,
    duration,
    connectionDesign,
    miscDesign,
    customer,
    status,
    stage,
    tool,
    manager,
    team,
    fabricator
  }) {
    duration = parseInt(duration)
    try {
      const formData = JSON.stringify({
        name,
        description,
        startDate,
        endDate,
        duration,
        connectionDesign,
        miscDesign,
        customer,
        status,
        stage,
        tool,
        manager,
        fabricator,
        team
      })

      console.log(formData)

      const token = sessionStorage.getItem('token')
      const response = await fetch(`${BASE_URL}api/project/projects/`, {
        method: 'POST',
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json'
        },
        body: formData
      })
      const data = await response.json()
      return data
    } catch (error) {
      console.log('Error in adding Project: ', error)
      throw error
    }
  }
  static async getAllProject() {
    const token = sessionStorage.getItem('token')
    try {
      const response = await fetch(`${BASE_URL}api/project/projects/`, {
        method: 'GET',
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json'
        }
      })
      const data = await response.json()
      return data
    } catch (error) {
      console.log('Error in getting Project List: ', error)
      throw error
    }
  }
  static async getProject(id) {
    const token = sessionStorage.getItem('token')
    try {
      const response = await fetch(`${BASE_URL}api/project/projects/${id}`, {
        method: 'GET',
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json'
        }
      })
      const data = await response.json()
      return data
    } catch (error) {
      console.log('Error in getting Project:', error)
      throw error
    }
  }
  static async editProject(id, projectData) {
    const token = sessionStorage.getItem('token')
    try {
      const response = await axios.patch(`${BASE_URL}api/project/projects/${id}/`, projectData, {
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json'
        }
      })
      return response.data
    } catch (error) {
      console.log('Error in getting Project:', error)
      throw error
    }
  }

  static async DeleteProject(id) {
    const token = sessionStorage.getItem('token')
    try {
      const response = await fetch(`${BASE_URL}api/project/projects/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json'
        }
      })
      if (response) return true
      return false
    } catch (error) {
      console.log('Error in getting Project:', error)
      throw error
    }
  }

  //Task APIs
  static async getTask() {
    const token = sessionStorage.getItem('token')
    try {
      const response = await fetch(`${BASE_URL}api/task/tasks/my_task/`, {
        method: 'GET',
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json'
        }
      })
      const data = await response.json()
      console.log('My Task: ', data)
      return data
    } catch (error) {
      console.log('Error in getting Task: ', error)
      throw error
    }
  }
  static async getMyTask() {
    const token = sessionStorage.getItem('token')
    try {
      const response = await fetch(`${BASE_URL}api/task/tasks/my_task_list`, {
        method: 'GET',
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json'
        }
      })
      const data = await response.json()
      // console.log('My Task list: ', data)
      return data
    } catch (error) {
      console.log('Error in getting Task: ', error)
      throw error
    }
  }
  static async getTaskById(Id) {
    const token = sessionStorage.getItem('token')
    try {
      const response = await fetch(`${BASE_URL}api/task/tasks/${Id}`, {
        method: 'GET',
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json'
        }
      })
      const data = await response.json()
      console.log('Task: ', data)
      return data
    } catch (error) {
      console.log('Error in getting Task: ', error)
      throw error
    }
  }
  static async getAllTask() {
    const token = sessionStorage.getItem('token')
    try {
      const response = await fetch(`${BASE_URL}api/task/tasks/`, {
        method: 'GET',
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json'
        }
      })
      const data = await response.json()
      // console.log('All Task: ', data)
      return data
    } catch (error) {
      console.log('Error in getting Task: ', error)
      throw error
    }
  }
  static async getParentTasks(id) {
    const token = sessionStorage.getItem('token')
    try {
      const response = await fetch(`${BASE_URL}api/task/tasks/?project=${id}`, {
        method: 'GET',
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json'
        }
      })
      const data = await response.json()
      return data
    } catch (error) {
      console.log('Error in getting Parent Task: ', error)
      throw error
    }
  }
  static async addTask({
    name,
    description,
    due_date,
    status,
    priority,
    hour,
    min,
    project,
    parent,
    user
  }) {
    try {
      const formData = {
        name,
        description,
        due_date,
        status,
        priority,
        duration: `${hour}:${min}:00`,
        project,
        parent,
        user
      }

      console.log(formData)

      const token = sessionStorage.getItem('token')

      // Using Axios to make the POST request
      const response = await axios.post(`${BASE_URL}api/task/tasks/`, formData, {
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json'
        }
      })

      console.log(response.data)
      return response.data // Return the response data
    } catch (error) {
      console.log('Error in adding Task: ', error)
      throw error // Rethrow the error after logging
    }
  }
  static async editTask(id, taskData) {
    const token = sessionStorage.getItem('token')
    try {
      const response = await fetch(`${BASE_URL}api/task/tasks/${id}/`, {
        method: 'PATCH',
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(taskData)
      })
      const data = await response.json()
      return data
    } catch (error) {
      console.log('Error in getting Project:', error)
      throw error
    }
  }

  static async deleteTask(id) {
    const token = sessionStorage.getItem('token')
    try {
      const response = await fetch(`${BASE_URL}api/task/tasks/${id}/`, {
        method: 'DELETE',
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json'
        }
      })
      if (response) return true
      return false
    } catch (error) {
      console.log('Error in getting Project:', error)
      throw error
    }
  }

  static async taskRecord(user) {
    console.log(user)
    const token = sessionStorage.getItem('token')
    try {
      const response = await fetch(`${BASE_URL}api/user/record?user=${user}`, {
        method: 'GET',
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json'
        }
      })
      const data = await response.json()
      console.log('Task Record: ', data)
      return data
    } catch (error) {
      console.log('Error in getting Task Record: ', error)
      throw error
    }
  }
  static async userTaskRecord() {
    const token = sessionStorage.getItem('token')
    try {
      const response = await fetch(`${BASE_URL}api/user/record`, {
        method: 'GET',
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json'
        }
      })
      const data = await response.json()
      console.log('Users Task Record: ', data)
      return data
    } catch (error) {
      console.log('Error in getting Task Record: ', error)
      throw error
    }
  }
  static async acceptTask(id) {
    const token = sessionStorage.getItem('token')
    try {
      const response = await fetch(`${BASE_URL}api/task/tasks/${id}/accept/`, {
        method: 'POST',
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json'
        }
      })
      const data = await response.json()
      console.log('Accept Task: ', data)
      return data
    } catch (error) {
      console.log('Error in getting Accept Task: ', error)
      throw error
    }
  }

  static async startTask(id) {
    const token = sessionStorage.getItem('token')
    try {
      const response = await fetch(`${BASE_URL}api/user/record/${id}/start/`, {
        method: 'POST',
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json'
        }
      })
      const data = await response.json()
      console.log('Start Task: ', data)
      return data
    } catch (error) {
      console.log('Error in getting Start Task: ', error)
      throw error
    }
  }

  static async pauseTask(id) {
    const token = sessionStorage.getItem('token')
    try {
      const response = await fetch(`${BASE_URL}api/user/record/${id}/pause/`, {
        method: 'POST',
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json'
        }
      })
      const data = await response.json()
      console.log('Pause Task: ', data)
      return data
    } catch (error) {
      console.log('Error in getting Pause Task: ', error)
      throw error
    }
  }

  static async resumeTask(id) {
    const token = sessionStorage.getItem('token')
    try {
      const response = await fetch(`${BASE_URL}api/user/record/${id}/resume/`, {
        method: 'POST',
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json'
        }
      })
      const data = await response.json()
      console.log('Resume Task: ', data)
      return data
    } catch (error) {
      console.log('Error in getting Resume Task: ', error)
      throw error
    }
  }

  static async endTask(id) {
    const token = sessionStorage.getItem('token')
    try {
      const response = await fetch(`${BASE_URL}api/user/record/${id}/end/`, {
        method: 'POST',
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json'
        }
      })
      const data = await response.json()
      console.log('End Task: ', data)
      return data
    } catch (error) {
      console.log('Error in getting End Task: ', error)
      throw error
    }
  }

  //Assignee APIs
  static async getAssignee() {
    const token = sessionStorage.getItem('token')
    try {
      const response = await fetch(`${BASE_URL}api/task/assigned-list/`, {
        method: 'GET',
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json'
        }
      })
      const data = await response.json()
      console.log('Assignee: ', data)
      return data
    } catch (error) {
      console.log('Error in getting Assignee: ', error)
      throw error
    }
  }
  static async getAssigneeById(id) {
    const token = sessionStorage.getItem('token')
    try {
      const response = await fetch(`${BASE_URL}api/task/assigned-list/${id}`, {
        method: 'GET',
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json'
        }
      })
      const data = await response.json()
      console.log('Assignee: ', data)
      return data
    } catch (error) {
      console.log('Error in getting Assignee: ', error)
      throw error
    }
  }
  static async approveAssignee(id) {
    const token = sessionStorage.getItem('token')
    try {
      const response = await fetch(`${BASE_URL}api/task/assigned-list/${id}/confirm/`, {
        method: 'POST',
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json'
        }
      })
      const data = await response.json()
      console.log('Assignee Approved: ', data)
      return data
    } catch (error) {
      console.log('Error in Approving Assignee: ', error)
      throw error
    }
  }

  static async addAssigne(id, assigne) {
    const token = sessionStorage.getItem('token')
    try {
      const response = await fetch(`${BASE_URL}api/task/tasks/${id}/add_assignes/`, {
        method: 'POST',
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          assigned_to: assigne
        })
      })
      const data = await response.json()
      console.log('Assignee Added: ', data)
      return data
    } catch (error) {
      console.log('Error in Adding Assignee: ', error)
      throw error
    }
  }

  static async addComment(id, comment, file) {
    console.log(comment, file)
    const token = sessionStorage.getItem('token')
    try {
      const doc = file ? file[0] : null
      const formData = new FormData()
      formData.append('data', comment)
      formData.append('file', doc)
      console.log(formData)
      const response = await fetch(`${BASE_URL}api/task/tasks/${id}/add_comment/`, {
        method: 'POST',
        headers: {
          Authorization: `Token ${token}`
          // 'Content-Type': 'application/json',
        },
        body: formData
      })
      const data = await response.json()
      console.log('Comment Added: ', data)
      return data
    } catch (error) {
      console.log('Error in Adding Comment: ', error)
      throw error
    }
  }
  static async deleteAssignee(id) {
    const token = sessionStorage.getItem('token')
    try {
      const response = await fetch(`${BASE_URL}api/task/assigned-list/${id}/`, {
        method: 'DELETE',
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json'
        }
      })
      if (response) return true
      return false
    } catch (error) {
      console.log('Error in Approving Assignee: ', error)
      throw error
    }
  }

  //Comment APIs
  static async getComment() {
    const token = sessionStorage.getItem('token')
    try {
      const response = await fetch(`${BASE_URL}api/task/comment/`, {
        method: 'GET',
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json'
        }
      })
      const data = await response.json()
      console.log('Comment: ', data)
      return data
    } catch (error) {
      console.log('Error in getting Comment: ', error)
      throw error
    }
  }

  //Calendar API
  static async fetchCalendar(date, user) {
    const token = sessionStorage.getItem('token')
    console.log(date, '==================')
    if (date) date = new Date(date)
    console.log(`?date=${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`)
    try {
      let url = `${BASE_URL}api/task/tasks/calender/`
      if (date && user) {
        url += `?date=${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}&user=${user}`
      } else if (date) {
        url += `?date=${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
      } else if (user) {
        url += `?user=${user}`
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json'
        }
      })
      const data = await response.json()
      console.log('Calendar: ', data)
      return data
    } catch (error) {
      console.log('Error in getting Calendar: ', error)
      throw error
    }
  }

  static async fetchCalendar2(date, user) {
    const token = sessionStorage.getItem('token')
    try {
      let url = `${BASE_URL}api/task/tasks/calender/?date=${date.substring(0, 10)}&user=${user}`

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json'
        }
      })
      const data = await response.json()
      // console.log('Calendar: ', data)
      return data
    } catch (error) {
      console.log('Error in getting Calendar: ', error)
      throw error
    }
  }
}

export default Service
