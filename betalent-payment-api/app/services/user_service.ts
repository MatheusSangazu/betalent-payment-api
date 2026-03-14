import User from '#models/user'

/**
 * Serviço responsável pela gestão de usuários (administradores)
 */
export default class UserService {
  /**
   * Lista todos os usuários
   */
  public async all() {
    return await User.all()
  }

  /**
   * Busca um usuário por ID
   */
  public async find(id: number) {
    return await User.findOrFail(id)
  }

  /**
   * Cria um novo usuário
   */
  public async create(data: any) {
    return await User.create(data)
  }

  /**
   * Atualiza um usuário existente
   */
  public async update(id: number, data: any) {
    const user = await User.findOrFail(id)
    user.merge(data)
    await user.save()
    return user
  }

  /**
   * Remove um usuário
   */
  public async delete(id: number) {
    const user = await User.findOrFail(id)
    await user.delete()
  }
}
