import { Inject, Injectable } from '@nestjs/common';
import { WORMHOLE_VAAS_API } from './constants/constant';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AppService {

  constructor(
    @Inject('EVENT_SERVICE') private eventClient: ClientProxy,
  ) {}

  async processMessage(transactionHash: string) {
    const startTime = Date.now();

    const intervalId = setInterval(async () => {
      const elapsedTime = Date.now() - startTime;
      if (elapsedTime >= 10000) {
        console.log("Polling completed.");
        clearInterval(intervalId);
        return;
      }
      try {
        const response = await fetch(`${WORMHOLE_VAAS_API}=${transactionHash}`);
        if (response.ok) {
          const data = await response.json();
          console.log("API Response:", data);
          if (data.data.length > 0) {
            clearInterval(intervalId);
            console.log("Polling completed by success.");
            return data.data[0].vaa;
          }
        }
      } catch (error) {
        console.error("Error fetching API:", error);
      }
    }, 2000);
  }

  getHello(): string {
    return 'Hello World!';
  }
}
