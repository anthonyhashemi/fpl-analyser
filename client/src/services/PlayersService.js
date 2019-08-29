
import Api from '@/services/Api'

export default {
  fetchPlayers () {
    return Api().get('/players')
  }
}