import { EntityRepository, Repository } from "typeorm";
import { Seller } from "../models/Seller";


@EntityRepository(Seller)
class SellerRepository extends Repository<Seller>{ }

export { SellerRepository }