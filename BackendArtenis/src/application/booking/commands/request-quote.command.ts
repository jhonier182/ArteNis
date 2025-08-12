export class RequestQuoteCommand {
  constructor(
    public readonly artistId: string,
    public readonly clientId: string,
    public readonly description: string,
  ) {}
}


