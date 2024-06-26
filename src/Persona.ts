import GenerativeClientImpl, { GenerativeClient } from './GenerativeClient'

export default class PersonaImpl implements Persona {
    public static Class?: new (options: PersonaOptions) => Persona

    public readonly name?: string
    public readonly context?: string
    public readonly corpus?: string[]
    public readonly history: SessionInteraction[]
    protected client: GenerativeClient

    protected constructor(options: PersonaOptions) {
        const { client, name, context, corpus } = options ?? {}

        this.client = client
        this.name = name
        this.context = context
        this.corpus = corpus
        this.history = []
    }

    public static Create(options?: Partial<PersonaOptions>) {
        const { client = this.Client(), name, context, corpus } = options ?? {}
        return new (this.Class ?? this)({ client, name, context, corpus })
    }

    public async generate(prompt: string) {
        const contextPrompt = this.addContextToPrompt(prompt)
        const response = this.client.generate(contextPrompt)

        this.history.push({ prompt: contextPrompt, response })

        return response
    }

    private addContextToPrompt(prompt: string) {
        return this.context ? `${this.context} ${prompt}` : prompt
    }

    private static Client() {
        return GenerativeClientImpl.Create({
            clientUrl: 'abcd',
            apiKey: '1234',
        })
    }
}

export interface Persona {
    generate(prompt: string): Promise<string>
    name?: string
    context?: string
    corpus?: string[]
}

export interface PersonaOptions {
    client: GenerativeClient
    name?: string
    context?: string
    corpus?: string[]
}

export interface SessionInteraction {
    prompt: string
    response: string
}
