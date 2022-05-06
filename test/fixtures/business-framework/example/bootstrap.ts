import { XApplication } from '../src/index';

export async function main() {
    const app: XApplication = new XApplication({
        manifest: './manifest.json' // or /manifest.{env}.json
    });
    await app.init();
    await app.start(3000);
  
    return app;
};

main();