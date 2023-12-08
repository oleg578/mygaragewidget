class Config {
    constructor(api_url = 'http://localhost:8000') {
        this.endPoint = api_url;
    }
}

GarageConfig = new Config();