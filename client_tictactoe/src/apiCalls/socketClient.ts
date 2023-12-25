// (function () {

//     interface WebSocketExt extends WebSocket{
//         pingTimeout? : NodeJS.Timeout;
//     }
//     let ws: WebSocketExt;
//     const HEARTBEAT_TIMEOUT = ((1000*5) +(1000*1));
//     const HEARTBEAT_VALUE = 1;
//     const messages = <HTMLElement>document.getElementById("messages");
//     const wsOpen = <HTMLButtonElement>document.getElementById("ws-open");
//     const wsClose = <HTMLButtonElement>document.getElementById("ws-close");
//     const wsSend = <HTMLButtonElement>document.getElementById("ws-send");
//     const wsInput = <HTMLInputElement>document.getElementById("ws-input");
  
//     function isBinary(obj: any) {
//       return typeof obj === 'object' && Object.prototype.toString.call(obj) === '[object Blob]';
//   }
  
//     const heartBeat = () =>{
//       if(!ws){
//         return;
//       }else if(!!ws.pingTimeout){
//         clearTimeout(ws.pingTimeout);
//       }
//       ws.pingTimeout = setTimeout(()=>{
//         ws.close();
//         // Business logic to reconnect or not 
  
//       },HEARTBEAT_TIMEOUT)
//       const data = new Uint8Array(1);
//       data[0] = HEARTBEAT_VALUE;
//        ws.send(data);
//     }
  
//     function showMessage(message: string) {
//       if (!messages) {
//         return;
//       }
//       messages.textContent += `\n${message}`;
//       messages.scrollTop = messages.scrollHeight;
//     }
  
//     wsOpen.addEventListener("click", () => {
//       if (!!ws) {
//         ws.close();
//       }
  
//       ws = new WebSocket("ws://localhost:8001") as WebSocketExt;
  
//       ws.addEventListener("error", () => {
//         showMessage("WebSocket Error");
//       });
  
//       ws.addEventListener("open", () => {
//         showMessage("WebSocket Connection established");
//       });
  
//       ws.addEventListener("close", () => {
//         showMessage("WebSocket Connection Closed");
  
//         if(!!ws.pingTimeout){
//           clearTimeout(ws.pingTimeout);
//         }
//       });
  
//       ws.addEventListener("message", (msg: MessageEvent<string>) => {
//         console.log("Received mssg ",msg)
//         if(isBinary(msg.data)){
//           console.log("received binary data")
//             heartBeat();
//         }else{
//           showMessage(`Receieved message : ${msg.data}`);
  
//         }
//       });
//     });
  
//     wsClose.addEventListener("click", () => {
//       if (!!ws) {
//         ws.close();
//       }
//     });
  
//     wsSend.addEventListener("click", () => {
//       const val = wsInput?.value;
//       if (!val) {
//         return;
//       } else if (!ws || ws.readyState === WebSocket.CLOSED) {
//         showMessage("No Websocket Connection to send message");
//         return;
//       }
//         ws.send(val);
//         showMessage(`Sent Message:- ${val}`);
//         wsInput.value = "";
      
//     });
//   })();
  