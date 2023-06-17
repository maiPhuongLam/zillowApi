import { Between, LessThan, Repository } from "typeorm";
import { HomeEntity, PropertyType } from "../entitites/home.entity";
import { HomeServiceResponseDataDto } from "../dtos/home/home-service-response.dto";
import { Image } from "../dtos/home/create-home.dto";
import { ImageEntity } from "../entitites/image.entity";
import { number } from "zod";

interface GetHomeParam {
  city?: string;
  price?: {
    lessThan?: number;
    moreThan?: number;
  };
  propertyType?: PropertyType;
}

interface CreateHomeParam {
  address: string;
  numberOfBedrooms: number;
  numberOfBathrooms: number;
  city: string;
  landSize: number;
  price: number;
  propertyType: PropertyType;
  images: Image[];
  realtorId: number;
}

interface UpdateHomeParam {
  address?: string;
  numberOfBedrooms?: number;
  numberOfBathrooms?: number;
  city?: string;
  price?: number;
  landSize?: number;
  propertyType?: PropertyType;
}

export class HomeService {
  constructor(
    private readonly homeRepository: Repository<HomeEntity>,
    private readonly imageRepository: Repository<ImageEntity>
  ) {}

  public async getHomes(
    filter: GetHomeParam
  ): Promise<{ statusCode: number; data: HomeServiceResponseDataDto[] }> {
    const homes = await this.homeRepository.find({
      select: {
        id: true,
        address: true,
        city: true,
        price: true,
        propertyType: true,
        numberOfBathrooms: true,
        numberOfBedrooms: true,
        createdDate: false,
        updatedDate: false,
        realtor: {
          name: true,
        },
        images: {
          url: true,
        },
      },
      relations: {
        images: true,
        realtor: true,
      },
      where: {
        city: filter.city,
        price: Between(
          filter.price?.moreThan || 0,
          filter.price?.lessThan || 999999999
        ),
        propertyType: filter.propertyType,
      },
    });

    const fetchHomes = homes.map((home) => {
      const { images, ...others }: HomeEntity = home;
      let image;
      if (images.length === 0) {
        image = "img";
      } else {
        image = images[0].url;
      }
      const fetchHome: HomeServiceResponseDataDto = {
        ...others,
        image: image,
      };
      return fetchHome;
    });

    return { statusCode: 200, data: fetchHomes };
  }

  public async getHomeById(
    id: number
  ): Promise<{ statusCode: number; data: HomeServiceResponseDataDto }> {
    const home = await this.homeRepository.findOne({
      where: { id },
      select: {
        id: true,
        address: true,
        numberOfBedrooms: true,
        numberOfBathrooms: true,
        city: true,
        landSize: true,
        propertyType: true,
        price: true,
        images: { url: true },
      },
      relations: {
        images: true,
      },
    });
    if (!home) {
      return { statusCode: 404, data: "Nhà không tồn tại" };
    }
    const { images, ...others } = home;
    console.log(home);
    let image;
    if (images.length === 0) {
      image = "img";
    } else {
      image = images[0].url;
    }
    const fetchHome: HomeServiceResponseDataDto = { ...others, image };
    return { statusCode: 200, data: fetchHome };
  }

  public async addHome(
    data: CreateHomeParam
  ): Promise<{ statusCode: number; data: HomeServiceResponseDataDto }> {
    const home = await this.homeRepository.create(data);
    await this.homeRepository.save(home);
    const homeImages = data.images.map(async (image) => {
      await this.imageRepository.create({ ...image, homeId: home.id });
      await this.imageRepository.save({ ...image, homeId: home.id });
      return { ...image, homeId: home.id };
    });
    const { images, realtor, realtorId, createdDate, updatedDate, ...others } =
      home;
    const fetchHome = { ...others, image: images[0].url };

    return { statusCode: 200, data: fetchHome };
  }

  public async updateHome(
    id: number,
    data: UpdateHomeParam,
    realtorId: number
  ): Promise<{ statusCode: number; data: HomeServiceResponseDataDto }> {
    const home = await this.homeRepository.findOne({ where: { id } });
    if (!home) {
      return { statusCode: 404, data: "Home not exist" };
    }
    if (home.realtorId !== realtorId) {
      return { statusCode: 401, data: "Not authorized" };
    }
    const homeUpdated = await this.homeRepository.update(id, data);
    await this.homeRepository.save(home);
    return this.getHomeById(id);
  }

  public async deleteHome(
    id: number,
    realtorId: number
  ): Promise<{ statusCode: number; data: HomeServiceResponseDataDto }> {
    const home = await this.homeRepository.findOne({ where: { id } });
    if (!home) {
      return { statusCode: 404, data: "Home not exist" };
    }
    if (home.realtorId !== realtorId) {
      return { statusCode: 401, data: "Not authorized" };
    }
    await this.imageRepository.delete({ homeId: id });
    await this.homeRepository.delete(id);
    return { statusCode: 200, data: "Delete success" };
  }
}
