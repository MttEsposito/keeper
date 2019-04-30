const { type, homedir, platform } = require('os');

export const CONST = {
    apiKey: `${type()}o${platform()}`,
    usersFile: "3d163b4626f322bc4afbae44eb95d0c493b6e995.txt",
    dataFile: "974dcc4343d3cfa28efd20a28f88f2da653052c3.txt",
    path: `${homedir()}`
}
