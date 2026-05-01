declare global{
    namespace NodeJS {
        interface ProcessEnv {
            TINYURL: string
        }
    }
}

export {};