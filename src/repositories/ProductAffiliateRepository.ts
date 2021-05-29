import { EntityRepository, Repository } from "typeorm";
import { ProductAffiliate } from "../models/ProductAffiliate";


@EntityRepository(ProductAffiliate)
class ProductAffiliateRepository extends Repository<ProductAffiliate>{ }

export { ProductAffiliateRepository };