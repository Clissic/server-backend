import { UserModel } from "../DAO/models/users.model.js";

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

  async create({ firstName, lastName, email }) {
    const userCreated = await UserModel.create({
      firstName,
      lastName,
      email,
    });
    return userCreated;
  }

  async updateOne({ _id, firstName, lastName, email }) {
    const userUpdated = await UserModel.updateOne(
      {
        _id: _id,
      },
      {
        firstName,
        lastName,
        email,
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