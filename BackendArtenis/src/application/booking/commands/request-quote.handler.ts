import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException, Inject } from '@nestjs/common';

import { RequestQuoteCommand } from './request-quote.command';
import { QuoteRepository, QuoteDomainModel } from '@domain/booking/repositories/quote.repository';

@CommandHandler(RequestQuoteCommand)
export class RequestQuoteHandler implements ICommandHandler<RequestQuoteCommand> {
  constructor(@Inject('QuoteRepository') private readonly quoteRepo: QuoteRepository) {}

  async execute(command: RequestQuoteCommand): Promise<QuoteDomainModel> {
    const { artistId, clientId, description } = command;
    if (!description || !description.trim()) {
      throw new BadRequestException('La descripción es requerida');
    }
    return this.quoteRepo.create({ artistId, clientId, description: description.trim() });
  }
}


