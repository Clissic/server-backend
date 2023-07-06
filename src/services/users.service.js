import { UserModel } from "../DAO/models/users.model.js";
import { isValidPassword } from "../utils/Bcrypt.js";
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
    const userFound = await UserModel.findById(id);
    return userFound
  }

  async findUser(email, password) {
    const user = await UserModel.findOne(
      {email: email},
      {
        _id: true,
        first_name: true,
        last_name: true,
        email: true,
        age: true,
        password: true,
        role: true,
        cartId: true,
      }
    );
    if (user && isValidPassword(password, user.password)) {
      return user;
    } else {
      return false
    }
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