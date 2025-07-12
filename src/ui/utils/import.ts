export function normalizeModule(module: Record<string, unknown>): Record<string, string> {
    const keys = Object.keys(module);

    const normalizedModule = {} as Record<string, unknown>;
    for(let i = 0; i < keys.length; i++){
        const key = keys[i];
        let endIndex = undefined;
        let startIndex = 0;
        for(let j = key.length - 1; j >= 0; j--){
            if(key[j]=== ".") endIndex = j;

            if(key[j]=== "/"){
                startIndex = j + 1;
                break;
            }
        }

       const normalizdeKey = key.substring(startIndex, endIndex);
       normalizedModule[normalizdeKey] = module[key];
    }
    return normalizedModule as Record<string, string>;
}