
import { initializePaddle, Paddle } from '@paddle/paddle-js'


let paddleInstance:any = null;

export const paddleInit = () => {

  if (!paddleInstance){
    paddleInstance = initializePaddle({
      environment:'production',
      token:process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN,
    } as any) 
  }
  return paddleInstance;
}
