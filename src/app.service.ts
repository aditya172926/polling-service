import { Inject, Injectable } from '@nestjs/common';
import { WORMHOLE_VAAS_API } from './constants/constant';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AppService {

  constructor(
    @Inject('RELAY_SERVICE') private relayClient: ClientProxy,
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
            console.log("Polling completed by success.");
            const eventData = {
              sourceTransactionHash: transactionHash,
              vaa: data.data[0].vaa
            }
            this.relayClient.emit('relay_to_solana', eventData);
            clearInterval(intervalId);
            return;
          }
        }
      } catch (error) {
        console.error("Error fetching API:", error);
      }
    }, 2000);
  }
}
