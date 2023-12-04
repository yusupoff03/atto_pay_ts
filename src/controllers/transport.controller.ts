import { Container } from 'typedi';
import { TransportService } from '@services/transport.service';
import { NextFunction, Request, Response } from 'express';
import { TopUpCardDto } from '@dtos/transport.card.dto';
import { verify } from "jsonwebtoken";
import { SECRET_KEY } from "@config";
import { DataStoredInToken } from "@interfaces/auth.interface";

export class TransportController {
  public transport = Container.get(TransportService);
  public getStations = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const stations = await this.transport.getStations();
      res.status(200).json({
        success: true,
        stations,
      });
    } catch (error) {
      next(error);
    }
  };
  public topUpCard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const topUp: TopUpCardDto = req.body;
      const customerId: string = await this.getCustomerId(req);
      const { transfer_id, message } = await this.transport.topUp(topUp, customerId);
      res.status(200).json({ success: true, transfer_id, message });
    } catch (error) {
      next(error);
    }
  };
  private getCustomerId = async (req: Request): Promise<string> => {
    const cookie = req.headers.authorization;
    const decodedToken = verify(cookie, SECRET_KEY) as DataStoredInToken;
    return decodedToken.id;
  };
}
