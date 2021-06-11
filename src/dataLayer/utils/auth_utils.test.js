jest.mock("../utils/DButils");
const auth_utils = require("../utils/auth_utils");
const mockDButils = require("../utils/DButils");

const mockExecQuery = (mockUserInfo) =>
  mockDButils.execQuery.mockImplementation(mockUserInfo);

describe("getUserInfo", () => {
  beforeEach(() => jest.resetAllMocks());

  test("should find and return user info", async () => {
    const mockUsername = ["amit"];
    mockExecQuery(async () => mockUsername);
    const result = await auth_utils.getUserInfo("amit");
    expect(result).toEqual(mockUsername[0]);
  });

  test("should check query", async () => {
    const mockUsername = ["amit"];
    const mockedImp = mockExecQuery(async () => mockUsername);
    await auth_utils.getUserInfo("amit");
    const query = mockedImp.mock.calls[0][0];
    expect(query).toEqual(`SELECT * FROM dbo.Users WHERE username = 'amit'`);
  });

  test("should not find user and return null", async () => {
    const mockUsername = null;
    mockExecQuery(async () => mockUsername);
    const result = await auth_utils.getUserInfo("sapir");
    expect(result).toBeNull();
  });

  test("should return an error", async () => {
    const mockError = async () => {
      throw new Error("some network issue occured");
    };
    mockExecQuery(mockError);
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
    const mockUser = user;
    mockExecQuery(async () => mockUser);
    const result = await auth_utils.insertUserInfo(mockUser);
    expect(result).toEqual(mockUser);
  });

  test("should check query with image", async () => {
    const mockUser = { ...user, image: "amit.jpg" };
    const mockedImp = mockExecQuery(async () => mockUser);
    await auth_utils.insertUserInfo(mockUser);
    const query = mockedImp.mock.calls[0][0];
    expect(query).toEqual(
      `INSERT INTO dbo.Users (username, firstname, lastname, country, password , email , image) VALUES ('${mockUser.username}','${mockUser.firstName}', '${mockUser.lastName}', '${mockUser.country}', '${mockUser.password}', '${mockUser.email}', '${mockUser.image}');`
    );
  });

  test("should check query without image", async () => {
    const mockUser = user;
    const mockedImp = mockExecQuery(async () => mockUser);
    await auth_utils.insertUserInfo(mockUser);
    const query = mockedImp.mock.calls[0][0];
    expect(query).toEqual(
      `INSERT INTO dbo.Users (username, firstname, lastname, country, password , email , image) VALUES ('${mockUser.username}','${mockUser.firstName}', '${mockUser.lastName}', '${mockUser.country}', '${mockUser.password}', '${mockUser.email}', 'null');`
    );
  });

  test("should return an error", async () => {
    const mockError = async () => {
      throw new Error("some network issue occured");
    };
    mockExecQuery(mockError);
    await expect(auth_utils.insertUserInfo(user)).rejects.toThrow();
  });
});

describe("getUserId", () => {
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

  test("should find and return userId", async () => {
    const mockUserId = [{ userId: 1 }];
    mockExecQuery(async () => mockUserId);
    const result = await auth_utils.getUserId(user);
    expect(result).toEqual(1);
  });

  test("should check query", async () => {
    const mockUserId = [{ userId: 1 }];
    const mockedImp = mockExecQuery(async () => mockUserId);
    await auth_utils.getUserId(user);
    const query = mockedImp.mock.calls[0][0];
    expect(query).toEqual(
      `SELECT userId FROM dbo.Users WHERE username = 'amit'`
    );
  });

  test("should not find user and return an error", async () => {
    mockExecQuery(async () => null);
    await expect(auth_utils.getUserId(user)).rejects.toThrow();
  });

  test("should return an error", async () => {
    const mockUserInfo = async () => {
      throw new Error("some network issue occured");
    };
    mockExecQuery(mockUserInfo);
    await expect(auth_utils.getUserId(user)).rejects.toThrow();
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
