import { io } from "socket.io-client";
const api = import.meta.env.VITE_API_URL;
const socket = io(api);

export default socket;
