import { Injectable, Inject, Logger } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { ProductStyle } from './product-style.entity';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface ProductStyleServiceGrpc {
  findAll(data: {}): Observable<any>;
  findOne(data: { id: number }): Observable<any>;
  create(data: Partial<ProductStyle>): Observable<any>;
  update(data: {
    id: number;
    description?: string;
    isActive?: boolean;
  }): Observable<any>;
  remove(data: { id: number }): Observable<any>;
}

@Injectable()
export class ProductStyleService {
  private productStyleServiceGrpc: ProductStyleServiceGrpc;
  private readonly logger = new Logger(ProductStyleService.name);

  constructor(@Inject('PRODUCT_SERVICE') private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.productStyleServiceGrpc =
      this.client.getService<ProductStyleServiceGrpc>('ProductStyleService');
  }

  async findAll(): Promise<ProductStyle[]> {
    try {
      const result = await this.productStyleServiceGrpc
        .findAll({})
        .pipe(
          map((response) => {
            // this.logger.debug('Raw response from gRPC service:', JSON.stringify(response));
            const mappedStyles = response.productStyles.map((style) => {
              // this.logger.debug('Raw style data:', JSON.stringify(style));
              return {
                id: style.id,
                name: style.name,
                description: style.description,
                isActive: style.isActive,
                createdAt: style.createdAt,
                updatedAt: style.updatedAt,
              };
            });
            return mappedStyles;
          }),
        )
        .toPromise();

      return result;
    } catch (error) {
      this.logger.error('Failed to fetch product styles', error.stack);
      throw error;
    }
  }

  async findOne(id: number): Promise<ProductStyle> {
    try {
      const result = await this.productStyleServiceGrpc
        .findOne({ id })
        .pipe(
          map((style) => ({
            id: style.id,
            name: style.name,
            description: style.description,
            isActive: style.isActive,
            createdAt: style.createdAt,
            updatedAt: style.updatedAt,
          })),
        )
        .toPromise();

      return result;
    } catch (error) {
      this.logger.error(
        `Failed to fetch product style with id: ${id}`,
        error.stack,
      );
      throw error;
    }
  }

  async create(productStyleData: Partial<ProductStyle>): Promise<ProductStyle> {
    const requestData = {
      name: productStyleData.name,
      description: productStyleData.description,
      isActive: productStyleData.isActive,
    };

    try {
      const result = await this.productStyleServiceGrpc
        .create(requestData)
        .pipe(
          map((style) => ({
            id: style.id,
            name: style.name,
            description: style.description,
            isActive: style.isActive,
            createdAt: style.createdAt,
            updatedAt: style.updatedAt,
          })),
        )
        .toPromise();

      return result;
    } catch (error) {
      this.logger.error('Failed to create product style', error.stack);
      throw error;
    }
  }

  async update(
    id: number,
    productStyleData: Partial<ProductStyle>,
  ): Promise<ProductStyle> {
    const requestData = {
      id,
      description: productStyleData.description,
      is_active: productStyleData.isActive,
    };

    try {
      const result = await this.productStyleServiceGrpc
        .update(requestData)
        .pipe(
          map(
            (style) =>
              ({
                id: style.id,
                name: style.name,
                description: style.description,
                isActive: style.isActive,
                createdAt: style.createdAt,
                updatedAt: style.updatedAt,
              }) as ProductStyle,
          ),
        )
        .toPromise();

      return result;
    } catch (error) {
      this.logger.error(
        `Failed to update product style with id: ${id}`,
        error.stack,
      );
      throw error;
    }
  }

  async remove(id: number): Promise<boolean> {
    try {
      const result = await this.productStyleServiceGrpc
        .remove({ id })
        .pipe(map((response) => response.success))
        .toPromise();

      return result;
    } catch (error) {
      this.logger.error(
        `Failed to remove product style with id: ${id}`,
        error.stack,
      );
      throw error;
    }
  }
}
