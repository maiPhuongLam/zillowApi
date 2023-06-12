import { Between, LessThan, Repository } from "typeorm";
import { HomeEntity, PropertyType } from "../entitites/home.entity";
import { HomeServiceResponseDataDto } from "../dtos/home/home-service-response.dto";
import { Image } from "../dtos/home/create-home.dto";
import { ImageEntity } from "../entitites/image.entity";

interface GetHomeData {
  city?: string;
  price?: {
    lessThan?: number;
    moreThan?: number;
  };
  propertyType?: PropertyType;
}

interface CreateHomeData {
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

export class HomeService {
  constructor(
    private readonly homeRepository: Repository<HomeEntity>,
    private readonly imageRepository: Repository<ImageEntity>
  ) {}

  public async getHomes(
    filter: GetHomeData
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
        images: {
          url: true,
        },
      },
      relations: {
        images: true,
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
      const {
        images,
        realtor,
        realtorId,
        createdDate,
        updatedDate,
        ...orthers
      } = home;
      return { ...orthers, image: images[0].url };
    });
    return { statusCode: 200, data: fetchHomes };
  }

  public async addHome(
    data: CreateHomeData
  ): Promise<{ statusCode: number; data: HomeServiceResponseDataDto }> {
    console.log(data);
    const home = await this.homeRepository.create(data);
    await this.homeRepository.save(home);
    const homeImages = data.images.map(async (image) => {
      await this.imageRepository.create({ ...image, homeId: home.id });
      await this.imageRepository.save({ ...image, homeId: home.id });
      return { ...image, homeId: home.id };
    });
    const { images, realtor, realtorId, createdDate, updatedDate, ...orthers } =
      home;
    const fetchHome = { ...orthers, image: images[0].url };
    return { statusCode: 200, data: fetchHome };
  }
}
