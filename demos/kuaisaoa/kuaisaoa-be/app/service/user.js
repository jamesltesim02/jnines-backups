const Service = require('egg').Service

class UserService extends Service {
  async create(user) {
    return await this.ctx.model.User.create(user)
  }

  async login({username, password}) {
    let dbUser = await this.ctx.model.User.findOne({username})
    console.log(username, password, dbUser)
    if(!dbUser) {
      throw new Error('帐号不存在')
    }

    if(dbUser.password !== password) {
      throw new Error('密码错误')
    }

    return dbUser
  }
}

module.exports = UserService