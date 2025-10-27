import axios from 'axios'

export async function checkAuth(API_BASE_URL: String): Promise<boolean> {
  try {
    const response = await axios.get(`http://${API_BASE_URL}/verify`, {
      withCredentials: true,
    })
    return response.status === 200
  } catch {
    return false
  }
}
