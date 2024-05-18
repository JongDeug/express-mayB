import defaultSwagger from './defaultSwagger.js';
import * as UserSwagger from '../users/swagger.js';

const Swaggers = {
  UserSwagger,
};

// console.log(Swaggers);

// 1) 가공하는 코드
const { paths } = Object.values(Swaggers).reduce((acc, apis) => {
  const APIs = Object.values(apis).map((api) => {
    return { ...api };
  });
  APIs.forEach(api => {
    const key = Object.keys(api)[0];
    // 없으면 생성
    if (!acc.paths[key]) {
      acc.paths = {
        ...acc.paths,
        ...api,
      };
    } else {
      // 있으면 해당 키에 넣기
      acc.paths[key] = {
        ...acc.paths[key],
        ...api[key],
      };
    }
  });
  console.log(acc);
  return acc;
}, { paths: {} });

// 2) 스웨거에 등록할 json 만들기, defaultSwagger + 1)에서 가공할 paths
export const swaggerDocs = {
  ...defaultSwagger,
  // path 등록
  paths,
};

// 3) 스웨거에 등록하는 방법
export const options = {
  swaggerOptions: {
    url: '/swagger.json',
  },
};
