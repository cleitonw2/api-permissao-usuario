import { EntityRepository, Repository } from "typeorm";
import { ProductOwner } from "../models/ProductOwner";

@EntityRepository(ProductOwner)
class ProductOwnerRepository extends Repository<ProductOwner>{ }

export { ProductOwnerRepository };