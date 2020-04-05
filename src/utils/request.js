import axios from "axios";

axios.interceptors.request.use((config) => {
  const { method, params } = config;
  if (method.toLocaleLowerCase() === "get") {
    config.params = {
      timestamp: Date.parse(`${new Date()}`) / 1000,
      ...params,
    };
  }
  return config;
}, (error) => {
  return Promise.reject(error);
})
axios.interceptors.response.use((response) => response.data, (error) => {

})

const request = (url, params) => {
  let options = {
    url,
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
    },
    ...params,
  };

  return axios(options);
}

export default request;