import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException, Inject } from '@nestjs/common';

import { CreateAppointmentCommand } from './create-appointment.command';
import { AppointmentRepository, AppointmentDomainModel } from '@domain/booking/repositories/appointment.repository';

@CommandHandler(CreateAppointmentCommand)
export class CreateAppointmentHandler implements ICommandHandler<CreateAppointmentCommand> {
  constructor(
    @Inject('AppointmentRepository') private readonly appointmentRepo: AppointmentRepository,
  ) {}

  async execute(command: CreateAppointmentCommand): Promise<AppointmentDomainModel> {
    const { artistId, clientId, scheduledAt, description } = command;

    const when = new Date(scheduledAt);
    if (isNaN(when.getTime())) throw new BadRequestException('Fecha inválida');
    if (when.getTime() < Date.now()) throw new BadRequestException('La fecha debe ser futura');

    // Validación simple: no más de una cita en el mismo slot de 1 hora
    const start = new Date(when);
    const end = new Date(when);
    end.setHours(end.getHours() + 1);

    const overlapping = await this.appointmentRepo.findByArtistAndInterval(artistId, start, end);
    if (overlapping.length > 0) {
      throw new BadRequestException('El artista ya tiene una cita en ese horario');
    }

    return this.appointmentRepo.create({ artistId, clientId, scheduledAt: when, description });
  }
}


