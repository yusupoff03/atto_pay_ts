import { Category } from '@interfaces/category.interface';
export declare class CategoryService {
    getAllCategories(lang: string): Promise<Category[]>;
}
