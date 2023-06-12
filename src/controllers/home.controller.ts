import { Request, Response } from "express";
import { HomeService } from "../services/home.service";
import { GetHomesDto } from "../dtos/home/get-homes.dto";
import { CreateHomeDto } from "../dtos/home/create-home.dto";

export class HomeController {
  constructor(private readonly homeService: HomeService) {
    this.getHomes = this.getHomes.bind(this);
    this.addHome = this.addHome.bind(this);
  }

  async getHomes(
    req: Request<{}, {}, {}, GetHomesDto["query"]>,
    res: Response
  ) {
    try {
      const { price, city, propertyType } = req.query;
      const filters = {
        ...(city && { city }),
        ...(price && { price }),
        ...(propertyType && { propertyType }),
      };
      const { statusCode, data } = await this.homeService.getHomes(filters);
      res.status(statusCode).json(data);
    } catch (err: any) {
      res.status(500).json(err.message);
    }
  }

  async addHome(req: Request<{}, {}, CreateHomeDto["body"]>, res: Response) {
    try {
      if (req.role === "buyer") {
        console.log(req.role);
        return res.status(401).json("Not authorized");
      }
      const userId: number = +req.userId!;
      const { statusCode, data } = await this.homeService.addHome({
        ...req.body,
        realtorId: userId,
      });
      console.log(data);
      res.status(statusCode).json(data);
    } catch (err: any) {
      res.status(500).json(err.message);
    }
  }
}
