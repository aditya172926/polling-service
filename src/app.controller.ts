import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientProxy, EventPattern, MessagePattern } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService
  ) {}

  @EventPattern('new_msg')
  async processNewMessage(message: string) {
    console.log("The message received from RELAY SERVICE is ", message);
    await this.appService.processMessage(message);
  }
}
