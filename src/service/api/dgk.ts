// https://apis.data.go.kr/B551011/KorService1/areaCode1?serviceKey=LX%2Bvip8U1cIkZRIYLe%2Fj20f%2F7QAGPO8I3bIF6PRU9ILI05ynseP670tj5oAmkfnaUDKKbMPLRuQNRdosbKDN%2Fg%3D%3D&numOfRows=999&pageNo=1&MobileOS=ETC&MobileApp=Ambulo&_type=json

// https://apis.data.go.kr/B551011/KorService1/areaCode1?serviceKey=LX%2Bvip8U1cIkZRIYLe%2Fj20f%2F7QAGPO8I3bIF6PRU9ILI05ynseP670tj5oAmkfnaUDKKbMPLRuQNRdosbKDN%2Fg%3D%3D&numOfRows=999&pageNo=1&MobileOS=ETC&MobileApp=AppTest&_type=json
// https://api.data.go.kr/B551011/KorService1/areaCode1?serviceKey=LX%252Bvip8U1cIkZRIYLe%252Fj20f%252F7QAGPO8I3bIF6PRU9ILI05ynseP670tj5oAmkfnaUDKKbMPLRuQNRdosbKDN%252Fg%253D%253D&numOfRows=999&pageNo=1&MobileOS=ETC&MobileApp=Ambulo&_type=json
import { Axios } from 'axios'

const axios = new Axios({
  baseURL: 'https://apis.data.go.kr'
  // headers: {

  // }
})

const getCode = () => {
  axios
    .get('/B551011/KorService1/areaCode1', {
      withCredentials: true,
      params: {
        serviceKey:
          'LX%2Bvip8U1cIkZRIYLe%2Fj20f%2F7QAGPO8I3bIF6PRU9ILI05ynseP670tj5oAmkfnaUDKKbMPLRuQNRdosbKDN%2Fg%3D%3D',
        numOfRows: 999,
        pageNo: 1,
        MobileOS: 'ETC',
        MobileApp: 'Ambulo',
        _type: 'json'
      }
    })
    .then((res) => {
      console.log(res)
    })
}

export default {
  getCode
}
