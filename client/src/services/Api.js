import axios from 'axios'

export default() => {
  return axios.create({
    baseURL: `https://fpl-analyser.herokuapp.com/api`,
    headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
    }
  })
}