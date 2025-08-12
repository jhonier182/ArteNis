import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';

// Entidades
import { AppointmentEntity } from '@infrastructure/database/mysql/entities/appointment.entity';
import { QuoteEntity } from '@infrastructure/database/mysql/entities/quote.entity';

// Repositorios dominio
import { AppointmentRepository } from '@domain/booking/repositories/appointment.repository';
import { QuoteRepository } from '@domain/booking/repositories/quote.repository';

// Repositorios infraestructura
import { AppointmentRepositoryImpl } from '@infrastructure/database/mysql/repositories/appointment.repository.impl';
import { QuoteRepositoryImpl } from '@infrastructure/database/mysql/repositories/quote.repository.impl';

// Handlers
import { CreateAppointmentHandler } from '@application/booking/commands/create-appointment.handler';
import { CancelAppointmentHandler } from '@application/booking/commands/cancel-appointment.handler';
import { ConfirmAppointmentHandler } from '@application/booking/commands/confirm-appointment.handler';
import { CompleteAppointmentHandler } from '@application/booking/commands/complete-appointment.handler';
import { GetMyAppointmentsHandler } from '@application/booking/queries/get-my-appointments.handler';
import { RequestQuoteHandler } from '@application/booking/commands/request-quote.handler';

@Module({
  imports: [
    TypeOrmModule.forFeature([AppointmentEntity, QuoteEntity]),
    CqrsModule,
  ],
  controllers: [],
  providers: [
    { provide: 'AppointmentRepository', useClass: AppointmentRepositoryImpl },
    { provide: 'QuoteRepository', useClass: QuoteRepositoryImpl },
    CreateAppointmentHandler,
    CancelAppointmentHandler,
    ConfirmAppointmentHandler,
    CompleteAppointmentHandler,
    GetMyAppointmentsHandler,
    RequestQuoteHandler,
  ],
  exports: [
    'AppointmentRepository',
    'QuoteRepository',
  ],
})
export class BookingModule {}
