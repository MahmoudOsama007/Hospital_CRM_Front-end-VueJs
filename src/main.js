import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'bootstrap/dist/css/bootstrap.min.css'
import axios from 'axios'
import auth from './store/auth' // Adjust the path if necessary
import '@fortawesome/fontawesome-free/css/all.min.css'

createApp(App).use(store).use(router).mount('#app')

axios.interceptors.request.use(
    (config) => {
        const token = auth.getToken()
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)
