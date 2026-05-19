import { MockMethod } from 'vite-plugin-mock';

const userMock: Array<MockMethod> = [
  {
    url: '/api/login',
    method: 'post',
    response: config => {
      const { username, password } = config.body;
      if (username === 'admin' && password === '123456') {
        return {
          code: 200,
          msg: '登录成功',
          data: {
            accessToken: '1234567890',
            name: 'admin'
          }
        };
      } else {
        return {
          code: -1,
          msg: '账号或密码错误'
        };
      }
    }
  },
  {
    url: '/api/logout',
    method: 'post',
    response: () => {
      return {
        code: 200,
        msg: '退出成功',
        data: true
      };
    }
  },
  {
    url: '/api/project/list',
    method: 'get',
    response: () => {
      return {
        code: 200,
        msg: '成功',
        data: {
          list: [
            {
              id: 1,
              name: '项目1',
              code: '123456',
              crateTime: '2023-01-01 12:00:00'
            },
            {
              id: 2,
              name: '项目2',
              code: '123456',
              crateTime: '2023-01-01 12:00:00'
            }
          ],
          total: 2
        }
      };
    }
  }
];

export default userMock;
