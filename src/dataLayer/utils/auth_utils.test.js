jest.mock("../utils/DButils");
const auth_utils = require("../utils/auth_utils");
const mockDButils = require("../utils/DButils");

const mockExecQuery = (mockUserInfo) =>
  mockDButils.execQuery.mockImplementation(mockUserInfo);

describe("getUserInfo", () => {
  beforeEach(() => jest.resetAllMocks());

  test("should find and return user info", async () => {
    const mockUserInfo = ["amit"];
    mockExecQuery(async () => mockUserInfo);
    const result = await auth_utils.getUserInfo("amit");
    expect(result).toEqual("amit");
  });

  test("should check query", async () => {
    const mockUserInfo = ["amit"];
    const mockedImp = mockExecQuery(async () => mockUserInfo);
    await auth_utils.getUserInfo("amit");
    const query = mockedImp.mock.calls[0][0];
    expect(query).toEqual(`SELECT * FROM dbo.Users WHERE username = 'amit'`);
  });

  test("should not find user and return error", async () => {
    const mockUserInfo = null;
    mockExecQuery(async () => mockUserInfo);
    const result = await auth_utils.getUserInfo("sapir");
    expect(result).toBeNull();
  });

  test("should return an error", async () => {
    const mockUserInfo = async () => {
      throw new Error("some network issue occured");
    };
    mockExecQuery(mockUserInfo);
    await expect(auth_utils.getUserInfo("ran")).rejects.toThrow();
  });
});

describe("insertUserInfo", () => {
  beforeEach(() => jest.resetAllMocks());

  const user = {
    username: "amit",
    firstName: "Amit",
    lastName: "Ostrov",
    country: "Israel",
    password: "123456",
    email: "amit@blabla.com",
    image: "",
  };

  test("should insert user info", async () => {
    const mockUserInfo = user;
    mockExecQuery(async () => mockUserInfo);
    const result = await auth_utils.insertUserInfo(mockUserInfo);
    expect(result).toEqual(mockUserInfo);
  });

  test("should check query with image", async () => {
    const mockUserInfo = { ...user, image: "amit.jpg" };
    const mockedImp = mockExecQuery(async () => mockUserInfo);
    await auth_utils.insertUserInfo(mockUserInfo);
    const query = mockedImp.mock.calls[0][0];
    expect(query).toEqual(
      `INSERT INTO dbo.Users (username, firstname, lastname, country, password , email , image) VALUES ('${mockUserInfo.username}','${mockUserInfo.firstName}', '${mockUserInfo.lastName}', '${mockUserInfo.country}', '${mockUserInfo.password}', '${mockUserInfo.email}', '${mockUserInfo.image}');`
    );
  });

  test("should check query without image", async () => {
    const mockUserInfo = user;
    const mockedImp = mockExecQuery(async () => mockUserInfo);
    await auth_utils.insertUserInfo(mockUserInfo);
    const query = mockedImp.mock.calls[0][0];
    expect(query).toEqual(
      `INSERT INTO dbo.Users (username, firstname, lastname, country, password , email , image) VALUES ('${mockUserInfo.username}','${mockUserInfo.firstName}', '${mockUserInfo.lastName}', '${mockUserInfo.country}', '${mockUserInfo.password}', '${mockUserInfo.email}', 'null');`
    );
  });

  test("should return an error", async () => {
    const mockUserInfo = async () => {
      throw new Error("some network issue occured");
    };
    mockExecQuery(mockUserInfo);
    await expect(auth_utils.insertUserInfo(user)).rejects.toThrow();
  });
});

describe("getUserId", () => {
  beforeEach(() => jest.resetAllMocks());

  test("should find and return user info", async () => {
    const mockUserInfo = ["amit"];
    mockExecQuery(async () => mockUserInfo);
    const result = await auth_utils.getUserInfo("amit");
    expect(result).toEqual("amit");
  });

  test("should check query", async () => {
    const mockUserInfo = ["amit"];
    const mockedImp = mockExecQuery(async () => mockUserInfo);
    await auth_utils.getUserInfo("amit");
    const query = mockedImp.mock.calls[0][0];
    expect(query).toEqual(`SELECT * FROM dbo.Users WHERE username = 'amit'`);
  });

  test("should not find user and return error", async () => {
    const mockUserInfo = null;
    mockExecQuery(async () => mockUserInfo);
    const result = await auth_utils.getUserInfo("sapir");
    expect(result).toBeNull();
  });

  test("should return error of timeout", async () => {
    const mockUserInfo = async () => {
      throw new Error("some network issue occured");
    };
    mockExecQuery(mockUserInfo);
    await expect(auth_utils.getUserInfo("ran")).rejects.toThrow();
  });
});

describe("checkUnionRep", () => {
  beforeEach(() => jest.resetAllMocks());

  test("should find and return user info", async () => {
    const mockUserInfo = ["amit"];
    mockExecQuery(async () => mockUserInfo);
    const result = await auth_utils.getUserInfo("amit");
    expect(result).toEqual("amit");
  });

  test("should check query", async () => {
    const mockUserInfo = ["amit"];
    const mockedImp = mockExecQuery(async () => mockUserInfo);
    await auth_utils.getUserInfo("amit");
    const query = mockedImp.mock.calls[0][0];
    expect(query).toEqual(`SELECT * FROM dbo.Users WHERE username = 'amit'`);
  });

  test("should not find user and return error", async () => {
    const mockUserInfo = null;
    mockExecQuery(async () => mockUserInfo);
    const result = await auth_utils.getUserInfo("sapir");
    expect(result).toBeNull();
  });

  test("should return error of timeout", async () => {
    const mockUserInfo = async () => {
      throw new Error("some network issue occured");
    };
    mockExecQuery(mockUserInfo);
    await expect(auth_utils.getUserInfo("ran")).rejects.toThrow();
  });
});

describe("getUsers", () => {
  beforeEach(() => jest.resetAllMocks());

  test("should find and return user info", async () => {
    const mockUserInfo = ["amit"];
    mockExecQuery(async () => mockUserInfo);
    const result = await auth_utils.getUserInfo("amit");
    expect(result).toEqual("amit");
  });

  test("should check query", async () => {
    const mockUserInfo = ["amit"];
    const mockedImp = mockExecQuery(async () => mockUserInfo);
    await auth_utils.getUserInfo("amit");
    const query = mockedImp.mock.calls[0][0];
    expect(query).toEqual(`SELECT * FROM dbo.Users WHERE username = 'amit'`);
  });

  test("should not find user and return error", async () => {
    const mockUserInfo = null;
    mockExecQuery(async () => mockUserInfo);
    const result = await auth_utils.getUserInfo("sapir");
    expect(result).toBeNull();
  });

  test("should return error of timeout", async () => {
    const mockUserInfo = async () => {
      throw new Error("some network issue occured");
    };
    mockExecQuery(mockUserInfo);
    await expect(auth_utils.getUserInfo("ran")).rejects.toThrow();
  });
});
