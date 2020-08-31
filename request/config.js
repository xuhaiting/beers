function getConfig() {
    const NODE_ENV = process.env.NODE_ENV;
    let config = {};
    switch (NODE_ENV) {
        case "development":
        case "tst":
            config = {
                baseUrl: "https://galaxy-tst.ysd.com/backend"
            }
            break;
        case "sit":
            config = {
                baseUrl: "https://galaxy-sit.ysd.com/backend"
            }
            break;
        case "uat":
            config = {
                baseUrl: "https://galaxy-uat.ysd.com/backend"
            }
            break;
        case "production":
            config = {
                baseUrl: "https://galaxy.ysd.com/backend"
            }
            break;
        default:
            config = {
                baseUrl: "https://galaxy-tst.ysd.com/backend"
            }
    }
    return config
}

const config = getConfig();

export default config;