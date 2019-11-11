import { create } from "axios";

const http = create({
  baseURL: "http://localhost:5000/"
});

// retorna o atributo data da resposta
http.interceptors.response.use(function(response) {
  return response.data;
});

export default http;
