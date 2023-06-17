import { Request, Response } from "express";
import { HomeService } from "../services/home.service";
import { GetHomesDto } from "../dtos/home/get-homes.dto";
import { CreateHomeDto } from "../dtos/home/create-home.dto";
import { GetHomeByIdDto } from "../dtos/home/get-home-by-id.dto";
import { UpdateHomeDto } from "../dtos/home/update-home.dto";

export class HomeController {
  constructor(private readonly homeService: HomeService) {
    this.getHomes = this.getHomes.bind(this);
    this.addHome = this.addHome.bind(this);
    this.getHome = this.getHome.bind(this);
    this.updateHome = this.updateHome.bind(this);
    this.deleteHome = this.deleteHome.bind(this);
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

  async getHome(req: Request<GetHomeByIdDto["params"], {}, {}>, res: Response) {
    try {
      const id = +req.params.id;
      const { statusCode, data } = await this.homeService.getHomeById(id);
      res.status(statusCode).json(data);
    } catch (err: any) {
      res.status(500).json(err.message);
    }
  }

  async addHome(req: Request<{}, {}, CreateHomeDto["body"]>, res: Response) {
    try {
      if (req.role === "buyer") {
        return res.status(401).json("Not authorized");
      }
      const userId: number = +req.userId!;
      const { statusCode, data } = await this.homeService.addHome({
        ...req.body,
        realtorId: userId,
      });
      res.status(statusCode).json(data);
    } catch (err: any) {
      res.status(500).json(err.message);
    }
  }

  async updateHome(
    req: Request<UpdateHomeDto["params"], {}, UpdateHomeDto["body"]>,
    res: Response
  ) {
    try {
      const id = +req.params.id;
      const realtorId = +req.userId!;
      const { statusCode, data } = await this.homeService.updateHome(
        id,
        req.body,
        realtorId
      );
      res.status(statusCode).json(data);
    } catch (err: any) {
      res.status(500).json(err.message);
    }
  }

  async deleteHome(req: Request<UpdateHomeDto["params"]>, res: Response) {
    try {
      const id = +req.params.id;
      const realtorId = +req.userId!;
      const { statusCode, data } = await this.homeService.deleteHome(
        id,
        realtorId
      );
      res.status(statusCode).json(data);
    } catch (err: any) {
      res.status(500).json(err.message);
    }
  }
}
