import { UserModel } from "../DAO/models/users.model.js";
import { CartsService } from "./carts.service.js";

class userService {
  async getAll() {
    const users = await UserModel.find(
      {},
      {
        _id: true,
        firstName: true,
        lastName: true,
        email: true,
      }
    );
    return users;
  }

  async findById(id) {
    const product = await UserModel.findById(id);
    return product
  }

  async create({ first_name, last_name, email, age, password, role }) {
    const userCreated = await UserModel.create({
      first_name,
      last_name,
      email,
      age,
      password,
      role,
      cartId: CartsService.create(),
    });
    return userCreated;
  }

  async updateOne({ _id, first_name, last_name, email, age, password, role, cartId }) {
    const userUpdated = await UserModel.updateOne(
      {
        _id: _id,
        cartId: cartId,
      },
      {
        first_name,
        last_name,
        email,
        age,
        password,
        role,
      }
    );
    return userUpdated;
  }

  async deleteOne(_id) {
    const result = await UserModel.deleteOne({ _id: _id });
    return result;
  }
}
export const UserService = new userService();